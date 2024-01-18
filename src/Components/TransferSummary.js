import "../Views/TransferSummaryViews.css";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import TracklistDisplay from "./TracklistDisplay";

const TransferSummary = (playlist) => {

    let missingSongs = playlist.playlist;

     // Go back to the home page, so that the user can access the link entry again
    const navigate = useNavigate();

    const navigateHome = () => {
        navigate("/");
    };
    
    return(
        <Card className="mainCard">
            <Card.Title>Transfer Complete!</Card.Title>
            <Card.Subtitle>{missingSongs.length === 0 ? `All songs were transferred successfully!` : `The following songs were not transferred...`}</Card.Subtitle>
            
           { missingSongs.length > 0 && 
            <Card.Body>
                <TracklistDisplay playlist={missingSongs} />
            </Card.Body> 
            }


            <Card.Footer>
                <button className="btn btn-primary confirmButton" type="button" onClick={navigateHome}>
                    Transfer another playlist!
                </button>
            </Card.Footer>

        </Card>
    );

};

export default TransferSummary;