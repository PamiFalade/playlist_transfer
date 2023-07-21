const regexPattern = ".*(?=\\?si)";


/// Used to extract the playlist ID from the SoundCloud share link
export const extractPlaylistID = (link) => {
    console.log("here");
    const regex = new RegExp(regexPattern);
    return link.match(regex)[0].replace("https://soundcloud.com/", "");
};