import { React, useState, useEffect } from "react";
import "./Views/LandingViews.css";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import { Buffer } from "buffer";
import { fetchPlaylist, setupToken, fetchTracks } from "./models/webService";

//TO-DO: Finish up styling of track display, and figure out how to surpass the 100 song limit

const Landing = () => {
  //show variable for displaying the modal that takes the playlist link and call the handleTransfer function
  const [showLinkModal, setShowLinkModal] = useState(false);
  const handleShowLinkModal = () => setShowLinkModal(true);
  const handleCloseLinkModal = () => setShowLinkModal(false);

  //show variable for displaying the modal that displays the playlist that was fetched from the source platform
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleShowConfirmModal = () => setShowConfirmModal(true);
  const handleCloseConfirmModal = () => setShowConfirmModal(false);

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
  const [playlistLink, setPlaylistLink] = useState("");

  //Object that will hold relevant info on the playlist to be transferred
  const [playlist, setPlaylist] = useState({
    name: "",
    image: "",
    owner: "",
    tracks: [],
    offset: "",
  });

  const transferPlaylist = () => {
    console.log("Heyyy " + playlistLink);
    const link = playlistLink;
    if (link === "") return; //To prevent the useEffect from doing anything when it runs after the first render, when there is no link

    //Step 1: get access token for source platform
    setupToken(source).then((token) => {
      //By making setupToken an async function, you made it so that it returns a promise. So, it needs to be treated as such
      setSourceToken(token); //Use this function to notify when source token has been updated

      //Step 2: retrieve playlist from source platform
      fetchPlaylist(link, token, source)
        .then((retrievedPlaylist) => {
          console.log(retrievedPlaylist);
          setPlaylist(retrievedPlaylist);
        })
        .then(() => {
          handleShowConfirmModal();
        })
        .catch((error) => console.log(error));
    });
  };

  useEffect(transferPlaylist, [playlistLink, playlist]);

  //Formik to manage and validate inputted link
  const initialValues = {
    link: "",
  };

  const onSubmit = (values) => {
    //Once the link has been submitted, begin the playlist transfer
    setPlaylistLink(values.link);
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

      <Modal
        show={showConfirmModal}
        onHide={handleCloseConfirmModal}
        backdrop="static"
        contentClassName="PlaylistDisplayModal"
      >
        <Modal.Header>
          <Modal.Title>This Playlist?</Modal.Title>
        </Modal.Header>

        <Modal.Body className="PlaylistDisplayModalBody">
          <div className="leftSide">
            <img
              src={playlist.image}
              alt="Playlist Cover"
              width="100%"
              height="100%"
            />
            <h1>{playlist.name}</h1>
          </div>
          <div className="rightSide">
            <div className="trackList">
              {/* Kept getting: "Uncaught TypeError: Cannot read properties of undefined (reading 'map')" without the question mark
                    The question mark checks that the array exists first before executing the map function*/}
              {playlist.tracks?.map((song, index) => (
                <div className="trackDisplay" key={index}>
                  <img src={song.songAlbumImg.url} />
                  <p>{song.songName}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Nope
          </Button>
          <Button variant="primary" onClick={handleCloseConfirmModal}>
            Yes!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Landing;
