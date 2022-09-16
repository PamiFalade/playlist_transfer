import { Buffer } from "buffer";

const clientID = "9a5c9f439d464286b0b08e0f40de4f4a";
const secret = "c24f98c34e26485db177b530895c1769";
const regexPattern = "(?<=t/)(.*?)(?=\\?)";

export const fetchSpotifyToken = () => {
  let stringToEncode = `${clientID}:${secret}`; //Encoded client ID and secret needed to get access token
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
      if (tokenResponse.ok) console.log("Successfully obtained access token");
      else console.log("Error with retrieving access token");
      return tokenResponse.json();
    })
    .catch((error) => {
      console.log(error);
    });

  return tokenResponse; //Return the promise that the fetch function returns
};

//Extract the unique playlist ID from the url using the right regex pattern
const extractPlaylistID = (link) => {
  let playlistID = "";

  //Extract the playlist ID from the share link
  const regex = new RegExp(regexPattern); //Select the spotify playlist ID regex
  playlistID = link.match(regex)[0];

  return playlistID;
};

export const fetchPlaylist = (link, token) => {
  const playlistID = extractPlaylistID(link);
  let fetchedPlaylist;

  let playlistResponse = fetch(
    `https://api.spotify.com/v1/playlists/${playlistID}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((playlistResponse) => {
      if (playlistResponse.ok) {
        console.log("Retrieved playlist successfully");
      } else console.log("Error with retrieving playlist");
      return playlistResponse.json();
    })
    .catch((error) => console.log(error));

  return playlistResponse;
};

//This function will be used to get the specific playlist information from the Spotify API's playlist response
export const extractPlaylistInfo = async (playlistResponse, token) => {
  let limit = playlistResponse.tracks.limit; //Limit of how many songs can be fetched at a time
  let total = playlistResponse.tracks.total; //Total number of songs in the playlist
  let extraTracks; //The next page of songs from the playlist
  let next = playlistResponse.tracks.next; //The URI for the next page

  let retrievedPlaylist = {
    name: playlistResponse.name, //But its attributes didn't seem to be updating in time before the modal would be rendered
    image:
      playlistResponse.images.length > 1 //If there are multiple sizes of the playlist image, pick the second one
        ? playlistResponse.images[1].url
        : playlistResponse.images[0].url, //The useState function triggers a re-render of the DOM, so that's what you should use so that the DOM re-renders when those variables have been updated
    owner: playlistResponse.owner.display_name, //Lesson learned: that's why you should use the state for data that needs to be kept track of and needs to be rendered (it's just better and easier to manage)
    tracks: playlistResponse.tracks.items.map((song) => {
      return {
        songName: song.track.name,
        isExplicit: song.track.explicit,
        songAlbum: song.track.album.name,
        songAlbumImg: song.track.album.images[2],
        songArtists: [...song.track.artists],
        sourceURI: song.track.uri,
        destURI: "",
      };
    }),
  };

  //Find out how many pages of tracks there are
  let numPages = Math.ceil(total / limit);
  let count = 1;
  for (var i = 1; i < numPages; i++) {
    await fetchTracks(next, token)
      .then((tracksResponse) => {
        extraTracks = tracksResponse.items.map((song) => {
          return {
            songName: song.track.name,
            isExplicit: song.track.explicit,
            songAlbum: song.track.album.name,
            songAlbumImg: song.track.album.images[2],
            songArtists: [...song.track.artists],
            sourceURI: song.track.uri,
            destURI: "",
          };
        });
        next = tracksResponse.next;
      })
      .then(() => retrievedPlaylist.tracks.push(...extraTracks));
    if (next == null) break;
  }

  return retrievedPlaylist;
};

//This function is used to fetch all the tracks of a playlist which has more songs than the fetch limit
export const fetchTracks = (next, token) => {
  let nextPage = next;
  let extraTracks = [];

  let tracksResponse = fetch(nextPage, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).then((response) => response.json());

  return tracksResponse;
};
