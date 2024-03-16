import { useState } from "react";
import "../Views/PlaylistConfirmViews.css";
import { Button } from "react-bootstrap";
import PlaylistDetails from "../Components/PlaylistDetails";


const PlaylistConfirm = () => {

    return(
        <main>
            <div className="mainSection">
                <PlaylistDetails />
            </div>
        </main>
        
    );
}

export default PlaylistConfirm;

export const playlistConfirmLoadeer = async () => {

};