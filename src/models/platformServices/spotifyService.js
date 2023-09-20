import { Buffer } from "buffer";
import * as sharedService from "../sharedService";

const regexPattern = "(?<=playlist\/)[A-Za-z0-9]*";
const clientID = "9a5c9f439d464286b0b08e0f40de4f4a";
const secret = "c24f98c34e26485db177b530895c1769";
const spotify_authorize_endpoint = "https://accounts.spotify.com/authorize";
const redirect_uri = "http://localhost:3000/destination-select";

const SCOPES = [
  "user-library-read",
  "user-library-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private"
];

/// Used to extract the playlist ID from the Spotify share link using Regex
export const extractPlaylistID = (link) => {
    const regex = new RegExp(regexPattern);
    const playlistID = link.match(regex)[0];

    return playlistID;
};

/// Gets the app's Spotify token using the Spotify API
/// Spotify API: https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
export const fetchToken = () => {
    let tokenResponse = fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${clientID}&client_secret=${secret}`
    }).then((response) => {
        if(response.ok){
            console.log("Successfully fetched Spotify token!");
        }
        else {
            console.log("Token Fetch Failed");
        }
        return response.json();
    } ).catch((error) => console.log(error));

    return tokenResponse;
};

/// Redirect to the Spotify API's user login and authorization page
/// Spotify API: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export const redirectToUserAuthorization = () => {
  let authorizeURL = spotify_authorize_endpoint + "?client_id=" + clientID;
  authorizeURL += "&response_type=code";
  authorizeURL += "&redirect_uri=" + encodeURI(redirect_uri);
  authorizeURL += "&show_dialog=true";
  authorizeURL += "&scope=" + SCOPES.join(" ");

  window.location.href = authorizeURL; // Show Spotify's authorization screen.
};
  
// Helper function for parsing code from the return URL after getting authorization from the user
const getCode = () => {
  const queryString = window.location.search;
  let code = "";
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get("code");
  }
  return code;
};

/// Retrieve token that is returned when user logs in and authorizes the app
/// Spotify API: https://developer.spotify.com/documentation/web-api/tutorials/code-flow
export const getUserAuthorizationToken = () => {
  let code = getCode(); //Get the code from the return of the login

  var today = new Date();

  let stringToEncode = `${clientID}:${secret}`;
  let tokenResponse = fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(stringToEncode).toString("base64")}`,
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`,
  })
    .then((tokenResponse) => {
      if (tokenResponse.ok) {
        console.log(
          "Successfully obtained access token " +
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds() +
            "." +
            today.getMilliseconds()
        );
        return tokenResponse.json();
      } else
        console.log(
          "Error with retrieving access token " +
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds() +
            "." +
            today.getMilliseconds()
        );
      return null;
    })
    .catch((error) => {
      console.log(error);
    });
  return tokenResponse;
};

/// Fetch the user's account name and profile picture
/// Spotify API: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
const getUserProfile = async (token) => {
  let profileResponse = fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token.access_token,
    }
  }).then((response) => {
    if(response.ok){
      console.log("Successfully fetched user's Spotify profile!");
    }
    else {
      console.log("Error with retrieving user's Spotify profile");
    }
    return response.json();
  }).catch((error) => console.log(error));

  return profileResponse;
};

/// Fetch the user's list of playlists
/// Spotify API: https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
const getUserPlaylists = async (token) => {
  let playlistResponse = fetch("https://api.spotify.com/v1/me/playlists", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token.access_token
    }
  }).then((response) => {
    if(response.ok) {
      console.log("Successfully fetched user's list of Spotify playlists!");
    }
    else {
      console.log("Error with retrieving user's list of Spotify playlists")
    }
    return response.json();
  }).catch((error) => console.log(error));

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
    userAccount.username = profileResponse.display_name;
    userAccount.userID = profileResponse.id;
    userAccount.profileImg = profileResponse.images[0].url;
  });

  // Get the list of playlists saved in the user's account, then extract only necessary info for each playlist and add them to the userAccouunt object that will be returned
  await getUserPlaylists(userAuthToken).then((playlistResponse) => {

    playlistResponse.items.forEach(playlist => {

      userAccount.playlists.push({
        playlistName: playlist.name,
        username: playlist.owner.display_name,
        id: playlist.id,
        tracks: [],
        image: playlist.images[0].url,
        length: ""
      });

    });
  });
  
  return userAccount;
};

/// SUMMARY: Fetch the playlist info and its first 100 tracks
/// DETAILS: This Spotify API endpoint has a 100-track limit, so this API call will not be sufficient for playlists that have 100+ tracks
/// Spotify API: https://developer.spotify.com/documentation/web-api/reference/get-playlist
const fetchPlaylist = async (token, playlistID) => {
  let playlist = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}`, 
  {
      method: "GET",
      headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + token.access_token,
      }
  }).then((response) => {
      if (response.ok) {
          console.log("Successfully fetched Spotify playlist!");
      }
      else {
          console.log("Error with retrieving Spotify playlist");
      }
      return response.json();
  }).catch((error) => console.log(error));

  return playlist;
};

/// SUMMARY: Fetch the tracks that were not retrieved from the playlist due to the limit
/// DETAILS: For playlists that have more than 100 tracks, this function will be used to retrieve all the tracks past #100
/// Spotify API: https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks 
const fetchExtraTracks = async (token, playlistID, offset, limit=50) => {
  let extraTracks = fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=50&offset=${offset}`, 
  {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token.access_token
    }
  }).then(response => {
    if(response.ok){
      console.log("Successfully got the next batch of tracks!");
    }
    else {
      console.log("Error with getting the next batch of tracks...");
    }
    return response.json();
  }).catch(error => console.log(error));

  return extraTracks;
};

/// SUMMARY: Fetch the requested playlist with the app's Spotify token and the playlist's ID
/// DETAILS: Calls the fetchPlaylist() method. If that Spotify API call was unable to fetch all the tracks, then it will call the fetchExtraTracks() method as many times as necessary
export const fetchPlaylistAndTracks = async (token, playlistID) => {

  let playlist, numTracksFetched, totalNumTracks;
  let extraTracks = [];
  let extraTracksLimit = 50;    // There is a limit on the number of items that is retrieved from a playlist. The maximum for the Spotify API call in fetchExtraTracks() is 50

  // Get the playlist 
  playlist = await fetchPlaylist(token, playlistID);
  numTracksFetched = playlist.tracks.items.length;
  totalNumTracks = playlist.tracks.total;

  // If the playlist has more tracks than the Playlist API call's limit, get the rest of them
  let nextBatch;    // The variable that will hold the next set of tracks that are fetched
  while(numTracksFetched < totalNumTracks) {                // While not all the tracks have been fetched, keep calling fetchExtraTracks()
    nextBatch = await fetchExtraTracks(token, playlistID, numTracksFetched, extraTracksLimit);
    numTracksFetched += extraTracksLimit;
    extraTracks.push(...nextBatch.items);
  }

  let fullPlaylist = { 
    playlistName: playlist.name,
    username: playlist.owner.display_name,
    id: playlistID,
    tracks: [...playlist.tracks.items, ...extraTracks],
    image: playlist.images[0].url
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

/// Extracts the song's title, image, artist(s), and length, and checks if it is explicit from
/// the tracklist that comes in the Spotify playlist object.
export const extractSongInfo = (playlist) => {
    let formattedSongArray = [];
    let totalDuration = 0;  // The total run time of the playlist 
let count = 1;
    playlist.tracks.forEach(song => {
        // Get the list of artists for the song
        let artistList = extractSongArtists(song);

        totalDuration += song.track.duration_ms;

        // Add the song object to the array
        formattedSongArray.push({
            name: song.track.name,
            album: song.track.album.name,
            image: song.track.album.images.length > 0 ? song.track.album.images[0].url : "",
            artists: artistList,
            length_ms: song.track.duration_ms,
            length: sharedService.millisToHoursMinutesAndSeconds(song.track.duration_ms),
            isExplicit: song.track.explicit,
            release_date: song.track.album.release_date,
            type: song.type
        });
    });

    playlist.tracks = [...formattedSongArray];
    playlist.length = sharedService.millisToHoursMinutesAndSeconds(totalDuration);

    return playlist;
};

/// Create the playlist on Spotify
/// https://developer.spotify.com/documentation/web-api/reference/create-playlist
const createPlaylist = (token, userID, playlistName) => {
  let newPlaylist = fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token.access_token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({    // Must stringify the object for the body, or else it won't work
      "name": playlistName,
      "description": "Playlist copied by playlist-transfer",
    })
  }).then(response => {
    if(response.ok){
      console.log("Successfully created the playlist on Spotify!");
    }
    else {
      console.log("Error with creating playlist on Spotify");
    }
    return response.json();
  }).catch(error => console.log(error));

  return newPlaylist;
};

/// Search the track on Spotify and retrieve its URI, which will be used to add the track to the playlist
/// Spotify API: https://developer.spotify.com/documentation/web-api/reference/search
const searchTrack = async(token, song) => {

  let queryToEncode = `remaster%20track:${song.name}%20artist:${song.artists}`;
  let encodedQuery = encodeURIComponent(queryToEncode);
  let results = fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=track`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token.access_token
    }
  }).then(response => {
    if(response.ok) {
      console.log("Successfully searched track on Spotify!");
    }
    else {
      console.log("Error with searching on Spotify");
    }
    return response.json();
  }).catch(error => console.log(error));

  return results;
};

/// Helper function that makes sure that the exact song is found
const findTrack = (results, song) => {
  let trackURI = "";       // The track that will be put into the playlist
  let searchResults = [...results.items];

  for(let i=0; i<searchResults.length; i++) {   // Use a for loop instead of a forEach so that we can 'break' out once we've found the right track
    if((searchResults[i].name === song.name || searchResults[i].album.name === song.album)
        && searchResults[i].explicit === song.isExplicit) {   // Check for the right version (i.e., the search result is from the same album and has the same Explicit rating)
      trackURI = searchResults[i].uri;
      break;
    }
  };

  return {songName: song.name, spotifyURI: trackURI};
};


/// Add the tracks to the Spotify playlist
/// Spotify API: https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
const addTracksToPlaylist = (token, tracksURIArray, playlistID) => {

  let addTracksResponse = fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token.access_token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "uris": tracksURIArray,
      "position": 0
    })
  }).then(response => {
    if(response.ok) {
      console.log("Successfully transferred tracks to Spotify playlist!");
    }
    else {
      console.log("Error with adding tracks to Spotify playlist...");
    }
    return response.json();
  }).catch(error => console.log(error));

  return addTracksResponse;
};

/// Execute the copying of the playlist to the specified Spotify account
export const transferPlaylist = async (token, userID, playlist) => {
  let newPlaylistID = "";   // The ID of the new playlist, which is necessary for adding tracks to it
  let newPlaylistName = playlist.playlistName + " - copy";  // The name that will be used for the newly-created playlist
  let tracksURIArray = [];
  let missingTracks = [];     // List of songs that could not be found reliably on Spotify

  // Step 1: Find and retrieve the Spotify URI's for all the tracks that will be put into the transferred playlist
  await playlist.tracks.forEach(song => {
    searchTrack(token, song)
      .then((searchResults => {
        let track = findTrack(searchResults.tracks, song);
        if(track.spotifyURI !== ""){
          tracksURIArray.push(track.spotifyURI);
        }
        else {
          missingTracks.push(track.songName);
        }
      }));
  });

  // Step 2: Create the playlist in the Spotify account and retrieve its Spotify ID
  await createPlaylist(token, userID, newPlaylistName)
    .then(newPlaylistResponse => {
      newPlaylistID = newPlaylistResponse.id;
  });


  // Step 3: Add all of the tracks to the newly-created Spotify playlist
  // You can add a maximum of 100 songs at once
  if(playlist.tracks.length <= 100) {
    addTracksToPlaylist(token, tracksURIArray, newPlaylistID)
    .then(response => {
      console.log(response);
      return response;
    });
  }
  else {
    let numTracksAdded = 0;
    while(tracksURIArray.length - numTracksAdded > 100) {
      await addTracksToPlaylist(token, tracksURIArray.slice(numTracksAdded, numTracksAdded+100), newPlaylistID)
      .then(response => {
        console.log(response);
        return response;
      });
      numTracksAdded += 100;
    }

    addTracksToPlaylist(token, tracksURIArray.slice(numTracksAdded), newPlaylistID)
      .then(response => {
        console.log(response);
        return response;
      });
  }
  
};