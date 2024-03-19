import { React, useState, useEffect, useRef, createRef } from "react"
import { redirect, useLocation, useNavigate } from "react-router-dom";
import "../Views/DestinationSelectViews.css";
import PlatformSelector from "../Components/PlatformSelector";
import { Button } from "react-bootstrap";
import * as webService from "../models/webService.js";
import TransferSummary from "../Components/TransferSummary.js";

const DestinationSelect = () => {

    // State variable that indicates if the user has given authorization on an account on a platform
    const [loggedIn, setLoggedIn] = useState(false);
    const handleLoggedIn = () => setLoggedIn(!loggedIn);

    const navigate = useNavigate();

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

    // Navigate to the Transfer page when the "Yes" button is clicked
    const navigateTransferPage = () => {
        sessionStorage.setItem("userAccount", JSON.stringify(userAccount));
        sessionStorage.setItem("token", JSON.stringify(token));
        navigate('/transfer-page');
    }

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
                        <div id="userPlaylistsDisplay" className="scrollable">
                            {userAccount.playlists.map((playlist, index) => {
                                index++;
                                return <div className="playlistCard" key={index} >
                                    <img src={playlist.image} />
                                    <p>{playlist.playlistName}</p>
                                    <small>{playlist.playlistOwner}</small>
                                </div>
                            })}
                        </div>
                        <div className="actionButtons">
                            <button className="button returnButton" onClick={handleLoggedIn}>
                                Go Back
                            </button>

                            <button className="button submitButton" onClick={navigateTransferPage}>
                                Yes!
                            </button>
                        </div>
                    </div>
                )}

                {/* { showSummary && <TransferSummary playlist={missingTracks}/>} */}
            
            </div>
        </main>
    );
}

export default DestinationSelect;