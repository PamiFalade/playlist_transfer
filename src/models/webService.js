import { Buffer } from "buffer";

//Object used to store the clientIDs and secrets of the various platforms
const credentials = {
  spotify_clientID: "9a5c9f439d464286b0b08e0f40de4f4a",
  spotify_secret: "c24f98c34e26485db177b530895c1769",
  apple_clientID: "",
  apple_secret: "",
  apple_playlistID_regex: "",
};

//Object used to store the regex patterns needed to extract info from url's
const regexes = {
  spotify_playlistID_regex: "(?<=t/)(.*?)(?=\\?)",
  apple_playlistID_regex: "",
};

//This function sets up the clientID and secret depending on which platform is specified
const setupCredentials = (source) => {
  let required_clientID = "";
  let required_secret = "";

  //Select the correct values
  if (source === "spotify") {
    required_clientID = credentials.spotify_clientID;
    required_secret = credentials.spotify_secret;
  } else if (source === "apple") {
    required_clientID = credentials.apple_clientID;
    required_secret = credentials.apple_secret;
  }

  return { clientID: required_clientID, secret: required_secret };
};

//Get the Spotify access token
const fetchSpotifyToken = (searchData) => {
  let stringToEncode = `${searchData.clientID}:${searchData.secret}`; //Encoded client ID and secret needed to get access token
  let token; //Variable that will hold the promise returned by the fetch function

  //Headers and body set up according to how Spotify requires it (https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/)
  let tokenResponse = fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(stringToEncode).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  })
    .then((tokenResponse) => {
      if (tokenResponse.ok) console.log("Successful");
      else console.log("Not successful");
      return tokenResponse.json();
    })
    .catch((error) => {
      console.log(error);
    });

  return tokenResponse; //Return the promise that the fetch function returns
};

//Get the Apple Music access token
const fetchAppleToken = (searchData) => {};

//Function to get the required credentials (client ID, secret, and access token)
//Made it an async function so that we can wait for the fetching of the access token to finish before returning it
export const setupToken = async (source) => {
  let searchData = setupCredentials(source); //Object containing the required clientID and secret
  let tokenPromise; //Variable that will hold the promise returned from the fetch API
  let token = ""; //Variable used to hold access token from source platform

  //Get the access token from the right api based on the source
  if (source === "spotify") {
    tokenPromise = await fetchSpotifyToken(searchData); //await will make the code wait for the fetch function to resolve/reject the promise, but for it to work it needs to return a promise
  } else if (source === "apple") {
    tokenPromise = await fetchAppleToken(searchData);
  }

  token = tokenPromise.access_token;
  return { ...searchData, token };
};

//Extract the unique playlist ID from the url using the right regex pattern
const extractPlaylistID = (link, source) => {
  let playlistID = "";

  //Extract the playlist ID from the share link
  if (source === "spotify") {
    const regex = new RegExp(regexes.spotify_playlistID_regex); //Select the spotify playlist ID regex
    playlistID = link.match(regex)[0];
  }
  // else if (source === "apple") {
  //   const regex = new RegExp(regexes.apple_playlistID_regex);
  //   plalylistID = link.match(regex);
  //   console.log(playlistID);
  // }

  return playlistID;
};

export const fetchPlaylist = (link, token, source) => {
  const playlistID = extractPlaylistID(link, source);

  return fetch(`https://api.spotify.com/v1/playlists/${playlistID}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((playlistResponse) => {
      if (playlistResponse.ok) {
        console.log("Retrieved playlist successfully");
      } else console.log("Error with retrieving playlist");
      return playlistResponse.json();
    })
    .catch((error) => console.log(error));
};
