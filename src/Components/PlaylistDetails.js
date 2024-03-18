import "../Views/PlaylistDetailsViews.css";
import { React, useState, useEffect, createRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import loadscript from "load-script";
import * as webService from "../models/webService";
import * as sharedService from "../models/sharedService";
import MissingSongsDisplay from "./TransferSummary";
import TracklistDisplay from "./TracklistDisplay";
import ScaleLoader from "react-spinners/ScaleLoader";



const PlaylistDetails = () => {
 
    // Get the playlist's source platform and ID from the URL parameters
    const { id } = useParams(); 
    const sourcePlatform = id.substring(0, id.indexOf('-'));
    const playlistID = id.substring(id.indexOf('-') + 1);
    
    // Move on to the Destination Select page once the playlist has been confirmed
    const navigate = useNavigate();

    // Used to display loading symbol while playlist isn't loaded yet.
    // Loading symbol is displayed while it's "loading", and playlist will be displayed while it is "not loading"
    const [loading, setLoading] = useState(true);

    // Save playlist data to sessionStorage to make it persistent, so that it can be accessed in the DestinationSelect page.
    // Then navigate to DestinationSelect page
    const openDestinationSelect = () => {
        // Save all the playlist data to session storage
        sessionStorage.setItem("originalPlaylist", JSON.stringify(playlist));

        // Go to DestinationSelect page
        navigate("/destination-select");
    };

    // Go back to the home page, so that the user can access the link entry again
    const navigateBack = () => {
        navigate("/");
    };

    /// The playlist that will be transferred
    const [playlist, setPlaylist] = useState({
        playlistName: "",
        username: "",
        id: "",
        tracks: [],
        image: "",
        length: ""
    });

    /// Boolean that indicates if the playlist was found
    const [foundPlaylist, setFoundPlaylist] = useState(false);

    /// Call the method to set the song objects in the tracklist then update the state variables
    /// that hold the playlist and indicate if the playlist has been found
    const handleSetPlaylist = async (retrievedPlaylist) => {
        // Made extractSongInfo() available at this level because the SoundCloud API can't be used in the same way as the others
        retrievedPlaylist = await webService.extractSongInfo(sourcePlatform, retrievedPlaylist)      // Get the important details of each song and put in general template
            .then(() => {
                setLoading(false);
                setPlaylist(retrievedPlaylist);
                setFoundPlaylist(true);
            }); 

     };
 
    /// SoundCloud Widget player stuff
    const [scPlayer, setSCPlayer] = useState(false);
    const iframeRef = createRef();
    
    /// Function for loading the SoundCloud playlist through the SoundCloud Widget API
    const loadSoundCloudPlaylist = () => {
    loadscript('https://w.soundcloud.com/player/api.js', () => {

            // initialize player and store reference in state

            const player = window.SC.Widget(iframeRef.current);
            setSCPlayer(player);

            player.bind(window.SC.Widget.Events.READY, () => {
                function tryGetSounds() {
                    player.getSounds((songList) => {
                        var notComplete = false;
                        for(var i=0, len=songList.length; i<len; i++){
                            if(songList[i].title === undefined){
                                notComplete = true;
                                break;
                            }
                        }
                        if (notComplete) {
                            console.log('Not complete. Try again in 200ms ...');
                            setTimeout(function () {
                            tryGetSounds();
                            }, 200);
                        } else {
                            console.log('Complete!');
                            let retrievedPlaylist = {
                            playlistName: "name",
                            username: "user",
                            id: playlistID,
                            tracks: [...songList],
                            image: songList[0].artwork_url,
                            length: ""
                            }
                            handleSetPlaylist(retrievedPlaylist);
                        }
                    });
                }
                tryGetSounds();
            });
        });
    };

    /// Call the webService methods that fetch the Spotify token and then fetch the requested playlist
    const loadSpotifyPlaylist = async() => {
        let token = "";

        await webService.fetchToken(sourcePlatform)
            .then((tokenResponse) => {
                token = tokenResponse;
            })
            .then(() => {
                webService.fetchPlaylist(sourcePlatform, token, playlistID)
                .then((playlistResponse) => {
                    console.log(playlistResponse);
                    handleSetPlaylist(playlistResponse);
                });
            });        
    };

    const loadPlaylist = async() => {
        await webService.fetchPlaylist(sourcePlatform, "", playlistID)
            .then((playlistResponse) => {
                console.log(playlistResponse);
                handleSetPlaylist(playlistResponse);
            });
    };

    /// Load the SoundCloud Widget API, or fetch the playlists through the other platforms' API's
    useEffect(() => {
        if(sourcePlatform === "soundcloud") {
        loadSoundCloudPlaylist();
        }
        else if(sourcePlatform === "spotify") {
        loadSpotifyPlaylist();
        }
        else {
            loadPlaylist();
        }

    }, [sourcePlatform, playlistID]);
      

    return(
        <main>
            <div className="mainSection">
                <div id="playlistSummary">
                    
                    {/* Loading symbol */}
                    { loading && 
                        <div className="loadingSymbol">
                            <h2>Fetching Playlist...</h2>
                            <ScaleLoader 
                                color="var(--primary-fg-color)"
                                loading={loading}
                                size={150}
                                aria-label="Loading Spinner"
                                data-testid="loader"/>
                        </div>
                    }

                    {/* SoundCloud Widget API */}
                    { foundPlaylist === false && sourcePlatform === "soundcloud" &&
                        <iframe ref={iframeRef} className="sc-widget" id="SCwidget" width="0px" height="500%" allow="autoplay" style={{position:"absolute", left:"0", top:"0", fontSize:"40"}}
                                src={`https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${playlistID}/&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`} /> 
                }


                { foundPlaylist === true &&
                    <div>
                        <div className="playlistSummaryHeader">
                            <img id="playlistImage" src={playlist.image}/>
                            <h2>{playlist.playlistName}</h2>
                            <div id="playlistInfo">
                                <p>{playlist.tracks.length} songs | {playlist.length}</p>
                            </div>
                        </div>
                        <div className="tracklistSection">
                            <TracklistDisplay playlist={playlist.tracks} isEditable={false} />
                        </div>
                        <div className="actionButtons">
                            <button className="button returnButton" type="button" onClick={navigateBack}>
                                Back
                            </button>

                            <button className="button submitButton" type="button" onClick={openDestinationSelect}>
                                This is it!
                            </button>
                        </div>
                    </div> }

                </div>
            </div>
        </main>
    );
};

export default PlaylistDetails;

