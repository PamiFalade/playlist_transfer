import { React } from "react";
import { Card } from "react-bootstrap";
import "../Views/PlatformSelectorViews.css";
import { redirectToUserAuthorization } from "../models/webService";


const PlatformSelector = (props) => {

    // Title that will be at the top of the card
    const title = props.title;

    const handleLogin = (id) => {
        console.log(id);
        let destPlatform = "";
        switch(id){
            case "spotifyButton":
                destPlatform = "spotify";
                break;
            case "appleButton":
                destPlatform = "apple";
                break;
            case "youtubeButton":
                destPlatform = "youtube";
                break;
        };

        redirectToUserAuthorization(destPlatform);
        sessionStorage.setItem("destPlatform", JSON.stringify(destPlatform));

    };

    return(
        <Card id="platformCard">
            <Card.Title>
                <h2>{title}</h2>
            </Card.Title>
            <Card.Body>
            <div id="platformGrid">
                <div className="logoContainer" id="spotifyButton" onClick={() => {handleLogin("spotifyButton")}}>
                    <img className="platformLogo" src="spotify.svg" />
                </div>
                <div className="logoContainer" id="appleButton" onClick={() => {handleLogin("appleButton")}}>
                    <img className="platformLogo" src="apple-music.svg" />
                </div>
                <div className="logoContainer" id="youtubeButton" onClick={() => {handleLogin("youtubeButton")}}>
                    <img  className="platformLogo" src="youtube-music.svg" />
                </div>

            </div>
            </Card.Body>
        </Card>
    );
};

export default PlatformSelector;