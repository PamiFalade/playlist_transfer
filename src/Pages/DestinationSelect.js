import { React, useState, useEffect, useRef, createRef } from "react"
import "../Views/DestinationSelectViews.css";
import PlatformSelector from "../Components/PlatformSelector";
import { Button } from "react-bootstrap";
import loadscript from "load-script";

const DestinationSelect = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const handleLoggedIn = () => setLoggedIn(!loggedIn);

    const [scPlayer, setSCPlayer] = useState(false);

    const iframeRef = createRef();
    let trackList = null;

    useEffect(() => {
        loadscript('https://w.soundcloud.com/player/api.js', () => {

            // initialize player and store reference in state

            const player = window.SC.Widget(iframeRef.current);
            setSCPlayer(player);

            player.bind(window.SC.Widget.Events.READY, () => {
                function tryGetSounds() {
                    player.getSounds((songList) => {
                        var notComplete = false;
                        for(var i=0, len=songList.length; i<len; i++){
                            if(songList[i].title === undefined){
                                notComplete = true;
                                break;
                            }
                        }
                        if (notComplete) {
                            console.log('Not complete. Try again in 200ms ...');
                            console.log(songList);
                            setTimeout(function () {
                              tryGetSounds();
                            }, 200);
                          } else {
                            console.log('Complete!');
                            trackList = songList
                            console.log(trackList);
                        }
                    });
                }
                tryGetSounds();
            });

        });

    }, []);

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
            <iframe ref={iframeRef} className="sc-widget" id="SCwidget" width="0px" height="200vh" allow="autoplay" style={{position:"absolute", left:"0", top:"0", fontSize:"40"}}
                            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/pamilerin-f/sets/rock-songs/&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false" />
                 
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