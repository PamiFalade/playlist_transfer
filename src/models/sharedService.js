/// Image to use if a song does not have an image
export const missingTrackImg = "https://static.vecteezy.com/system/resources/previews/019/861/738/original/music-note-in-doodle-style-illustration-sound-icon-for-print-and-design-melody-symbol-for-study-and-quiz-game-isolated-element-on-black-background-music-note-sign-hand-drawn-vector.jpg"


/// Helper function to extract just the name of the song from the song title
/// DETAILS: Some song titles include the names of the featured artists on some platforms, and exclude it in others. This function removes that part so that the search results can be more accurate 
export const extractSongName = (fullSongTitle) => {
    let featRegex = new RegExp("\(feat\. .+\)");  // Used to represent the part of the title where the artists' names are mentioned
    let newEndIndex = fullSongTitle.search(featRegex);  // Find where the artists' names are mentioned in the song title

    let songName;

    if(newEndIndex >= 0) {
        songName = fullSongTitle.slice(0, newEndIndex-2);
    }
    else {
        songName = fullSongTitle;
    }
    
    return songName; // Return the song title without the artists' names in it
}

/// Truncates strings so that they fit in the display
export const truncateString = (string, num) => {
    var truncated = "";
    if(string === undefined){
       return "";
    }
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


/// Used to convert milliseconds to hours, minutes, and seconds
/// Song lengths are in milliseconds in the API responses
/// If a song is less than one hour, then it returns minutes + seconds
/// Else, it returns hours + minutes
export const millisToHoursMinutesAndSeconds = (milliseconds) => {
    var seconds = Math.floor((milliseconds / 1000) % 60),
    minutes = Math.floor((milliseconds / (1000 * 60)) % 60),
    hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    if (hours < 1) {
        return `${minutes} min ${seconds} sec`;
    }
    else {
        return `${hours} hr ${minutes} min`
    }

}