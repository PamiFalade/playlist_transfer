import * as sharedService from "../sharedService";

const regexPattern = ".*(?=\\?si)";


/// Used to extract the playlist ID from the SoundCloud share link
export const extractPlaylistID = (link) => {
    const regex = new RegExp(regexPattern);
    return link.match(regex)[0].replace("https://soundcloud.com/", "");
};

/// Used to extract the song's title from the published title
/// SoundCloud publishes the artists' names before the song's name as part 
/// of the song's title, so this is to get just the song's name
export const extractSongTitle = (title) => {
    if(title != undefined){
        return title.substring(title.indexOf('-') + 1);
    }
} 

/// Extracts the song's title, image, artist(s), and length, and checks if it is explicit from
/// the tracklist that comes in the SoundCloud playlist object
export const extractSongInfo = (playlist) => {
    let formattedSongArray = [];
    let totalDuration = 0;  // The total run time of the playlist 

    playlist.tracks.forEach(song => {
        totalDuration += song.duration;
        formattedSongArray.push({
            name: extractSongTitle(song.title),
            image: song.artwork_url,
            artists: song.publisher_metadata.artist,
            length: sharedService.millisToHoursMinutesAndSeconds(song.duration),
            isExplicit: song.publisher_metadata.explicit
        });
    });

    playlist.tracks = [...formattedSongArray];
    playlist.length = sharedService.millisToHoursMinutesAndSeconds(totalDuration);
    return playlist;
};