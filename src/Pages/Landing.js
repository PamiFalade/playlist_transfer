import { React, useState, useEffect } from "react";
import "../Views/LandingViews.css";
import { Card, Button }from "react-bootstrap";
import { Form, redirect, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Buffer } from "buffer";
import LinkInput from "../Components/LinkInput";
import {
  extractSource,
  extractPlaylistInfo
} from "../models/webService";

/// The landing page of the application. This is where the user can begin the transfer process either by 
/// inputting the share link of the playlist they want to transfer, or by logging into the account which
/// has the playlist they want to transfer
const Landing = () => {

  return (
    <div className="mainSection mainSectionBlue">
      <h1>Find your playlist...</h1>
      
      {/* IDEA: Change the theme of the app based on the share link (i.e., once the link is entered into the input field, check its source. Then change the theme of the app accordingly) */}
      <LinkInput />
      
    </div>
  );
};

export default Landing;

// Works if it's in LinkInput, but throws an error if the function is not present in this file
export const playlistLinkAction = async ({ request }) => {
  const data = await request.formData();
  const submission = { playlistLink: data.get('playlistLink') };
  const playlistLink = submission.playlistLink;

  let playlistInfo = extractPlaylistInfo(playlistLink);

  // Need to encode this so that it does not interfere with URL (i.e., SoundCloud) 
  playlistInfo.ID = encodeURIComponent(playlistInfo.ID);
  
  return redirect(`/playlist-confirm/${playlistInfo.source}-${playlistInfo.ID}`);
};