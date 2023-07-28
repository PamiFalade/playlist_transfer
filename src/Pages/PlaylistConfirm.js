import { useState } from "react";
import "../Views/PlaylistConfirmViews.css";
import { Button } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import PlaylistDetails from "../Components/PlaylistDetails";


const PlaylistConfirm = () => {

    return(
        <main id="playlistSummary">
            <PlaylistDetails />

            <div className="confirmButtons">
                <Button variant="secondary">
                    Go Back
                </Button>

                <Button variant="primary">
                    This is it!
                </Button>
            </div>
        </main>
    );
}

export default PlaylistConfirm;

export const playlistConfirmLoadeer = async () => {

};