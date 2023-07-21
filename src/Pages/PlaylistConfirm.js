import { useState } from "react";
import "../Views/PlaylistConfirmViews.css";
import { Button } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";


const PlaylistConfirm = () => {


    /// The share link to the playlist that will be transferred
    const [playlistLink, setPlaylistLink] = useState("");
    const handlePlaylistLink = (event) => {
        setPlaylistLink(event.target.value);
    };

    /// The ID which will be extracted from the share link and used to search the playlist up
    const [playlistID, setPlaylistID] = useState("");
    const handlePlaylistID = (playlistID) => {
        setPlaylistID(playlistID);
    };

    /// The music streaming platform that the playlist will be transferred from
    const [source, setSource] = useState("");
    const handleSource = (link) => {
        if (link.startsWith("https://open.spotify.com/playlist/")){
        setSource("spotify");
        }
        else if (link.startsWith("https://music.apple.com/ca/playlist/")){
        //May need to change this because of the 'ca'
        setSource("apple");
        }
        else if(link.startsWith("https://soundcloud.com/")){
        setSource("soundcloud");
        }
    };

    const [playlist, setPlaylist] = useState({});

    const retrievedPlaylist = useLoaderData();

    const playlistName = "Made in Lagos";
    const noSongs = 13;
    const lenMinutes = 55;

     const truncateString = (string, num) => {
        var truncated = "";
        if(string.length > num)
        {
            truncated = string.slice(0, num);
            truncated = truncated.trimEnd() + "...";
        }
        else 
        {
            truncated = string;
        }
        return truncated;
     };

    const songs = [
        {
            songID: 1,
            songName: "Reckless",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 2,
            songName: "Ginger (feat. Burna Boy)",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 3,
            songName: "Longtime (feat. Skepta)",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 4,
            songName: "Mighty Wine",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 5,
            songName: "Blessed (feat. Damian \"Jr.Gong \" Marley)",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 6,
            songName: "Smile (feat. H.E.R.)",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 7,
            songName: "Piece of Me (feat. Ella Mai)",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 8,
            songName: "No Stress",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 9,
            songName: "True Love (feat. Tay Iwar & Projexx)",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 10,
            songName: "No Sweet One",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 11,
            songName: "Essence (feat. Tems)",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 12,
            songName: "Roma (feat. Terri)",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 13,
            songName: "Gyrate",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            songID: 14,
            songName: "Grace",
            songArtist: "Wizkid",
            songLength: "3:53",
            songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
    ]

    return(
        <main id="playlistSummary">
            <img id="playlistImage" src="https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"/>
            <h2>{playlistName}</h2>
            <p>{noSongs} songs | {lenMinutes} minutes</p>
            <div className="tracklistDisplay">
                {songs?.map((song, index) => {
                    return <div className="songDisplay" key={index}>
                     <img src={song.songImage}/>
                     <div className="songInfo" style={{marginLeft:"5%"}}>
                         <h5>{truncateString(song.songName, 26)}</h5>
                         <p>{truncateString(song.songArtist, 45)}</p>
                     </div>
                    </div>
                })}
            </div>

            <div className="confirmButtons">
                <Button variant="secondary">
                    Go Back
                </Button>

                <Button variant="primary">
                    This is it!
                </Button>
            </div>
        </main>
    );
}

export default PlaylistConfirm;

export const playlistConfirmLoadeer = async () => {

};