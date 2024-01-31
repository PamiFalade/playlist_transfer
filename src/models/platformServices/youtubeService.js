import { Buffer } from "buffer";
import { parse } from "tinyduration";
import * as sharedService from "../sharedService";

const regexPattern = "(?<=list\=)[A-Za-z0-9\-]*";
const apiKey = "AIzaSyAtEt3TZA-bkv5fQZ4x7cg_MhJI1cRgM-k";
const clientID = "1054375184671-ejm71f93dt6i3hh1ou4na743n2revdrp.apps.googleusercontent.com";
const secret = "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";
const state_parameter_passthrough_value = "accessGranted";
const youtube_authorize_endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const redirect_uri = "http://localhost:3000/destination-select";

/// Scopes are already defined on Google Cloud
/// https://console.cloud.google.com/apis/credentials/oauthclient?previousPage=%2Fapis%2Fcredentials%3Fproject%3Dplaylist-transfer-411715%26supportedpurview%3Dproject&project=playlist-transfer-411715&supportedpurview=project
const SCOPES = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.readonly"
];

/// Used to extract the playlist ID from the Spotify share link using Regex
export const extractPlaylistID = (link) => {
    const regex = new RegExp(regexPattern);
    const playlistID = link.match(regex)[0];

    return playlistID;
};

/// Gets the app's YouTube token using the YouTube API
/// YouTube API: https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
export const fetchToken = () => {

};

/// Redirect to the YouTube API's user login and authorization page
/// YouTube API: https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps
export const redirectToUserAuthorization = () => {
  let authorizeURL = youtube_authorize_endpoint + "?scope=" + SCOPES.join(" ");
  authorizeURL += "&include_granted_scopes=true";
  authorizeURL += "&state=" + state_parameter_passthrough_value;
  authorizeURL += "&redirect_uri=" + encodeURI(redirect_uri);
  authorizeURL += "&response_type=token";
  authorizeURL += "&client_id=" + clientID;

  window.location.href = authorizeURL; // Show YouTube's authorization screen.
};
  
// Helper function for parsing code from the return URL after getting authorization from the user
const getCode = () => {
  const queryString = window.location.hash;
  let code = "";
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get("access_token");
  }
  
  return code;
};

/// Retrieve token that is returned when user logs in and authorizes the app
export const getUserAuthorizationToken = () => {
  let access_token = getCode(); //Get the code from the return of the login
  
  return access_token;
};

/// SUMMARY: Fetch the user's account name and profile picture
/// YouTube API: https://developers.google.com/youtube/v3/docs/channels/list
const getUserProfile = async (token) => {
    let profileResponse = fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true&key=${apiKey}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
            "Content-type": "application/json"
        }
    }).then((response) => {
        if(response.ok){
          console.log("Successfully fetched user's YouTube channel!");
        }
        else {
          console.error("Error with retrieving user's YouTube channel");
        }
        return response.json();
      }).catch((error) => console.error(error));
    
    return profileResponse;
};

/// SUMMARY: Fetch the user's list of playlists
/// YouTube API: https://developers.google.com/youtube/v3/docs/playlists/list
const getUserPlaylists = async (token) => {
  let playlistResponse = fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=${apiKey}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token
    }
  }).then((response) => {
    if(response.ok) {
      console.log("Successfully fetched user's list of YouTube playlists!");
    }
    else {
      console.error("Error with retrieving user's list of YouTube playlists")
    }
    return response.json();
  }).catch((error) => console.error(error));

  return playlistResponse;
};

/// Gets the necessary details from the user's account, to display on the DestinationSelect page
export const getUserAccount = async(token) => {
  let userAuthToken = token;
  let userAccount = {
    username: "",
    userID: "",
    profileImg: "",
    playlists: []
  };

  // Get the user's username and profile image
  await getUserProfile(userAuthToken).then((profileResponse) => {
    userAccount.username = profileResponse.items[0].snippet.title;
    userAccount.userID = profileResponse.items[0].id;
    userAccount.profileImg = profileResponse.items[0].snippet.thumbnails.high.url;
  });

  // Get the list of playlists saved in the user's account, then extract only necessary info for each playlist and add them to the userAccouunt object that will be returned
  await getUserPlaylists(userAuthToken).then((playlistResponse) => {

    playlistResponse.items.forEach(playlist => {

      userAccount.playlists.push({
        playlistName: playlist.snippet.title,
        username: playlist.snippet.channelTitle,
        id: playlist.id,
        tracks: [],
        image: playlist.snippet.thumbnails.default.url,
        length: ""
      });

    });
  });
  console.log(userAccount);
  return userAccount;
};

/// SUMMARY: Fetch the playlist information
/// DETAILS: This YouTube API endpoint only returns details of the playlist, including its name, the number of tracks, etc.
/// YouTube API: https://developers.google.com/youtube/v3/docs/playlists/list
const fetchPlaylist = async (playlistID) => {
  let playlist = await fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cid%2Cstatus&id=${playlistID}&key=${apiKey}`, 
  {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      }
  }).then((response) => {
      if (response.ok) {
          console.log("Successfully fetched YouTube playlist!");
      }
      else {
          console.error("Error with retrieving YouTube playlist");
      }
      return response.json();
  }).catch((error) => console.error(error));

  return playlist.items[0];
};

/// SUMMARY: Fetch a playlist's tracks
/// YouTube API: https://developers.google.com/youtube/v3/docs/playlistItems/list
const fetchTracks = async (playlistID, offset, limit=50) => {
  let tracks = fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails%2Cid%2Cstatus&maxResults=50&playlistId=${playlistID}&key=${apiKey}`, 
  {
    method: "GET",
    headers: {
        "Content-type": "application/json",
    }
  }).then(response => {
    if(response.ok){
      console.log("Successfully got the next batch of tracks!");
    }
    else {
      console.error("Error with getting the next batch of tracks...");
    }
    return response.json();
  }).catch(error => console.error(error));

  return tracks;
};

/// SUMMARY: Fetch the requested playlist with the playlist's ID
/// DETAILS: 
export const fetchPlaylistAndTracks = async (playlistID) => {

  let playlist, numTracksFetched, totalNumTracks;
  let extraTracks = [];
  let extraTracksLimit = 50;    // There is a limit on the number of items that is retrieved from a playlist. The maximum for the Spotify API call in fetchExtraTracks() is 50

  // Get the playlist 
  playlist = await fetchPlaylist(playlistID);
  
  totalNumTracks = playlist.contentDetails.itemCount;
  numTracksFetched = 0;

  // If the playlist has more tracks than the YouTube API call's limit, get the rest of them
  let nextBatch;    // The variable that will hold the next set of tracks that are fetched
  while(numTracksFetched < totalNumTracks) {                // While not all the tracks have been fetched, keep calling fetchExtraTracks()
    nextBatch = await fetchTracks(playlistID, numTracksFetched, extraTracksLimit);
    numTracksFetched += extraTracksLimit;
    extraTracks.push(...nextBatch.items);
  }

  let fullPlaylist = { 
    playlistName: playlist.snippet.title,
    username: playlist.snippet.channelTitle,
    id: playlistID,
    tracks: [...extraTracks],
    image: playlist.snippet.thumbnails.high.url
  };

  return fullPlaylist;
};

// Helper function to get the names of the artists on a song and put them in a comma-separated string
const extractSongArtists = (song) => {
  let artistList = song.track.artists[0].name;
  let index = 1;
  while(index < song.track.artists.length) {
      artistList += ", " + song.track.artists[index].name;
      index++;
  }

  return artistList;
};

/// SUMMARY: Helper function that searches up the videos of each song specified by the songIDs.
/// DETAILS: This function is used to ultimately gain the durations of each song.
/// YouTube API: https://developers.google.com/youtube/v3/docs/videos/list
const getSongDurations = async (songIDs) => {

    let encodedSongIDs = encodeURIComponent(songIDs);
    let videos = fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cid%2Cstatus&id=${encodedSongIDs}&key=${apiKey}`,
    {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => {
        if(response.ok){
          console.log("Successfully got video information!");
        }
        else {
          console.error("Error with getting video information...");
        }
        return response.json();
      }).catch(error => console.error(error));

    return videos;
}

/// SUMMARY: Extracts the song's title, image, artist(s), and length, from the tracklist that comes in the Spotify playlist object.
export const extractSongInfo = async (playlist) => {
    let formattedSongArray = [];
    let videoIDs = [];      // Will be a comma-separated list of the video IDs, which will be used to find the duration of each YouTube video
    let totalDuration = 0;  // The total run time of the playlist in ms
    
    for(let i=0; i<playlist.tracks.length; i++){

        // Add the video ID to the list
        videoIDs.push(playlist.tracks[i].snippet.resourceId.videoId);

        // Add the song object to the array
        formattedSongArray.push({
            name: playlist.tracks[i].snippet.title,
            album: playlist.tracks[i].snippet.description,
            image: playlist.tracks[i].snippet.thumbnails.default.url,
            artists: playlist.tracks[i].snippet.videoOwnerChannelTitle,
            length_ms: 0,
            length: "",
            isExplicit: null,
            release_date: playlist.tracks[i].contentDetails.videoPublishedAt,
            type: null,
            isrc: null
        });
    }
    // Get the lengths of each song
    await getSongDurations(videoIDs.join(","))
        .then(durationsResponse => {
            for(let i=0; i<durationsResponse.items.length; i++){
                
                // Use tinyduration package to parse the video durations, which are stored in ISO 8601 format
                let duration = parse(durationsResponse.items[i].contentDetails.duration);
                let duration_ms = (duration.hours ?? 0) * 60 * 60 * 1000 + (duration.minutes ?? 0) * 60 * 1000 + (duration.seconds ?? 0) * 1000;
                totalDuration += duration_ms;

                formattedSongArray[i].length_ms = duration_ms;
                formattedSongArray[i].length = sharedService.millisToHoursMinutesAndSeconds(duration_ms);
            }
        }).then(() => {
            playlist.tracks = [...formattedSongArray];
            playlist.length = sharedService.millisToHoursMinutesAndSeconds(totalDuration);
        });

    return playlist;
};

/// Create the playlist on YouTube
/// YouTube API: https://developers.google.com/youtube/v3/docs/playlists/insert
const createPlaylist = (token, userID, playlistName) => {
  let newPlaylist = fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&key=${apiKey}`, {
    method: "POST",
    headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "snippet": {
            "title": playlistName,
            "description": "Playlist copied by playlist-transfer"
        }
    })
  }).then(response => {
    if(response.ok){
      console.log("Successfully created the playlist on YouTube!");
    }
    else {
      console.error("Error with creating playlist on YouTube");
    }
    return response.json();
  }).catch(error => console.error(error));

  return newPlaylist;
};

/// Search the track on Spotify by its ISRC and retrieve its URI, which will be used to add the track to the playlist
/// Spotify API: https://developer.spotify.com/documentation/web-api/reference/search
const searchTrackByISRC = async (token, songISRC) => {
  
  let queryToEncode = `isrc:${songISRC}`;
  let encodedQuery = encodeURIComponent(queryToEncode);
  let results = fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=50`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token.access_token
    }
  }).then(response => {
    if(response.ok) {
      console.log("Successfully searched track on Spotify!");
    }
    else {
      console.error("Error with searching on Spotify");
    }
    return response.json();
  }).catch(error => console.error(error));

  return results;
}

/// Search the track on YouTube by its name and its artist's name(s), and retrieve its URI, which will be used to add the track to the playlist
/// YouTube API: https://developers.google.com/youtube/v3/docs/search/list
const searchTrackByName = async(token, song) => {

  let queryToEncode = `${sharedService.extractSongName(song.name)} - ${song.artists}`;
  let encodedQuery = encodeURIComponent(queryToEncode);
  let results = fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodedQuery}&type=video&key=${apiKey}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    }
  }).then(response => {
    if(response.ok) {
      console.log("Successfully searched track on YouTube!");
    }
    else {
      console.error("Error with searching on YouTube");
    }
    return response.json();
  }).catch(error => console.error(error));

  return results;
};

/// Helper function that makes sure that the exact song is found
const findTrack = (results, song) => {
//   let trackID = "";       // The track that will be put into the playlist
//   let searchResults = [...results.items];

//   for(let i=0; i<searchResults.length; i++) {  
//     if(searchResults[i].snippet.title === song.name && searchResults[i].album.name === song.album) {   // Check for the right version (i.e., the search result is from the same album and has the same Explicit rating)
//       trackID = searchResults[i].uri;
//       break;
//     }
//   };
  let trackID = results.items[0].id.videoId;    // Take the first search result in the list

  return {songName: song.name, trackID: trackID};
};


/// SUMMARY: Add the track to the YouTube playlist
/// DETAILS: YouTube API only allows addition of one video per API call, unlike Spotify API which supports adding multiple tracks in one API call
/// YouTube API: https://developers.google.com/youtube/v3/docs/playlistItems/insert
const addTracksToPlaylist = (token, trackID, playlistID, position) => {
console.log(trackID);
  let addTracksResponse = fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${apiKey}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "snippet":{
            "playlistId": playlistID,
            "position": position,
            "resourceId":{
                "kind": "youtube#video",
                "videoId": trackID
            }
        }
    })
  }).then(response => {
    if(response.ok) {
      console.log("Successfully transferred tracks to YouTube playlist!");
    }
    else {
      console.error("Error with adding tracks to YouTube playlist...");
    }
    return response.json();
  }).catch(error => console.error(error));

  return addTracksResponse;
};

/// Execute the copying of the playlist to the specified Spotify account
export const transferPlaylist = async (token, userID, playlist) => {
  let newPlaylistID = "";   // The ID of the new playlist, which is necessary for adding tracks to it
  let newPlaylistName = playlist.playlistName + " - copy";  // The name that will be used for the newly-created playlist
  let tracksIDArray = [];
  let missingTracks = [];     // List of songs that could not be found reliably on YouTube

  // Step 1: Find and retrieve the Spotify URI's for all the tracks that will be put into the transferred playlist
  await playlist.tracks.forEach(song => {
    searchTrackByName(token, song)
    .then(searchResults => {
        let result = findTrack(searchResults, song);
        console.log(result);
        return result;
    })
    .then(result => {
        if(result.trackID !== ""){
            tracksIDArray.push(result.trackID);
            console.log(`Added ${song.name} to tracksIDArray`);
        }
        else {
            missingTracks.push(result.name);
            console.log(`Added ${song.name} to missingTracks`);
        }
    });
  });

  // Step 2: Create the playlist in the Spotify account and retrieve its Spotify ID
  await createPlaylist(token, userID, newPlaylistName)
    .then(newPlaylistResponse => {
      newPlaylistID = newPlaylistResponse.id;
  });


  // Step 3: Add all of the tracks to the newly-created Spotify playlist
  for(let i=0; i<tracksIDArray.length; i++){
    addTracksToPlaylist(token, tracksIDArray[i], newPlaylistID, i)
    .then(response => {
        console.log(response);
        return response;
    });
   }

  return missingTracks;
};