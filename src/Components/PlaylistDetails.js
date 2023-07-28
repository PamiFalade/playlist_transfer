import { React, useState, useEffect, createRef } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import loadscript from "load-script";



const PlaylistDetails = () => {
 
    /// The playlist that will be transferred
    const [playlist, setPlaylist] = useState({
        playlistName: "",
        username: "",
        email: "",
        id: "",
        tracks: [],
        img: ""
    });

    /// Boolean that indicates if the playlist was found
    const [foundPlaylist, setFoundPlaylist] = useState(false);

    const handleSetPlaylist = (retrievedPlaylist) => {
        setPlaylist(retrievedPlaylist);
        setFoundPlaylist(true);
     };

    // The tracklist that will be populated once the playlist has been fetcheds
    const [trackList, setTrackList] = useState();
    const handleAddTracklist = (newTrackList) => {
        setTrackList(newTrackList);
        console.log(trackList);
    };

    let playlistSongs;

    // Get the playlist's source platform and ID from the URL parameters
    const { id } = useParams(); 
    const sourcePlatform = id.substring(0, id.indexOf('-'));
    const playlistID = id.substring(id.indexOf('-') + 1);


     /// The share link to the playlist that will be transferred
     const [playlistLink, setPlaylistLink] = useState("");
     const handlePlaylistLink = (event) => {
         setPlaylistLink(event.target.value);
     };
 
     /// The music streaming platform that the playlist will be transferred from
     const [source, setSource] = useState("");
     const handleSource = (link) => {
         if (link.startsWith("https://open.spotify.com/playlist/")){
         setSource("spotify");
         }
         else if (link.startsWith("https://music.apple.com/ca/playlist/")){
         //May need to change this because of the 'ca'
         setSource("apple");
         }
         else if(link.startsWith("https://soundcloud.com/")){
         setSource("soundcloud");
         }
     };

    
     /// Dummy data
     const playlistName = "Made in Lagos";
     const noSongs = 13;
     const lenMinutes = 55;
 
     /// Helper function to truncate strings so that they fit in the display
      const truncateString = (string, num) => {
         var truncated = "";
         if(string.length > num)
         {
             truncated = string.slice(0, num);
             truncated = truncated.trimEnd() + "...";
         }
         else 
         {
             truncated = string;
         }
         return truncated;
      };

      /// SoundCloud Widget player stuff
      const [scPlayer, setSCPlayer] = useState(false);

      const iframeRef = createRef();

      /// Load the SoundCloud Widget API
      useEffect(() => {
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
                              playlistSongs = [...songList];
                              let retrievedPlaylist = {
                                playlistName: "name",
                                username: "user",
                                email: "user@email.com",
                                id: playlistID,
                                tracks: [...songList],
                                img: "image"
                              }
                              handleSetPlaylist(retrievedPlaylist);
                              console.log(songList);
                          }
                      });
                  }
                  tryGetSounds();
              });
          });
  
      }, []);
 
     const songs = [
         {
             songID: 1,
             songName: "Reckless",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 2,
             songName: "Ginger (feat. Burna Boy)",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 3,
             songName: "Longtime (feat. Skepta)",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 4,
             songName: "Mighty Wine",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 5,
             songName: "Blessed (feat. Damian \"Jr.Gong \" Marley)",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 6,
             songName: "Smile (feat. H.E.R.)",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 7,
             songName: "Piece of Me (feat. Ella Mai)",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 8,
             songName: "No Stress",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 9,
             songName: "True Love (feat. Tay Iwar & Projexx)",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 10,
             songName: "No Sweet One",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 11,
             songName: "Essence (feat. Tems)",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 12,
             songName: "Roma (feat. Terri)",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 13,
             songName: "Gyrate",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
         {
             songID: 14,
             songName: "Grace",
             songArtist: "Wizkid",
             songLength: "3:53",
             songImage: "https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"
         },
     ];
 
    
    return(
        <div>
            { sourcePlatform === "soundcloud" &&
                <iframe ref={iframeRef} className="sc-widget" id="SCwidget" width="0px" height="1000vh" allow="autoplay" style={{position:"absolute", left:"0", top:"0", fontSize:"40"}}
                        src={`https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${playlistID}/&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`} /> 
           }
          { foundPlaylist === true && <div>
                <img id="playlistImage" src="https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"/>
                <h2>{playlist.playlistName}</h2>
                <p>{songs.length} songs | {lenMinutes} minutes</p>
                <div className="tracklistDisplay">
                    {songs?.map((song, index) => {
                        return <div className="songDisplay" key={index}>
                        <img src={song.songImage}/>
                        <div className="songInfo" style={{marginLeft:"5%"}}>
                            <h5>{truncateString(song.songName, 26)}</h5>
                            <p>{truncateString(song.songArtist, 45)}</p>
                        </div>
                        </div>
                    })}
                </div>
            </div> }
        </div>
    );
};

export default PlaylistDetails;

