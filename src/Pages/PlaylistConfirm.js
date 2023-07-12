


const PlaylistConfirm = () => {

    const playlistName = "Elements";
    const noSongs = 13;
    const lenMinutes = 55;

    return(
        <div id="playlistSummary">
            <img id="playlistImage" src="https://upload.wikimedia.org/wikipedia/en/c/c2/Wizkid_-_Made_in_Lagos.png"/>
            <div id="playlistInfo">
                <p>{noSongs} songs | {lenMinutes} minutes</p>
            </div>
        </div>
    );
}

export default PlaylistConfirm;