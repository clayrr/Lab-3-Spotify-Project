import express from 'express';
const app = express();

import fetch from 'node-fetch';
import querystring from 'querystring';
import * as dotenv from 'dotenv';
dotenv.config();

// paste client info here
const client_id = "";
// process.env.SPOTIFY_CLIENT_ID;
const client_secret = "";
// process.env.SPOTIFY_CLIENT_SECRET;
console.log("client_id is: ", client_id);
const redirect_uri = 'http://localhost:8888/callback';

// Direct to Spotify login page
app.get('/login', (req, res) => {
  const authUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: 'user-read-private user-read-email',
    redirect_uri: redirect_uri,
  });

  res.redirect(authUrl);
});

// Spotify redirection
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  res.redirect(`http://localhost:5173?access_token=${access_token}`);
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(client_id + ':' + client_secret).toString('base64')}`
    },
    body: querystring.stringify({
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    })
  });

  const tokenData = await tokenResponse.json();
  const { access_token } = tokenData;

  // Fetch user profile
  const userResponse = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  const userData = await userResponse.json();

  // Fetch top tracks
  const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=5', {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  const tracksData = await tracksResponse.json();

  res.json({
    user: userData,
    tracks: tracksData.items,
  });
});

//BOBATEA.JS

//  artist data; simulated numbers
const artists = [
  { name: "Artist 1", popularity: 15 },
  { name: "Artist 2", popularity: 34 },
  { name: "Artist 3", popularity: 51 },
  { name: "Artist 4", popularity: 73 },
  { name: "Artist 5", popularity: 6 },
  { name: "Artist 6", popularity: 101 },
  { name: "Artist 7", popularity: 2 },
  { name: "Artist 8", popularity: 22 },
  { name: "Artist 9", popularity: 15 },
  { name: "Artist 10", popularity: 78 },
  { name: "Artist 11", popularity: 3 },
];

// tea options 
const teas = {
  leastBasic: ["Red Velvet Tea", "Toffee Tea"],
  slightlyBasic: ["Mango Green Foam Tea", "Cheese Foam Tea"],
  moreBasic: ["Matcha Latte", "Taro Milk Tea"],
  mostBasic: ["Brown Sugar Milk Tea", "Classic Milk Tea"],
};

// function to determine the tea recommendation 
function suggestBobaTea(artists) {
  // sort artists by monthly listeners (descending order)
  const topArtists = artists.sort((a, b) => b.popularity - a.popularity).slice(0, 10);

  // calculate the total popularity score based on listening count ranges
  let score = 0;

  // categorize each artist by their listening count and assign a "popularity score"
  topArtists.forEach((artist) => {
    if (artist.popularity <= 20) {
      score += 0;  // least basic
    } else if (artist.popularity <= 40) {
      score += 1;  // a bit basic
    } else if (artist.popularity <= 60) {
      score += 2;  // more basic
    } else if (artist.popularity <= 80) {
      score += 3;  // more basic
    } else {
      score += 4;  // most basic
    }
  });

  // average score (based on top 10 artists)
  const averagePopularity = score / topArtists.length;

  // suggest tea based on average popularity score
  if (averagePopularity <= 1) {  // least basic 
    return teas.leastBasic[Math.floor(Math.random() * teas.leastBasic.length)];
  } else if (averagePopularity <= 2) {  // a bit basic
    return teas.slightlyBasic[Math.floor(Math.random() * teas.slightlyBasic.length)];
  } else if (averagePopularity <= 3) {  // more basic
    return teas.moreBasic[Math.floor(Math.random() * teas.moreBasic.length)];
  } else {  // most basic
    return teas.mostBasic[Math.floor(Math.random() * teas.mostBasic.length)];
  }
}

// bubble tea endpoint
app.get('/bubbletea', (req, res) => {
  const drinkRecommendation = suggestBobaTea(artists);

  res.json({
    message: `Based on your top artists, we suggest you try ${drinkRecommendation}! Enjoy! 🧋`
  });
});

//AUDIO.JS
const energy = 0.5;

function matchEnergyLevel(energy) {
  if (energy < 0.25) {
    return 'Low energy)';
  } else if (energy < 0.5) {
    return 'Moderately low energy)';
  } else if (energy < 0.75) {
    return 'Moderate energy)';
  } else {
    return 'High energy)';
  }
}

// endpoint
app.get('/track-energy', (req, res) => {
  const energyLevel = matchEnergyLevel(energy);

  res.json({
    message: `Based on your music taste, we have concluded that you have ${energyLevel}.`
  });
});

//SEASONS.JS

// simulated value for demonstration
const danceability = 0.79;

// helper function to classify danceability into seasons with descriptive messages
function matchDanceabilityToSeason(danceability) {
  if (danceability < 0.25) {
    return 'your music vibe is like winter: calm, and introspective. You are like a cup of hot chocolate on a snow day';
  } else if (danceability < 0.5) {
    return 'your music vibe is like autumn: mellow and reflective. You are like drinking a cup of hot apple cider in a pumpkin patch';
  } else if (danceability < 0.75) {
    return 'your music vibe is like spring: fresh and lively. You are like drinking herbal tea in a meadow';
  } else {
    return 'your music vibe is like summer: vibrant and energetic. You are like drinking lemonade by the pool';
  }
}

// danceability to season endpoint
app.get('/season', (req, res) => {
  const seasonMessage = matchDanceabilityToSeason(danceability);

  res.json({
    message: `Based on your music taste, ${seasonMessage}`
  });
});

