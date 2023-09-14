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
];

/// Used to extract the playlist ID from the Spotify share link using Regex
export const extractPlaylistID = (link) => {
    const regex = new RegExp(regexPattern);
    const playlistID = link.match(regex)[0];

    return playlistID;
};

/// Gets the app's Spotify token using the Spotify API
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

//Redirect to the Spotify API's user login and authorization page via
export const redirectToUserAuthorization = () => {
  console.log("here");
  let authorizeURL = spotify_authorize_endpoint + "?client_id=" + clientID;
  authorizeURL += "&response_type=code";
  authorizeURL += "&redirect_uri=" + encodeURI(redirect_uri);
  authorizeURL += "&show_dialog=true";
  authorizeURL += "&scope=" + SCOPES.join(" ");

  console.log(authorizeURL);
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
    profileImg: "",
    playlists: []
  };

  // Get the user's username and profile image
  await getUserProfile(userAuthToken).then((profileResponse) => {
    userAccount.username = profileResponse.display_name;
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

/// Fetch the requested playlist with the app's Spotify token and the playlist's ID
export const fetchPlaylist = async (token, playlistID) => {
    let playlistResponse;
    
    await fetch(`https://api.spotify.com/v1/playlists/${playlistID}`, 
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
            playlistResponse = response.json();
        }).catch((error) => console.log(error));

    return playlistResponse;
};

/// Extracts the song's title, image, artist(s), and length, and checks if it is explicit from
/// the tracklist that comes in the Spotify playlist object.
export const extractSongInfo = (playlist) => {
    let formattedSongArray = [];
    let totalDuration = 0;  // The total run time of the playlist 

    playlist.tracks.forEach(song => {
        // Get the list of artists for the song
        let artistList = song.track.artists[0].name;
        let index = 1;
        while(index < song.track.artists.length) {
            artistList += ", " + song.track.artists[index].name;
            index++;
        }

        totalDuration += song.track.duration_ms;

        // Add the song object to the array
        formattedSongArray.push({
            name: song.track.name,
            image: song.track.album.images[0].url,
            artists: artistList,
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

const searchItem = () => {

  let songName = encodeURI("song name");
  let artist = "artiste";
  let year = "year";
  let type = "track type";
  let queryToEncode = `remaster% track:${songName}% artist:${artist}% type=${type}`
};