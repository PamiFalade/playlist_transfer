import { React, useState, useEffect } from "react";
import "./Views/LandingViews.css";
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
} from "./models/webService";

const Landing = () => {
  //show variable for displaying the modal that takes the playlist link and call the handleTransfer function
  const [showLinkModal, setShowLinkModal] = useState(false);
  const handleShowLinkModal = () => setShowLinkModal(true);
  const handleCloseLinkModal = () => setShowLinkModal(false);

  //show variable for displaying the modal that displays the playlist that was fetched from the source platform
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleShowConfirmModal = () => setShowConfirmModal(true);
  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  //show variable for displaying the modal that displays the playlist that was fetched from the source platform
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  //source variable to represent the origin platform of the playlist
  const [source, setSource] = useState("");
  const handleSource = (link) => {
    if (link.startsWith("https://open.spotify.com/playlist/"))
      setSource("spotify");
    else if (link.startsWith("https://music.apple.com/ca/playlist/"))
      //May need to change this because of the 'ca'
      setSource("apple");
  };

  //dest variable to represent the destination platform of the playlist
  const [dest, setDest] = useState("");

  //variable to hold my access token
  const [sourceToken, setSourceToken] = useState("");

  //variable to hold user's access token
  const [destToken, setDestToken] = useState("");

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

  //Object to hold logged-in user's information
  const [user, setUser] = useState({
    username: "",
    email: "",
    id: "",
    img: "",
  });

  //Variable used to cause the thing to re-render so that all songs past #100 will display
  const [loadedPlaylists, setLoadedPlaylists] = useState(false);

  const transferPlaylist = () => {
    const link = playlistLink;
    if (link === "") return; //To prevent the useEffect from doing anything when it runs after the first render, when there is no link

    //Step 1: get access token for source platform
    setupToken(source).then((token) => {
      //By making setupToken an async function, you made it so that it returns a promise. So, it needs to be treated as such
      setSourceToken(token); //Use this function to notify when source token has been updated

      //Step 2: retrieve playlist from source platform
      fetchPlaylist(link, token, source)
        .then((retrievedPlaylist) => {
          setPlaylist(retrievedPlaylist);
        })
        .then(() => {
          handleShowConfirmModal();
          setLoadedPlaylists(true);
        })
        .catch((error) => console.log(error));
    });
  };

  //Call the appropriate login function
  const handleLogin = (event) => {
    handleCloseLoginModal();
    if (event.currentTarget.id === "spotifyLogin") {
      setDest("spotify");
      handleAuthorization("spotify");
    } else if (event.currentTarget.id === "appleLogin") {
      setDest("apple");
      handleAuthorization("apple");
    } else if (event.currentTarget.id === "deezerLogin") {
      setDest("deezer");
      handleAuthorization("deezer");
    } else if (event.currentTarget.id === "youtubeLogin") {
      setDest("youtube");
      handleAuthorization("youtube");
    }
  };

  // Re-run the transferPlaylist function when a new playlist has been loaded
  useEffect(transferPlaylist, [playlistLink]);

  //Get the user's access token once they log in and store it in the state variable
  useEffect(() => {
    if (window.location.search) {
      getAccessToken().then((token) => {
        if (token != "") {
          setDestToken(token);
          let destProfile = getUserDetails(token, "spotify").then(
            (retrievedUser) => {
              console.log(retrievedUser);
              setUser({
                username: retrievedUser.display_name,
                email: retrievedUser.email,
                id: retrievedUser.id,
                image: retrievedUser.images[0].url,
              });
            }
          );
        }
      });
    }
  }, [window.location]);

  //Formik to manage and validate inputted link
  const initialValues = {
    link: "",
  };

  const onSubmit = (values) => {
    //Once the link has been submitted, begin the playlist transfer
    handleSource(values.link);
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
      <Button
        type="button"
        className="btn btn-light"
        onClick={handleShowLoginModal}
      >
        Login
      </Button>
      <div className="AccountInfo">
        <img src={user.image} width="50%"/>
        <p>{user.username}</p>
      </div>
      <Card className="Landing" border="primary">
        <Card.Header>
          <Card.Title>
            <h1>Welcome!</h1>
          </Card.Title>
        </Card.Header>
        <Card.Body className="LandingBody">
          {!loadedPlaylists && (
            <Card
              border="primary"
              className="actionButton"
              onClick={handleShowLinkModal}
            >
              <Card.Body>
                <h3>Begin Transfer</h3>
              </Card.Body>
            </Card>
          )}
          {loadedPlaylists && (
            <div>
              <Card border="primary">
                <Card.Header>Login</Card.Header>
                <Card.Body>
                  <Button id="spotifyLogin" onClick={handleLogin}>
                    Spotify
                  </Button>
                  <Button>Apple</Button>
                  <Button>Deezer</Button>
                  <Button>YouTube</Button>
                  {/* <img src='https://i.scdn.co/image/ab67706c0000bebb5cbc1132087a5d55b5c50247'/> */}
                </Card.Body>
              </Card>

              <Card border="primary">
                <div className="trackDisplay">
                  <img src={playlist.image} />
                  <p>{playlist.name}</p>
                </div>
              </Card>
            </div>
          )}
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
            <h4>{playlist.tracks.length} songs</h4>
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
      <Modal show={showLoginModal} onHide={handleCloseLoginModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="LoginContainer">
          <div className="LoginGrid">
            <div
              id="spotifyLogin"
              className="loginButton"
              onClick={handleLogin}
            >
              <img
                src="https://www.freepnglogos.com/uploads/spotify-logo-png/image-gallery-spotify-logo-21.png"
                width="50%"
              />
            </div>
            <div id="appleLogin" className="loginButton" onClick={handleLogin}>
              <img
                src="https://i.pinimg.com/736x/67/f6/cb/67f6cb14f862297e3c145014cdd6b635.jpg"
                width="50%"
              />
            </div>
            <div id="deezerLogin" className="loginButton" onClick={handleLogin}>
              <img
                src="https://logos-world.net/wp-content/uploads/2021/03/Deezer-Logo.png"
                width="50%"
              />
            </div>
            <div
              id="youtubeLogin"
              className="loginButton"
              onClick={handleLogin}
            >
              <img
                src="https://seeklogo.com/images/Y/youtube-music-logo-50422973B2-seeklogo.com.png"
                width="50%"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Landing;
