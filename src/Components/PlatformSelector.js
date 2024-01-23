import { React } from "react";
import { Card } from "react-bootstrap";
import "../Views/PlatformSelectorViews.css";
import { redirectToUserAuthorization } from "../models/webService";


const PlatformSelector = () => {


    const handleLogin = (id) => {
        console.log(id);
        let platform = "";
        switch(id){
            case "spotifyButton":
                platform = "spotify";
                break;
            case "appleButton":
                platform = "apple";
                break;
            case "youtubeButton":
                platform = "youtube";
                break;
        };

        redirectToUserAuthorization(platform);
    };

    return(
        <Card id="platformCard">
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