import { useState } from "react";
import "../Views/PlaylistConfirmViews.css";
import { Button } from "react-bootstrap";
import PlaylistDetails from "../Components/PlaylistDetails";


const PlaylistConfirm = () => {

    return(
        <main id="playlistSummary">
            <PlaylistDetails />

        </main>
    );
}

export default PlaylistConfirm;

export const playlistConfirmLoadeer = async () => {

};