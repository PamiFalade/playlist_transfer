import { Buffer } from "buffer";
import * as spotify from "./platformServices/spotifyService";
import * as apple from "./platformServices/appleService";
import * as deezer from "./platformServices/deezerService";

//Object used to store the clientIDs and secrets of the various platforms
const credentials = {
  spotify_clientID: "9a5c9f439d464286b0b08e0f40de4f4a",
  spotify_secret: "c24f98c34e26485db177b530895c1769",
  apple_clientID: "",
  apple_secret: "",
  deezer_clientID: "539962",
  deezer_secret: "64fa6e122f54fd5144866dd4e5bd8109",
};

//Object used to store the regex patterns needed to extract info from url's
const regexes = {
  spotify_playlistID_regex: "(?<=t/)(.*?)(?=\\?)",
  apple_playlistID_regex: "",
};

//This function sets up the clientID and secret depending on which platform is specified
// const setupCredentials = (source) => {
//   let required_clientID = "";
//   let required_secret = "";

//   //Select the correct values
//   if (source === "spotify") {
//     required_clientID = credentials.spotify_clientID;
//     required_secret = credentials.spotify_secret;
//   } else if (source === "apple") {
//     required_clientID = credentials.apple_clientID;
//     required_secret = credentials.apple_secret;
//   }

//   return { clientID: required_clientID, secret: required_secret };
// };

//Get the Spotify access token
const fetchSpotifyToken = () => {
  return spotify.fetchSpotifyToken(); //Return the promise that the fetch function returns
};

//Get the Apple Music access token
const fetchAppleToken = () => {};

//Function to get the required credentials (client ID, secret, and access token)
//Made it an async function so that we can wait for the fetching of the access token to finish before returning it
export const setupToken = async (source) => {
  let tokenPromise; //Variable that will hold the promise returned from the fetch API
  let token = ""; //Variable used to hold access token from source platform

  //Get the access token from the right api based on the source
  if (source === "spotify") {
    tokenPromise = await fetchSpotifyToken(); //await will make the code wait for the fetch function to resolve/reject the promise, but for it to work it needs to return a promise
  } else if (source === "apple") {
    tokenPromise = await fetchAppleToken();
  }

  token = tokenPromise.access_token;
  return token;
};

//Call the appropriate "fetchPlaylist" function
export const fetchPlaylist = (link, token, source) => {
  //Fetch the playlist with the correct api call
  let foundPlaylist;

  if (source === "spotify") {
    foundPlaylist = spotify
      .fetchPlaylist(link, token)
      .then((playlistResponse) => {
        return spotify.extractPlaylistInfo(playlistResponse, token);
      });
  } else if (source === "apple") {
  }

  return foundPlaylist;
};

export const handleAuthorization = (source) => {
  if (source === "spotify") {
    spotify.getAuthorization();
  } else if (source === "deezer") {
    console.log("Coming soon...");
  }
};

export const getAccessToken = async () => {
  let tokenResponse = await spotify.getToken().then((response) => {
    if (response === null) return null;
    else return response.json();
  });

  if (tokenResponse === null) return "";

  return tokenResponse.access_token;
};

export const getUserDetails = async (token, platform) => {
  if (platform === "spotify") {
    let userDetails = await spotify
      .fetchUserDetails(token)
      .then((response) => response.json());
    return userDetails;
  }
};
