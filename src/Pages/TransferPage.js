import { useState, useEffect } from "react";
import "../Views/TransferPageViews.css";
import TracklistDisplay from "../Components/TracklistDisplay";
import * as webService from "../models/webService.js";




const TransferPage = () => {

    // Retrieve original playlist's information 
    const originalPlaylist = JSON.parse(sessionStorage.getItem("originalPlaylist"));   // The playlist that will be copied

    // State variable for the tracks that could not be found in the search on the destination platform
    const [missingTracks, setMissingTracks] = useState([]); 

    // State variable for the tracks that could not be found in the search on the destination platform
    const [newPlaylistName, setNewPlaylistName] = useState(originalPlaylist.playlistName + " - copy");

    // State variable for the tracks that could not be found in the search on the destination platform
    const [newPlaylistTracks, setNewPlaylistTracks] = useState([]);


    const updateNewPlaylistName = (updatedName) => {
        setNewPlaylistName(updatedName);
    }

    // Function to get the playlist of tracks that we found on the destination platform
    const getNewPlaylist = async () => {

        // Step 1: Retrieve playlist data from sessionStorage
        // setOriginalPlaylist(JSON.parse(sessionStorage.getItem("originalPlaylist")));
        let destPlatform = JSON.parse(sessionStorage.getItem("destPlatform"));  // Ideally, this would be a state variable, or even a global variable because this is also used in the useEffect hook. But neither work
        let destUserAccount = JSON.parse(sessionStorage.getItem("userAccount"));
        let token = JSON.parse(sessionStorage.getItem("token"));

        // Step 2: call the transferPlaylist function from webService
        await webService.getNewPlaylist(destPlatform, token, JSON.parse(sessionStorage.getItem("originalPlaylist")))
        .then(results => {
            setNewPlaylistTracks(results.tracksFromSearch);
            setMissingTracks(results.missingTracks);
            return results;
        });
    };
    
    // Once the page loads, start forming the playlist that will be added to the destination account
    useEffect(() => {
        getNewPlaylist();
    }, []);

    // Need to change the webService functions (line 71) so that it returns the new playlist instead of transferring it right away
    // // Begin the transferring of the playlist
    // const beginTransferPlaylist = async () => {
    //     // Step 1: Retrieve playlist data from sessionStorage
    //     handleSetPlaylist(JSON.parse(sessionStorage.getItem("playlist")));
    //     let destPlatform = JSON.parse(sessionStorage.getItem("destPlatform"));  // Ideally, this would be a state variable, or even a global variable because this is also used in the useEffect hook. But neither work

    //     // Step 2: call the transferPlaylist function from webService
    //     let errorTracks;    // Tracks that were not transferred due to some error
    //     await webService.transferPlaylist(destPlatform, token, userAccount.userID, JSON.parse(sessionStorage.getItem("playlist")))
    //             .then(response => {
    //                 errorTracks = response;
    //             })
    //             .then(() => {
    //                 setMissingTracks(errorTracks);
                    
    //                 // Step 3: Alert the user that the transfer has been done, and highlight the tracks that were not transferred
    //                 setShowSummary(true);
    //             });

    // };

    return(
        <main>
            <div className="frontCard" >
                <h2>Make Sure We Got It Right!</h2>
                <div className="cardBody">
                    <div className="tracklistSummary">
                        <h2>{originalPlaylist.playlistName}</h2>
                        <TracklistDisplay className="tracklist" id="originalPlaylist" playlist={originalPlaylist.tracks} isEditable={false} />
                    </div>
                    <div id="middle"/>
                    <div className="tracklistSummary">
                        <input className="h2Textbox" type="text"  value={newPlaylistName} onChange={updateNewPlaylistName}/>
                        <TracklistDisplay className="tracklist" id="newPlaylist" playlist={newPlaylistTracks} isEditable={true} />
                    </div>
                </div>
            </div>
        </main>
    )
};

export default TransferPage;