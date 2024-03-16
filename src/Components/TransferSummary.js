import "../Views/TransferSummaryViews.css";
import { useNavigate } from "react-router-dom";
import TracklistDisplay from "./TracklistDisplay";

const TransferSummary = (playlist) => {

    let missingSongs = playlist.playlist;

     // Go back to the home page, so that the user can access the link entry again
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate("/");
    };
    
    return(
        <div className="mainCard">
            <div>
                <h2>Transfer Complete!</h2>
                <h5>{missingSongs?.length === 0 ? `All songs were transferred successfully!` : `The following songs were not transferred...`}</h5>
            </div>
           { missingSongs.length > 0 && 
                <TracklistDisplay playlist={missingSongs} />
            }

            <div>
                <button className="btn btn-primary confirmButton" type="button" onClick={navigateHome}>
                    Transfer another playlist!
                </button>
            </div>

        </div>
    );

};

export default TransferSummary;