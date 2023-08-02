import "../Views/PlaylistDetailsViews.css";
import { React, useState, useEffect, createRef } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import loadscript from "load-script";
import * as webService from "../models/webService";
import * as sharedService from "../models/sharedService";



const PlaylistDetails = () => {
 
    // Get the playlist's source platform and ID from the URL parameters
    const { id } = useParams(); 
    const sourcePlatform = id.substring(0, id.indexOf('-'));
    const playlistID = id.substring(id.indexOf('-') + 1);

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
    const handleSetPlaylist = (retrievedPlaylist) => {
        retrievedPlaylist = webService.extractSongInfo(sourcePlatform, retrievedPlaylist); // Get the important details of each song and put in general template


        setPlaylist(retrievedPlaylist);
        setFoundPlaylist(true);
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
                            console.log(songList);
                        }
                    });
                }
                tryGetSounds();
            });
        });
    };

      /// Call the webService methods that fetch the Spotify token and then fetch the requested playlist
      const loadSpotifyPlaylist = async() => {
        let token;

        await webService.fetchToken(sourcePlatform)
            .then((tokenResponse) => {
                token = tokenResponse;
            })
            .then(() => {
                webService.fetchPlaylist(sourcePlatform, token, playlistID)
                .then((playlistResponse) => {
                    handleSetPlaylist({ 
                        playlistName: playlistResponse.name,
                        username: playlistResponse.owner.display_name,
                        id: playlistID,
                        tracks: [...playlistResponse.tracks.items],
                        image: playlistResponse.images[0].url
                     });
                });
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
  
      }, [sourcePlatform, playlistID]);
      

    return(
        <div>

            {/* SoundCloud Widget API */}
            { foundPlaylist === false && sourcePlatform === "soundcloud" &&
                <iframe ref={iframeRef} className="sc-widget" id="SCwidget" width="0px" height="500%" allow="autoplay" style={{position:"absolute", left:"0", top:"0", fontSize:"40"}}
                        src={`https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${playlistID}/&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`} /> 
           }


           { foundPlaylist === true &&
            <div>
                <img id="playlistImage" src={playlist.image}/>
                <h2>{playlist.playlistName}</h2>
                <div id="playlistInfo">
                    <p>{playlist.tracks.length} songs | {playlist.length}</p>
                </div>
                <div className="tracklistDisplay">
                    {playlist.tracks.map((song, index) => {
                        return <div className="songDisplay" key={index}>
                        <img src={song.image}/>
                        <div className="songInfo" style={{marginLeft:"5%"}}>
                            <h5>{sharedService.truncateString(song.name, 26)}</h5>
                            <p>{sharedService.truncateString(song.artists, 45)}</p>
                        </div>
                        </div>
                    })}
                </div>
            </div> }

        </div>
    );
};

export default PlaylistDetails;
