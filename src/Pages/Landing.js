import { React, useState, useEffect } from "react";
import "../Views/LandingViews.css";
import { Card, Button }from "react-bootstrap";
import { Form, redirect, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Buffer } from "buffer";
import PlatformSelector from "../Components/PlatformSelector";
import {
  extractSource,
  extractPlaylistInfo
} from "../models/webService";

/// The landing page of the application. This is where the user can begin the transfer process either by 
/// inputting the share link of the playlist they want to transfer, or by logging into the account which
/// has the playlist they want to transfer
const Landing = () => {

  return (
    <main className="landing">
      <h1>Welcome!</h1>
      <h2>Find your playlist...</h2>
      <Card className="card">
        <Card.Title className="cardTitle">With Share Link...</Card.Title>
        <Card.Body>
          <Form method="post" className="form" action="">
            <input type="url" className="entry" name="playlistLink"/>
            <button className="submitButton">Submit</button>
          </Form>
        </Card.Body>
      </Card>

      <PlatformSelector />
    </main>
  );
};

export default Landing;

export const playlistLinkAction = async ({ request }) => {
  const data = await request.formData();
  const submission = { playlistLink: data.get('playlistLink') };
  const playlistLink = submission.playlistLink;

  let playlistInfo = extractPlaylistInfo(playlistLink);
  console.log(playlistInfo);
  
  return redirect(`/playlist-confirm:${playlistInfo.source}-${playlistInfo.ID}`);
};