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
        return title.substring(title.indexOf('-') + 1).trim();
    }
} 

/// SUMMARY: Helper function to make sure that the song object has no undefined values
/// DETAILS: Takes the song object and a value that is specified when the function is called as arguments. Sets any keys that are "undefined" to that value.
let setUndefinedKeys = (song, val) => Object.keys(song).forEach(k => song[k] === undefined ? song[k] = val : song[k]);

/// Extracts the song's title, image, artist(s), and length, and checks if it is explicit from
/// the tracklist that comes in the SoundCloud playlist object
export const extractSongInfo = async (playlist) => {
    let formattedSongArray = [];
    let totalDuration = 0;  // The total run time of the playlist 
    let songToAdd = {};     // The song object that will be added to the formattedSongArray
    
    for(let i=0; i<playlist.tracks.length; i++){
        totalDuration += playlist.tracks[i].duration;
        songToAdd = {
            name: extractSongTitle(playlist.tracks[i].title),
            album: playlist.tracks[i].publisher_metadata.album_title,
            image: playlist.tracks[i].artwork_url,
            artists: playlist.tracks[i].publisher_metadata.artist,
            length_ms: playlist.tracks[i].duration,
            length: sharedService.millisToHoursMinutesAndSeconds(playlist.tracks[i].duration),
            isExplicit: playlist.tracks[i].publisher_metadata.explicit,
            release_date: playlist.tracks[i].display_date.slice(0,10),
            type: playlist.tracks[i].kind,
        };

        // Set any values that are "undefined" to an empty string
        setUndefinedKeys(songToAdd, "");
        
        songToAdd.isrc = await findISRC(songToAdd);

        formattedSongArray.push(songToAdd);
    }

    playlist.tracks = [...formattedSongArray];
    playlist.length = sharedService.millisToHoursMinutesAndSeconds(totalDuration);
    console.log(playlist);
    return playlist;
};

/// SUMMARY: Helper function to check that the list of credited artists on MusicBrainz are in the title of the track from SoundCloud
/// DETAILS: MusicBrainz stores an array of objects, each of which contain the artist's name and the join phrase (feat., or &).
///          Sometimes, SoundCloud does not have the names of all the artists that were involved in its publisher_metadata field.
///          In these instances, this function is used to check if the list of artist objects are in the SoundCloud track title.
const compareArtistToSongTitleMusicBrainz = (song, musicBrainzArtists) => {
    let mbArtistList = ""; // Artist list from MusicBrainz
    let soundcloudTrackTitle = song.publisher_metadata.title;   // The track's title on SoundCloud
    let soundcloudArtist = song.publisher_metadata.artist;      // The track's artist on SoundCloud
    let titleArtistList = soundcloudTrackTitle.slice(soundcloudTrackTitle.indexOf("-"));    // Extract the 
    let match = true;
    for(let i=0; i<musicBrainzArtists.length; i++){
        let artist = musicBrainzArtists[i].joinphrase.concat(musicBrainzArtists[i].name);
        mbArtistList += artist;
        if(soundcloudTrackTitle.includes(artist)){
            match = false;
        }
    }
    
    // Artist list from MusicBrainz can have artists in the wrong order, so compare their lengths
    if(mbArtistList.trim().length === titleArtistList.trim().length)
    return match;
}

/// SUMMARY: Helper function to check that the list of credited artists match on both platforms.
/// DETAILS: MusicBrainz stores an array of objects, each of which contain the artist's name and the join phrase (feat., or &).
///          Check if the list of artist objects match with the artist that is credited from SoundCloud's API.
const compareArtistListsMusicBrainz = (songArtists, musicBrainzArtists) => {
    let match = true;
    for(let i=0; i<musicBrainzArtists.length; i++){
        let mbArtistName = musicBrainzArtists[i].name;
        if(songArtists.includes(mbArtistName) == false){
            match = false;
        }
    }
    return match;
}

/// SUMMARY: Find a song's ISRC by querying the MusicBrainz API.
/// DETAILS: An ISRC is a song's unique code. This can be used to easily search the song up on destination platforms.
const findISRC = async (song) => {

    let songName = sharedService.extractSongName(song.name);
    let artist = song.artists;
    let queryString = `?query=recording:${encodeURIComponent(songName)}%20artist:${encodeURIComponent(artist)}&fmt=json&inc=isrcs`;
    
    // The ISRC of the song
    let isrcResponse = await fetch(`https://musicbrainz.org/ws/2/recording/${queryString}`, {
        method: 'GET',
    }).then(response => {
        if(response.ok) {
            console.log("Successfully queried MusicBrainz API! ");
        }
        else { 
            console.log("Error with querying MusicBrainz API...");
        }
        return response.json();
    }).then(isrcRes => {
        if(song.name === "Smells Like Teen Spirit"){
            console.log(isrcRes);
        }
        let isrc = "";
        try {
            for(let i=0; i<isrcRes.recordings.length; i++){
                if(isrcRes.recordings[i].isrcs === undefined) {
                    continue;
                }
                else {
                    isrc = isrcRes.recordings[i].isrcs.slice(-1)[0];
                    break;
                }
            }
        }
        catch(error) {
            console.error(song.name + ": " + error);
        }

        return isrc;
    });

    return isrcResponse;
};