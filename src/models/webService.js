import { Buffer } from "buffer";
import * as spotify from "./platformServices/spotifyService";
import * as apple from "./platformServices/appleService";
import * as deezer from "./platformServices/deezerService";
import * as soundcloud from "./platformServices/soundcloudService";

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
