import { Buffer } from "buffer";
import * as spotify from "./platformServices/spotifyService";
import * as apple from "./platformServices/appleService";
import * as deezer from "./platformServices/deezerService";
import * as soundcloud from "./platformServices/soundcloudService";

/// Object used to store the clientIDs and secrets of the various platforms
const credentials = {
  spotify_clientID: "9a5c9f439d464286b0b08e0f40de4f4a",
  spotify_secret: "c24f98c34e26485db177b530895c1769",
  apple_clientID: "",
  apple_secret: "",
  deezer_clientID: "539962",
  deezer_secret: "64fa6e122f54fd5144866dd4e5bd8109",
};

/// Object used to store the regex patterns needed to extract info from url's
const regexes = {
  spotify_playlistID_regex: "(?<=t/)(.*?)(?=\\?)",
  apple_playlistID_regex: "",
  soundcloud_playlist_regex: "",
};

/// Helper function that reads the source platform of the playlist to be shared
const extractPlaylistSource = (link) => {
  let source = "";

  if (link.startsWith("https://open.spotify.com/playlist/")){
    source = "spotify";
    }
    else if (link.startsWith("https://music.apple.com/ca/playlist/")){
    //May need to change this because of the 'ca'
    source = "apple";
    }
    else if(link.startsWith("https://soundcloud.com/")){
    source = "soundcloud";
    };
    
    return source;
};

/// Helper function that extracts the playlist's ID
/// Calls the appropriate method to do this, since the different platform's links have different regex patterns
const extractPlaylistID = (source, link) => {
  let playlistID = "";

  switch(source){
    case "spotify":
      playlistID = spotify.extractPlaylistID(link);
      break;
    case "apple":
      playlistID = apple.extractPlaylistID(link);
      break;
    case "soundcloud":
      playlistID = soundcloud.extractPlaylistID(link);
      break;
    default:
      playlistID = "";
  }

    return playlistID;
};

/// Extracts the playlist's info from the share link, which includes the source platform and the playlist ID
export const extractPlaylistInfo = (link) => {
  let playlistInfo = { 
    source: "",
    ID: ""
  };

  playlistInfo.source = extractPlaylistSource(link);
  playlistInfo.ID = extractPlaylistID(playlistInfo.source, link);
  
  return playlistInfo;
};

/// Fetch the user's token after they have logged in and authorized the application to take actions on their account
export const fetchToken = (source) => {
  if (source === "spotify"){
    return spotify.fetchToken();
  }
};

/// Calls the appropriate platform's fetchPlaylist() method, which makes the API call 
/// to get the details of the playlist
export const fetchPlaylist = (source, token, playlistID) => {
  let playlist;

  switch(source){
    case "spotify":
      playlist = spotify.fetchPlaylist(token, playlistID);
      break;
    default:
      playlist = null;
  }

  return playlist;

};

/// Calls the appropriate platform's extractSongInfo() method, which gets the song's title, image, 
/// artist(s), and length, and checks if it is explicit
export const extractSongInfo = (source, playlist) => {
  let formattedPlaylist;
  switch(source) {
    case "spotify":
      formattedPlaylist = spotify.extractSongInfo(playlist);
      break;
    case "soundcloud":
      formattedPlaylist = soundcloud.extractSongInfo(playlist);
      break;
    default:
      return;
  }
  
  return formattedPlaylist;
};


/// Get the user to log in to their account on the appropriate platform and authorize the app to have the specified access 
export const redirectToUserAuthorization = (source) => {
  console.log(source);
  switch(source){
    case "spotify":
      spotify.redirectToUserAuthorization();
      break;
    default:
      break;
  };

};

/// Get the token that is provided once the user authorizes the application
export const getUserAuthorizationToken = (source) => {
  let authToken = spotify.getUserAuthorizationToken();

  return authToken;
};

/// Use the user authorization token to get their account i.e., the account name, their playlists
export const getUserAccount = (token, source) => {
  let userAccount;
  switch(source){
    case "spotify":
      userAccount = spotify.getUserAccount(token);
      break;
    case "apple":
      // userDetails = apple.getUserDetails(token);
      break;
    default:
      break;
  };

  return userAccount;
};

/// Used to extract the song's title from the published title
/// Seems to be exclusively an issue for SoundCloud
export const extractSongTitle = (source, title) => {
  return soundcloud.extractSongTitle(title);
};


export const transferPlaylist = (token, userID, playlist) => {
  spotify.transferPlaylist(token, userID, playlist);
};