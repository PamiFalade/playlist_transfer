import { Buffer } from "buffer";

const regexPattern = "(?<=t/)(.*?)(?=\\?)";
const clientID = "9a5c9f439d464286b0b08e0f40de4f4a";
const secret = "c24f98c34e26485db177b530895c1769";
const spotify_authorize_endpoint = "https://accounts.spotify.com/authorize";
const redirect_uri = "http://localhost:3000/callback";


/// Used to extract the playlist ID from the Spotify share link using Regex
export const extractPlaylistID = (link) => {

}