import { React, useState, useEffect } from "react";
import "../Views/LandingViews.css";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import { Buffer } from "buffer";
import {
  fetchPlaylist,
  setupToken,
  handleAuthorization,
  getAccessToken,
  getUserDetails,
} from "../models/webService";

const Landing = () => {


  return (
    <div className="landing">
      <h1>Welcome!</h1>
      <h2>Find your playlist...</h2>
      <Card className="card">
        <Card.Title className="cardTitle">With Share Link...</Card.Title>
        <Card.Body>
          <Form>
            <Form.Group className="form" controlId="home-ShareLinkInput">
              <Form.Control className="entry" placeholder="Enter playlist share link here..." />
              <Button className="submitButton" variant="primary" type="submit">Submit</Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>

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
    </div>
  );
};

export default Landing;
