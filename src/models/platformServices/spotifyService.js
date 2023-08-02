import { Buffer } from "buffer";

const regexPattern = "(?<=playlist\/)[A-Za-z0-9]*";
const clientID = "9a5c9f439d464286b0b08e0f40de4f4a";
const secret = "c24f98c34e26485db177b530895c1769";
const spotify_authorize_endpoint = "https://accounts.spotify.com/authorize";
const redirect_uri = "http://localhost:3000/callback";


/// Used to extract the playlist ID from the Spotify share link using Regex
export const extractPlaylistID = (link) => {
    const regex = new RegExp(regexPattern);
    const playlistID = link.match(regex)[0];

    return playlistID;
};

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

export const getUserAuthorization = () => {

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

        console.log(playlistResponse);
    return playlistResponse;
};

/// Extracts the song's title, image, artist(s), and length, and checks if it is explicit from
/// the tracklist that comes in the Spotify playlist object
export const extractSongInfo = (songArray) => {
    let formattedSongArray = [];

    songArray.forEach(song => {

        // Get the list of artists for the song
        let artistList = song.track.artists[0].name;
        let index = 1;
        while(index < song.track.artists.length) {
            artistList += ", " + song.track.artists[index].name;
            index++;
        }

        // Add the song object to the array
        formattedSongArray.push({
            name: song.track.name,
            image: song.track.album.images[0].url,
            artists: artistList,
            length: song.track.duration_ms,
            isExplicit: song.track.explicit
        });
    });

    return formattedSongArray;
};