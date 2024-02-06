import "../Views/LinkInputViews.css";
import { React, useState, useEffect } from "react";
import { Card, Button }from "react-bootstrap";
import { Form, redirect, useNavigate } from "react-router-dom";
import { extractSource, extractPlaylistInfo } from "../models/webService";




const LinkInput = () => {

    return(
      <div className="backCard">
        <div className="frontCard">
          <h2 className="cardTitle">With the Share Link...</h2>
            <Form method="post" className="form" action="">
              <input type="url" className="entry" name="playlistLink"/>
              <button className="submitButton">Submit</button>
            </Form>
        </div>
      </div>
    );
}

export default LinkInput;