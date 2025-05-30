import express from 'express';
import cors from 'cors';
const app = express();

import fetch from 'node-fetch';
import querystring from 'querystring';
import * as dotenv from 'dotenv';
dotenv.config();

// allow frontend origin to call backend
app.use(cors({
  origin: 'http://localhost:5173',
}));

//variables for Spotify
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://localhost:8888/callback';

// Spotify login endpoint
app.get('/login', (req, res) => {
  const authUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: 'user-read-private user-read-email user-top-read',
    redirect_uri: redirect_uri,
  });

  res.redirect(authUrl);
});

//callback endpoint, gets access token 
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code');
  }

  try {
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

    if (!tokenResponse.ok) {
      //error message
      const errorText = await tokenResponse.text();
      console.error('Token fetch failed:', errorText);
      return res.status(500).send('Failed to fetch access token');
    }

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;


    if (!access_token) {
      return res.status(500).send('No access token received');
    }

    res.redirect(`http://localhost:5173/#access_token=${access_token}`);

  } catch (err) {
    //error message
    console.error('Callback error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// start the server
app.listen(8888, () => console.log('Listening on http://localhost:8888/login'));

// bubbletea endpoint - suggests bubble tea based on top artists
app.get('/bubbletea', async (req, res) => {
  const access_token = req.query.access_token;
  if (!access_token) {
    //error message
    return res.status(400).json({ error: 'missing access token' });
  }

  try {
    // fetch top artists from Spotify
    const response = await fetch(
      'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!response.ok) {
      // error message
      const errorText = await response.text();
      console.error('spotify artist request failed:', errorText);
      return res.status(500).json({ error: 'failed to fetch top artists from Spotify' });
    }

    const data = await response.json();
    const artists = (data.items || []).map(artist => ({
      name: artist.name,
      popularity: artist.popularity
    }));

    // uses popularity to suggest bubble tea
    function suggestBobaTea(artists) {
      if (!artists.length) return 'classic milk tea';
      const avgPopularity = artists.reduce((sum, artist) => sum + artist.popularity, 0) / artists.length;
      if (avgPopularity > 80) return 'thai tea with boba';
      if (avgPopularity > 60) return 'brown sugar milk tea';
      if (avgPopularity > 40) return 'jasmine green milk tea';
      return 'oolong milk tea with grass jelly';
    }

    const drinkRecommendation = suggestBobaTea(artists);

    res.json({
      message: `based on your top artists, we suggest you try ${drinkRecommendation}! enjoy! 🧋🧋🧋🧋🧋`
    });
  } catch (err) {
    // error message
    console.error('Error in /bubbletea:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// energy endpoint
app.get('/track-energy', async (req, res) => {
  const access_token = req.query.access_token;
  if (!access_token) return res.status(400).json({ error: 'Missing access token' });

  const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term', {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  const data = await response.json();

  // average popularity (0-100)
  const avgPopularity = data.items.reduce((sum, artist) => sum + artist.popularity, 0) / data.items.length;

  let energyLabel = '';
  if (avgPopularity < 30) energyLabel = 'low energy. drink some red bull';
  else if (avgPopularity < 60) energyLabel = 'moderate energy. tew calm';
  else energyLabel = 'high energy. sugar rush core';

  res.json({ message: `based on your top artists, your music energy is: ${energyLabel}.` });
});

// season endpoint
app.get('/season', async (req, res) => {
  const access_token = req.query.access_token;
  // error message
  if (!access_token) return res.status(400).json({ error: 'missing access token' });

  const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term', {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  const data = await response.json();

  //  genres that might hint at seasons, super simple example:
  let winterGenres = 0;
  let summerGenres = 0;
  let fallGenres = 0;
  let springGenres = 0; 

  data.items.forEach(artist => {
    const genres = artist.genres.join(' ').toLowerCase();

    if (genres.includes('ambient') || genres.includes('classical') || genres.includes('chill')) winterGenres++;
    if (genres.includes('pop') || genres.includes('dance') || genres.includes('electronic')) summerGenres++;
    if (genres.includes('r&b') || genres.includes('jazz') || genres.includes('bossa nova')) fallGenres++;
    if (genres.includes('lo-fi') || genres.includes('soundtrack') || genres.includes('indie')) springGenres++;
  });

  let seasonMsg = '';
  if (winterGenres > summerGenres && winterGenres > fallGenres && winterGenres > springGenres) seasonMsg = 'your music vibe is like winter: you are cold and heartless like the arctic tundra.';
  else if (summerGenres > winterGenres && summerGenres > springGenres && summerGenres > fallGenres) seasonMsg = 'your music vibe is like summer: if overheating and fainting was a person, it would be you.';
  else if (fallGenres > summerGenres && fallGenres > winterGenres && fallGenres > springGenres) seasonMsg = 'your music vibe is like fall: you take too much pride in your pumpkin spice latte addiction. get a life.';
  else if (springGenres > summerGenres && springGenres > fallGenres && springGenres > summerGenres) seasonMsg = 'your music vibe is like spring: uncomfortable. it is giving allergies.';
  else seasonMsg = 'your music vibe is balanced. you are too in-the-middle to be anything. #notliketheothergirls';

  res.json({ message: `based on your top artists, ${seasonMsg}` });
});

