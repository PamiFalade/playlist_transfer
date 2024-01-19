import "../Views/LinkInputViews.css";
import { React, useState, useEffect } from "react";
import { Card, Button }from "react-bootstrap";
import { Form, redirect, useNavigate } from "react-router-dom";
import { extractSource, extractPlaylistInfo } from "../models/webService";




const LinkInput = () => {

    return(
        <Card className="card">
        <Card.Title className="cardTitle">With Share Link...</Card.Title>
        <Card.Body>
          <Form method="post" className="form" action="">
            <input type="url" className="entry" name="playlistLink"/>
            <button className="submitButton">Submit</button>
          </Form>
        </Card.Body>
      </Card>
    );
}

export default LinkInput;