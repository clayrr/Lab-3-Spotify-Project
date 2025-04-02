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

//stuff that might not work
const _getTracks = async (token, tracksEndPoint) => {

  const limit = 10;

  const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
  });

  const data = await result.json();
  return data.items;
}

//refresh access token draft
const refreshAccessToken = async () => {
  if (!refresh_token) {
    console.error("no refresh token available.");
    return;
  }

  console.log("refreshing access token...");
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(client_id + ':' + client_secret).toString('base64')}`
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    })
  });

  const data = await response.json();

  if (data.access_token) {
    access_token = data.access_token;
    console.log('hiii this is your new access token: ', access_token);
  } else {
    console.error('your token did not refresh. better luck next time :)', data);
  }
};

app.listen(8888, () => console.log('Listening on http://localhost:8888'));

