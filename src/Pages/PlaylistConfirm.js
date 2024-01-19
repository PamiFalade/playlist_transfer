import { useState } from "react";
import "../Views/PlaylistConfirmViews.css";
import { Button } from "react-bootstrap";
import PlaylistDetails from "../Components/PlaylistDetails";


const PlaylistConfirm = () => {

    return(
        <div className="mainSection mainSectionRed">
            <PlaylistDetails />
        </div>
    );
}

export default PlaylistConfirm;

export const playlistConfirmLoadeer = async () => {

};