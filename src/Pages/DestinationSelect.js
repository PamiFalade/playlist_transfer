import { React, useState, useEffect, useRef, createRef } from "react"
import "../Views/DestinationSelectViews.css";
import PlatformSelector from "../Components/PlatformSelector";
import { Button } from "react-bootstrap";

const DestinationSelect = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const handleLoggedIn = () => setLoggedIn(!loggedIn);

    const playlists = [
        {
            playlistID: 1,
            playlistName: "Fire",
            playlistOwner: "Pamilerin Falade",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            playlistID: 2,
            playlistName: "Songs",
            playlistOwner: "Bill Nye",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            playlistID: 3,
            playlistName: "Vibes",
            playlistOwner: "Pamilerin Falade",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            playlistID: 4,
            playlistName: "Funk",
            playlistOwner: "Pamilerin Falade",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            playlistID: 5,
            playlistName: "Work",
            playlistOwner: "Pamilerin Falade",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            playlistID: 6,
            playlistName: "Late Night Driving",
            playlistOwner: "Mehtab Brar",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            playlistID: 7,
            playlistName: "New stuff",
            playlistOwner: "Pamilerin Falade",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            playlistID: 8,
            playlistName: "Rock",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            playlistID: 9,
            playlistName: "R&B",
            playlistOwner: "Pamilerin Falade",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
        {
            playlistID: 10,
            playlistName: "Chill Vibe",
            playlistOwner: "Pamilerin Falade",
            playlistImg: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
        },
    ];

    return (
        <main>
                          
            {!loggedIn && (
                <div>
                    <h1>Where are we transferring this playlist to?</h1>
                    <PlatformSelector />
                    <button onClick={handleLoggedIn}>Log in</button>
                </div>)}

            {loggedIn && (
                <div>
                    <div id="userPlaylistsDisplay">
                        {playlists.map((playlist, index) => {
                            return <div className="playlistCard" key={playlist.playlistID} >
                                <img src={playlist.playlistImg} />
                                <p>{playlist.playlistName}</p>
                                <small>{playlist.playlistOwner}</small>
                            </div>
                        })}
                    </div>
                    <div className="confirmButtons">
                        <Button variant="secondary">
                            Go Back
                        </Button>

                        <Button variant="primary" onClick={handleLoggedIn}>
                            Transfer Playlist
                        </Button>
                    </div>
                </div>
            )}
           
        </main>
    );
}

export default DestinationSelect;