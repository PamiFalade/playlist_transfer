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

/// Extracts the song's title, image, artist(s), and length, and checks if it is explicit from
/// the tracklist that comes in the SoundCloud playlist object
export const extractSongInfo = async (playlist) => {
    let formattedSongArray = [];
    let totalDuration = 0;  // The total run time of the playlist 

    // for(let i=0; i<playlist?.tracks.length; i++){
    //     let songISRC = await findISRC(playlist.tracks[i]);  // Fetch the ISRC of the song
    //     totalDuration += playlist.tracks[i].duration;

    //     formattedSongArray.push({
    //         name: extractSongTitle(playlist.tracks[i].title),
    //         album: playlist.tracks[i].publisher_metadata.album_title,
    //         image: playlist.tracks[i].artwork_url,
    //         artists: playlist.tracks[i].publisher_metadata.artist,
    //         length_ms: playlist.tracks[i].duration,
    //         length: sharedService.millisToHoursMinutesAndSeconds(playlist.tracks[i].duration),
    //         isExplicit: playlist.tracks[i].publisher_metadata.explicit,
    //         release_date: playlist.tracks[i].display_date.slice(0,10),
    //         type: playlist.tracks[i].kind,
    //         isrc: songISRC
    //     });
    // }
    
    playlist.tracks.forEach(song => {
        totalDuration += song.duration;
        formattedSongArray.push({
            name: extractSongTitle(song.title),
            album: song.publisher_metadata.album_title,
            image: song.artwork_url,
            artists: song.publisher_metadata.artist,
            length_ms: song.duration,
            length: sharedService.millisToHoursMinutesAndSeconds(song.duration),
            isExplicit: song.publisher_metadata.explicit,
            release_date: song.display_date.slice(0,10),
            type: song.kind,
            isrc: findISRC(song)
        });
    });

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
        let mbArtistName = "";
        if(musicBrainzArtists[i].joinphrase) {
            mbArtistName = musicBrainzArtists[i].joinphrase.concat(musicBrainzArtists[i].name);
        }
        else {
            mbArtistName = musicBrainzArtists[i].name;
        }
        if(songArtists.includes(mbArtistName) == false){
            match = false;
        }
    }
    return match;
}

/// SUMMARY: Find a song's ISRC by querying the MusicBrainz API.
/// DETAILS: An ISRC is a song's unique code. This can be used to easily search the song up on destination platforms.
const findISRC = async (song) => {
    let songISRC = "Uhoh";  // The ISRC of the song

    let songName = sharedService.extractSongName(song.title);
    let artist = song.publisher_metadata.artist;
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
        let isrc = "WORKING?";
        // Iterate through the search results from the MusicBrainz API to find the right recording
        for(let i=0; i<isrcRes.recordings.length; i++){
            let artistsCheck = compareArtistListsMusicBrainz(song.publisher_metadata.artist, isrcRes.recordings[i]["artist-credit"]);
            if(artistsCheck || song.title.includes(isrcRes.recordings[i].title) ){
                isrc = isrcRes.recordings[i].isrcs[0];
                break;
            }
        }
        
        return isrc;
    });

    console.log(song.title + ": " + isrcResponse);
    return isrcResponse;
};