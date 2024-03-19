import "../Views/TracklistDisplayViews.css";
import { useRef, useState, useEffect } from "react";
import * as sharedService from "../models/sharedService";
import React from "react";

/// Reusable component used to display a list of tracks.
/// First prop is the "playlist" prop, which is the array of tracks that will be displayed.
/// Second prop is the "isEditable" prop, which indicates whether the user will be able to interact with the UI to edit the array of tracks. This enables the delete button
const TracklistDisplay = (props) => {

    let playlist = props.playlist;
    let isEditable = props.isEditable;

    // State variable for the track list that will be sent to the destination account
    const [tracks, setTracks] = useState([...playlist]);

    const refTrackListDisplay = useRef();   // Will be used to adjust the truncation of the strings within the Tracklist Display based on window size
    const [trackListWidth, setTrackListWidth] = useState(0);

    // State variable and helper functions for updating the icons
    const getIconColor = () => localStorage.getItem("iconColor");
    const [iconColor, setIconColor] = useState(getIconColor());

    // Remove a track from the list when the remove icon is clicked on the TracklistDisplay
    const removeTrack = (trackIndex) => {
        let updatedTracks = [...tracks];
        updatedTracks.splice(trackIndex, 1);
        setTracks(updatedTracks);
    }

    // Add event listener to the localStorage and update the colors of the icons when the event is triggered by changing the color theme
    useEffect(() => {
        const storage = (event) => {
          setIconColor(localStorage.getItem("iconColor"));
        };
        window.addEventListener("storage", storage);
         
        return ()=> window.removeEventListener("storage", storage)
    }, []); 

    useEffect(() => {
        if(refTrackListDisplay.current){
            // Get the width of the tracklist when it gets mounted
            setTrackListWidth(refTrackListDisplay.current.offsetWidth);

            const getwidth = () => {
                setTrackListWidth(refTrackListDisplay.current.offsetWidth);
              };
              window.addEventListener("resize", getwidth);
              // remove the event listener before the component gets unmounted
              return () => window.removeEventListener("resize", getwidth);
        }
    }, []);

    return(
        <ul className="tracklistDisplay scrollable" ref={refTrackListDisplay}>
            {tracks.map((song, index) => {
                return (
                <li key={index}>
                    <div className="songDisplay">
                        <div>
                            <img className="songImg" src={song.image !== "" ? song.image : sharedService.missingTrackImg}/>
                        </div>
                        <div className="songInfo">
                            <h5>{(index+1) + ". " + sharedService.truncateString(song.name, trackListWidth/20)}</h5>
                            <p>{sharedService.truncateString(song.artists, trackListWidth/18)}</p>
                        </div>
                        { isEditable && 
                            <div className="closeButton" onClick={() => removeTrack(index)}>
                                <img className="closeIcon" src={`${iconColor}-close.svg`} />
                            </div>
                        }
                    </div>
                    {tracks.length - index > 1 && <div className="line" /> /* Prevent a line from being drawn under the last element in the list */}
                </li>
            )})}
        </ul>
    );

};

export default TracklistDisplay;