import "../Views/TracklistDisplayViews.css";
import * as sharedService from "../models/sharedService";

const TracklistDisplay = (playlist) => {

    let tracks = playlist.playlist;

    return(
        <div className="tracklistDisplay">
            {tracks.map((song, index) => {
                return <div className="songDisplay" key={index}>
                <img src={song.image !== "" ? song.image : sharedService.missingTrackImg}/>
                <div className="songInfo" style={{marginLeft:"5%"}}>
                    <h5>{sharedService.truncateString(song.name, 26)}</h5>
                    <p>{sharedService.truncateString(song.artists, 45)}</p>
                </div>
                </div>
            })}
        </div>
    );

};

export default TracklistDisplay;