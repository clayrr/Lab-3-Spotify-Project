import express from 'express';
const app = express();

import fetch from 'node-fetch';
import querystring from 'querystring';
import * as dotenv from 'dotenv';
dotenv.config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
console.log("client_id is: ", client_id);
const redirect_uri = 'http://localhost:8888/callback';

app.get('/login', (req, res) => {
  const authUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: 'user-read-private user-read-email user-top-read',
    redirect_uri: redirect_uri,
  });

  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

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

  console.log('Access token:', access_token);

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
  return data.items;
}

async function getTopArtists(access_token) {
  const r = await fetch(
    'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10',
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const json = await r.json();
  return json.items;
}

async function getAudioFeatures(access_token, ids) {
  const r = await fetch(
    `https://api.spotify.com/v1/audio-features?ids=${ids.join(',')}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const json = await r.json();
  return json.audio_features;
}

async function getTopTracksWithFeatures(access_token) {
  const top = await getTopTracks(access_token);
  const ids = top.map(t => t.id);
  const feats = await getAudioFeatures(access_token, ids);
  return feats;
}

function suggestBobaTea(artists) {
  if (!artists.length) return 'classic milk tea';

  const avgPopularity = artists.reduce((sum, artist) => sum + artist.popularity, 0) / artists.length;

  if (avgPopularity > 80) return 'Thai tea with boba';
  if (avgPopularity > 60) return 'brown sugar milk tea';
  if (avgPopularity > 40) return 'jasmine green milk tea';
  return 'oolong milk tea with grass jelly';
}

// --- /bubbletea endpoint ---
app.get('/bubbletea', async (req, res) => {
  const access_token = req.query.access_token;
  if (!access_token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const response = await fetch(
      'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify artist request failed:', errorText);
      return res.status(500).json({ error: 'Failed to fetch top artists from Spotify' });
    }

    const data = await response.json();
    const artists = (data.items || []).map(artist => ({
      name: artist.name,
      popularity: artist.popularity
    }));

    function suggestBobaTea(artists) {
      if (!artists.length) return 'classic milk tea';
      const avgPopularity = artists.reduce((sum, artist) => sum + artist.popularity, 0) / artists.length;
      if (avgPopularity > 80) return 'Thai tea with boba';
      if (avgPopularity > 60) return 'brown sugar milk tea';
      if (avgPopularity > 40) return 'jasmine green milk tea';
      return 'oolong milk tea with grass jelly';
    }

    const drinkRecommendation = suggestBobaTea(artists);

    res.json({
      message: `Based on your top artists, we suggest you try ${drinkRecommendation}! Enjoy! 🧋`
    });
  } catch (err) {
    console.error('Error in /bubbletea:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- /track-energy endpoint ---
app.get('/track-energy', async (req, res) => {
  const access_token = req.query.access_token;
  if (!access_token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const topTracksResponse = await fetch(
      'https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=medium_term',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!topTracksResponse.ok) {
      const errorText = await topTracksResponse.text();
      console.error('Spotify tracks request failed:', errorText);
      return res.status(500).json({ error: 'Failed to fetch top tracks' });
    }

    const topTracksData = await topTracksResponse.json();
    const trackIds = (topTracksData.items || []).map(track => track.id);

    if (!trackIds.length) {
      return res.status(200).json({ message: 'No top tracks found.' });
    }

    const audioFeaturesResponse = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!audioFeaturesResponse.ok) {
      const errorText = await audioFeaturesResponse.text();
      console.error('Spotify audio features request failed:', errorText);
      return res.status(500).json({ error: 'Failed to fetch audio features' });
    }

    const audioData = await audioFeaturesResponse.json();
    const energies = (audioData.audio_features || [])
      .filter(f => f && typeof f.energy === 'number')
      .map(f => f.energy);

    if (!energies.length) {
      return res.status(200).json({ message: 'No audio features found for your top tracks.' });
    }

    const averageEnergy = energies.reduce((a, b) => a + b, 0) / energies.length;
    let energyLabel;
    if (averageEnergy < 0.25) {
      energyLabel = 'Low energy';
    } else if (averageEnergy < 0.5) {
      energyLabel = 'Moderately low energy';
    } else if (averageEnergy < 0.75) {
      energyLabel = 'Moderate energy';
    } else {
      energyLabel = 'High energy';
    }

    res.json({
      message: `Based on your music taste, you have ${energyLabel}.`
    });
  } catch (err) {
    console.error('Error in /track-energy:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- /season endpoint ---
app.get('/season', async (req, res) => {
  const access_token = req.query.access_token;
  if (!access_token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const topTracksResponse = await fetch(
      'https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=medium_term',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!topTracksResponse.ok) {
      const errorText = await topTracksResponse.text();
      console.error('Spotify top tracks failed:', errorText);
      return res.status(500).json({ error: 'Failed to fetch top tracks' });
    }

    const topTracksData = await topTracksResponse.json();
    const trackIds = (topTracksData.items || []).map(track => track.id);

    if (!trackIds.length) {
      return res.status(200).json({ message: 'No top tracks found.' });
    }

    const audioFeaturesResponse = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!audioFeaturesResponse.ok) {
      const errorText = await audioFeaturesResponse.text();
      console.error('Spotify audio features request failed:', errorText);
      return res.status(500).json({ error: 'Failed to fetch audio features' });
    }

    const audioData = await audioFeaturesResponse.json();
    const danceabilities = (audioData.audio_features || [])
      .filter(f => f && typeof f.danceability === 'number')
      .map(f => f.danceability);

    if (!danceabilities.length) {
      return res.status(200).json({ message: 'No audio features found for your top tracks.' });
    }

    const averageDanceability = danceabilities.reduce((a, b) => a + b, 0) / danceabilities.length;

    let seasonMessage;
    if (averageDanceability < 0.25) {
      seasonMessage = 'your music vibe is like winter: calm and introspective. You are like a cup of hot chocolate on a snow day.';
    } else if (averageDanceability < 0.5) {
      seasonMessage = 'your music vibe is like autumn: mellow and reflective. You are like drinking hot apple cider in a pumpkin patch.';
    } else if (averageDanceability < 0.75) {
      seasonMessage = 'your music vibe is like spring: fresh and lively. You are like drinking herbal tea in a meadow.';
    } else {
      seasonMessage = 'your music vibe is like summer: vibrant and energetic. You are like drinking lemonade by the pool.';
    }

    res.json({
      message: `Based on your music taste, ${seasonMessage}`
    });
  } catch (err) {
    console.error('Error in /season:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
