const clientID = "9a5c9f439d464286b0b08e0f40de4f4a";
const secret = "c24f98c34e26485db177b530895c1769";
const regex = "(?<=t/)(.*?)(?=\\?)";

export const fetchSpotifyToken = (searchData) => {
  let stringToEncode = `${searchData.clientID}:${searchData.secret}`; //Encoded client ID and secret needed to get access token
  let token; //Variable that will hold the promise returned by the fetch function

  //Headers and body set up according to how Spotify requires it (https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/)
  let tokenResponse = fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(stringToEncode).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  })
    .then((tokenResponse) => {
      if (tokenResponse.ok) console.log("Successful");
      else console.log("Not successful");
      return tokenResponse.json();
    })
    .catch((error) => {
      console.log(error);
    });

  return tokenResponse; //Return the promise that the fetch function returns
};


