import "../Views/TracklistDisplayViews.css";
import { useRef, useState, useEffect } from "react";
import * as sharedService from "../models/sharedService";
import React from "react";

const TracklistDisplay = (props) => {

    let tracks = props.playlist;

    const refTrackListDisplay = useRef();   // Will be used to adjust the truncation of the strings within the Tracklist Display based on window size
    const [trackListWidth, setTrackListWidth] = useState(0);

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
                        <img className="songImg" src={song.image !== "" ? song.image : sharedService.missingTrackImg}/>
                        <div className="songInfo">
                            <h5>{(index+1) + "." + sharedService.truncateString(song.name, trackListWidth/20)}</h5>
                            <p>{sharedService.truncateString(song.artists, trackListWidth/18)}</p>
                        </div>
                    </div>
                    {tracks.length - index > 1 && <div className="line" /> /* Prevent a line from being drawn under the last element in the list */}
                </li>
            )})}
        </ul>
    );

};

export default TracklistDisplay;