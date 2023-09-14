import { React, useState, useEffect, useRef, createRef } from "react"
import "../Views/DestinationSelectViews.css";
import PlatformSelector from "../Components/PlatformSelector";
import { Button } from "react-bootstrap";
import * as webService from "../models/webService.js";

const DestinationSelect = () => {

    // State variable that indicates if the user has given authorization on an account on a platform
    const [loggedIn, setLoggedIn] = useState(true);
    const handleLoggedIn = () => setLoggedIn(!loggedIn);

    // State variable that contains data from the account that the user is currently logged into
    const [userAccount, setUserAccount] = useState({
        username: "",
        profileImg: "",
        playlists: []
    });


    // Get the user's access token once they log in and store it in the state variable
    useEffect(() => {
        if (window.location.search) {
            webService.getUserAuthorizationToken().then((token) => {
                if (token != "") {
                    webService.getUserAccount(token, "spotify").then(
                        (retrievedUser) => {
                            setUserAccount(retrievedUser);
                        }
                    );
                }
            });
        }
    }, [window.location]);

    // Set logged in to true when userAccount has been set
    useEffect(() => handleLoggedIn(), [userAccount]);

    return (
        <main>

            {/* Shows the platform selector, where the user chooses which platform they want to login to */}
            {!loggedIn && (
                <div>
                    <h1>Where are we transferring this playlist to?</h1>
                    <PlatformSelector />
                    <button onClick={handleLoggedIn}>Log in</button>
                </div>)}

            
            {/* Shows the playlists in a user's account */}
            {loggedIn && (
                <div id="userAccountDisplay">
                    <div id="accountInfo">
                        <img className="profilePic" src={userAccount.profileImg} />
                        <h2>{userAccount.username}</h2>
                    </div>
                    <div id="userPlaylistsDisplay">
                        {userAccount.playlists.map((playlist, index) => {
                            return <div className="playlistCard" key={playlist.playlistID} >
                                <img src={playlist.image} />
                                <p>{playlist.playlistName}</p>
                                <small>{playlist.playlistOwner}</small>
                            </div>
                        })}
                    </div>
                    <div className="confirmButtons">
                        <Button variant="secondary" id="backButton" onClick={handleLoggedIn}>
                            Go Back
                        </Button>

                        <Button variant="primary" id="transferButton">
                            Transfer Playlist
                        </Button>
                    </div>
                </div>
            )}
           
        </main>
    );
}

export default DestinationSelect;