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
export const extractSongInfo = (playlist) => {
    let formattedSongArray = [];
    let totalDuration = 0;  // The total run time of the playlist 

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
    return playlist;
};

/// SUMMARY: Find a song's ISRC by querying the MusicBrainz API.
/// DETAILS: An ISRC is a song's unique code. This can be used to easily search the song up on destination platforms.
const findISRC = async (song) => {
    let songISRC = "";  // The ISRC of the song

    let songName = sharedService.extractSongName(song.title);
    let artist = song.publisher_metadata.artist;
    let queryString = `?query=recording:${encodeURIComponent(songName)}%20and%20artist:${encodeURIComponent(artist)}&fmt=json&inc=isrcs`;
    let isrcResponse = await fetch(`https://musicbrainz.org/ws/2/recording/${queryString}`, {
        method: 'GET',
    }).then(response => {
        if(response.ok) {
            console.log("Successfully queried MusicBrainz API! " + queryString);
        }
        else { 
            console.log("Error with querying MusicBrainz API...")
        }
        return response.json();
    });
    console.log(song);
    console.log(isrcResponse);

    for(let i=0; i<isrcResponse.recordings.length; i++){

        // Put all the artists' names in one string so that it's easy to compare
        let recordingArtists = "";
        isrcResponse.recordings[i]["artist-credit"].forEach(artist => {   // Since the artist-credit field in the recording object has a "-" in the name, we have to access it with the [] and the string version of its name
            if(recordingArtists === "") {               // In JavaScript, any field you can access using the . operator, you can access using [] with a string version of the field name.
                recordingArtists += artist.name;
            }
            else {
                recordingArtists += `, ${artist.name}`;
            }
        });

        // Find the right ISRC
        if(song.artists === recordingArtists && song.release_date === isrcResponse.recordings[i]["first-release-date"]) {
            if(isrcResponse.recordings.isrcs) {
                songISRC = isrcResponse.recordings.isrcs[0];
                break;
            }
            else {
                songISRC = "";
                break;
            }
        }
    };

    console.log(songISRC);
    return songISRC;
};