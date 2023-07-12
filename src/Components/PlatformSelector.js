import { React } from "react";
import { Card } from "react-bootstrap";
import "../Views/PlatformSelectorViews.css";


const PlatformSelector = () => {

    return(
        <Card className="card">
            <Card.Title>With Login...</Card.Title>
            <Card.Subtitle>Login to find the playlist</Card.Subtitle>
            <Card.Body>
            <div id="platformGrid">
                <div className="logoContainer">
                    <img className="platformLogo" src="spotify.svg" />
                </div>
                <div className="logoContainer">
                    <img className="platformLogo" src="apple-music.svg" />
                </div>
                <div className="logoContainer">
                    <img  className="platformLogo" src="soundcloud.svg" />
                </div>

            </div>
            </Card.Body>
        </Card>
    );
};

export default PlatformSelector;