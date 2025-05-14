import express from 'express';
const app = express();

import fetch from 'node-fetch';
import querystring from 'querystring';
import * as dotenv from 'dotenv';
dotenv.config();


const client_id =  process.env.SPOTIFY_CLIENT_ID;
const client_secret =  process.env.SPOTIFY_CLIENT_SECRET;
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
// In your /callback handler:
app.get('/callback', async (req, res) => {
  const { code } = req.query; // Authorization code

  // Authorization code exchange for access and refresh tokens
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
  const { access_token, refresh_token } = tokenData;

  // Fetch user info
  const userResponse = await fetch('https://api.spotify.com/v1/me', {
    headers: { 'Authorization': `Bearer ${access_token}` }
  });

  const userData = await userResponse.json();
  console.log('User data:', userData);

  res.json(userData);
});

app.listen(8888, () => console.log('Listening on http://localhost:8888/login'));
app.get('/top-tracks', async (req, res) => {
  const { access_token } = req.query;

  const topTracks = await getTopTracks(access_token);

  res.json({
    topTracks: topTracks.map(track => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url
    }))
  });
});
async function getTopTracks(access_token) {
  const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=5', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
  const data = await response.json();
  return data.items; // Return the array of top tracks
}
