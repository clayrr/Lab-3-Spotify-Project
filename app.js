// Authorization - work in progress

const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');
require("dotenv").config();

// paste client info here
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
console.log("client_id is: ", client_id);
const redirect_uri = 'http://localhost:8888/callback';

const app = express();

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
});

// TBD: refresh token after expiration

app.listen(8888, () => console.log('Listening on http://localhost:8888'));

