import { React, useState, useEffect, useRef, createRef } from "react"
import { useLocation } from "react-router-dom";
import "../Views/DestinationSelectViews.css";
import PlatformSelector from "../Components/PlatformSelector";
import { Button } from "react-bootstrap";
import * as webService from "../models/webService.js";
import TransferSummary from "../Components/TransferSummary.js";

const DestinationSelect = () => {

    // State variable that indicates if the user has given authorization on an account on a platform
    const [loggedIn, setLoggedIn] = useState(false);
    const handleLoggedIn = () => setLoggedIn(!loggedIn);

    // State variable that contains data from the account that the user is currently logged into
    const [userAccount, setUserAccount] = useState({
        username: "",
        userID: "",
        profileImg: "",
        playlists: [],
        token: ""
    });

    // State variable that holds the access token for the logged in user
    const [token, setToken] = useState("");

    // State variable that indicates if the component that shows if the "TransferSummary" component is visible or not
    const [showSummary, setShowSummary] = useState(false);
    const handleShowSummary = () => {
        setShowSummary(!showSummary);
    };

    // State variable that holds playlist that will be transferred
    const [playlist, setPlaylist] = useState({
        playlistName: "",
        username: "",
        id: "",
        tracks: [],
        image: "",
        length: ""
    });
    // Copy constructor for the state version of the playlist
    const handleSetPlaylist = (playlistData) => {
        setPlaylist({
            playlistName: playlistData.playlistName,
            username: playlistData.username,
            id: playlistData.id,
            tracks: playlistData.tracks,
            image: playlistData.image,
            length: playlistData.length
        });
    };

    // State variable that holds the list of tracks that could not be transferred
    const [missingTracks, setMissingTracks] = useState();

    // Begin the transferring of the playlist
    const beginTransferPlaylist = async () => {
        // Step 1: Retrieve playlist data from sessionStorage
        handleSetPlaylist(JSON.parse(sessionStorage.getItem("playlist")));
        let destPlatform = JSON.parse(sessionStorage.getItem("destPlatform"));  // Ideally, this would be a state variable, or even a global variable because this is also used in the useEffect hook. But neither work

        // Step 2: call the transferPlaylist function from webService
        let errorTracks;    // Tracks that were not transferred due to some error
        await webService.transferPlaylist(destPlatform, token, userAccount.userID, JSON.parse(sessionStorage.getItem("playlist")))
                .then(response => {
                    errorTracks = response;
                })
                .then(() => {
                    setMissingTracks(errorTracks);
                    
                    // Step 3: Alert the user that the transfer has been done, and highlight the tracks that were not transferred
                    setShowSummary(true);
                });

    };

    // Get the user's access token once they log in and store it in the state variable
    useEffect(() => {
        if (window.location.search || window.location.hash) {
            let destPlatform = JSON.parse(sessionStorage.getItem("destPlatform")); // Get the destination platform that was saved to the session when the button from PlatformSelector is clicked
            webService.getUserAuthorizationToken(destPlatform)
            .then((token) => {
                if (token !== "" && token !== null) {
                    setToken(token);
                    webService.getUserAccount(token, destPlatform)
                    .then((retrievedUser) => {
                            setUserAccount(retrievedUser);
                            setLoggedIn(true);
                        }
                    );
                }
            });
        }
    }, [window.location]);

    return (
        <main>
            <div className="mainSection">

                {/* Shows the platform selector, where the user chooses which platform they want to login to */}
                {!loggedIn && (
                    <div>
                        <PlatformSelector title="Login to Destination Account"/>
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
                                index++;
                                return <div className="playlistCard" key={index} >
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

                            <Button variant="primary" id="transferButton" onClick={beginTransferPlaylist}>
                                Transfer Playlist
                            </Button>
                        </div>
                    </div>
                )}

                { showSummary && <TransferSummary playlist={missingTracks}/>}
            
            </div>
        </main>
    );
}

export default DestinationSelect;