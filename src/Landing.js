import { React, useState } from "react";
import "./Views/LandingViews.css";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import { Buffer } from "buffer";
import { fetchPlaylist, setupToken } from "./models/webService";

const Landing = () => {
  //show variable for displaying the modal that takes the playlist link and call the handleTransfer function
  const [showLinkModal, setShowLinkModal] = useState(false);
  const handleShowLinkModal = () => setShowLinkModal(true);
  const handleCloseLinkModal = () => setShowLinkModal(false);

  //source and dest variables to represent the origin platform and destination platform of the playlist respectively
  const [source, setSource] = useState("");
  const [dest, setDest] = useState("");
  //sets source and dest variables
  const handleTransfer = (source, dest) => {
    setSource(source);
    setDest(dest);
  };

  //variable to hold the access token
  const [sourceToken, setSourceToken] = useState("");

  //Link that has been entered into
  const playlistLink = "";
  //Object that will hold relevant info on the playlist to be transferred
  const playlist = {
    name: "",
    image: "",
    owner: "",
    tracks: [],
  };
  //Formik to manage and validate inputted link
  const initialValues = {
    link: "",
  };

  const onSubmit = (values) => {
    //Step 1: get access token for source platform
    setupToken(source).then((promise) => {
      //By making setupToken an async function, you made it so that it returns a promise. So, it needs to be treated as such
      setSourceToken(promise.token); //Use this function to notify when source token has been updated

      //Step 2: retrieve playlist from source platform
      fetchPlaylist(values.link, promise.token, source)
        .then((retrievedPlaylist) => {
          playlist.name = retrievedPlaylist.name;
          playlist.images = retrievedPlaylist.images[1];
          playlist.owner = retrievedPlaylist.owner.display_name;
          playlist.tracks = retrievedPlaylist.tracks.items.map((song) => {
            return {
              songName: song.track.name,
              isExplicit: song.track.explicit,
              songAlbum: song.track.album.name,
              songAlbumImg: song.track.album.images[2],
              songArtists: [...song.track.artists],
              sourceURI: song.track.uri,
              destURI: "",
            };
          });
          console.log(playlist);
        })
        .catch((error) => console.log(error));
    });

    //Step 2: retrieve playlist from source platform
  };

  const validate = (values) => {
    let errors = {};

    if (!values.link) {
    }
  };

  const linkForm = useFormik({ initialValues, onSubmit, validate });

  return (
    <div>
      <Card className="Landing" border="primary">
        <Card.Header>
          <Card.Title>Welcome!</Card.Title>
        </Card.Header>
        <Card.Body className="LandingBody">
          <Card
            border="primary"
            className="transferOption"
            onClick={() => {
              handleShowLinkModal();
              handleTransfer("apple", "spotify");
            }}
          >
            <Card.Body>
              <img
                src="https://pbs.twimg.com/profile_images/1431129444362579971/jGrgSKDD_400x400.jpg"
                className="Logo"
              />
              <img
                src="https://toppng.com/uploads/preview/right-arrow-icon-ico-11562931718i8rqgsef9d.png"
                className="Logo"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/800px-Spotify_logo_without_text.svg.png"
                className="Logo"
              />
            </Card.Body>
          </Card>
          <Card
            border="primary"
            className="transferOption"
            onClick={() => {
              handleShowLinkModal();
              handleTransfer("spotify", "apple");
            }}
          >
            <Card.Body>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/800px-Spotify_logo_without_text.svg.png"
                className="Logo"
              />
              <img
                src="https://toppng.com/uploads/preview/right-arrow-icon-ico-11562931718i8rqgsef9d.png"
                className="Logo"
              />
              <img
                src="https://pbs.twimg.com/profile_images/1431129444362579971/jGrgSKDD_400x400.jpg"
                className="Logo"
              />
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>

      <Modal show={showLinkModal} onHide={handleCloseLinkModal}>
        <Modal.Header closeButton>
          <Modal.Title>Let's transfer!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={() => {
              handleCloseLinkModal();
              linkForm.handleSubmit();
            }}
          >
            <Form.Label>Share Link for Playlist</Form.Label>
            <Form.Control
              name="link"
              id="link"
              type="url"
              placeholder="Enter the link to the playlist"
              onChange={linkForm.handleChange}
              value={linkForm.values.link}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLinkModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCloseLinkModal();
              linkForm.handleSubmit();
            }}
            type="submit"
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Landing;
