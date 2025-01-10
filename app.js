const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const Buffer = require('buffer').Buffer; 

const app = express();
let previousState = null; 

const client_id = 'ba88f3191dc94daea8320aa3e0ee3f4c';
const client_secret = '467deef8549046e584bfc02542552aa4';
const redirect_uri = 'http://localhost:3000/callback/'; // must match web app

// Random string generator mandated security function
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// User authorization 
app.get('/login', (req, res) => {
    previousState = generateRandomString(16);  
    const scope = 'app-remote-control';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: encodeURIComponent(redirect_uri),
        state: previousState
      }));
});

// Retrieve token

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
  
    // Security 
    if (state === null || state !== previousState) {
      res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
      return;
    }
  
    if (!code) {
      return res.redirect('/#' + querystring.stringify({ error: 'invalid_code' }));
    }

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        data: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        },
    };

    try {
        const response = await axios(authOptions);
        console.log(response.data);
    } catch (error) {
        console.error('Error exchanging code for token:', error.response ? error.response.data : error.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
