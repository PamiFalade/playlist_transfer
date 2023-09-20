/// Image to use if a song does not have an image
export const missingTrackImg = "https://static.vecteezy.com/system/resources/previews/019/861/738/original/music-note-in-doodle-style-illustration-sound-icon-for-print-and-design-melody-symbol-for-study-and-quiz-game-isolated-element-on-black-background-music-note-sign-hand-drawn-vector.jpg"

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