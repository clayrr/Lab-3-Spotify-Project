<script setup>
import { ref, onMounted } from 'vue';
import BobaApp from './components/BobaApp.vue'; // Import your boba component

//declaring relevant variables 
const accessToken = ref('');
const userData = ref(null);
const bobaTea = ref('');
const energy = ref('');
const season = ref('');
const errorMsg = ref('');

//gets the Spotify user data, displaying message if it fails
async function fetchSpotifyUser(token) {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    errorMsg.value = 'Failed to fetch Spotify user data.';
    return;
  }
  userData.value = await res.json();
}

async function fetchBackendData(token) {
  try {
    //fetching backend endpoints
    const [bubbleRes, energyRes, seasonRes] = await Promise.all([
      fetch(`http://localhost:8888/bubbletea?access_token=${token}`),
      fetch(`http://localhost:8888/track-energy?access_token=${token}`),
      fetch(`http://localhost:8888/season?access_token=${token}`),
    ]);

    if (!bubbleRes.ok || !energyRes.ok || !seasonRes.ok) {
      errorMsg.value = 'Failed to fetch data from backend.';
      return;
    }
  //parsing and storing responses
    const bubbleData = await bubbleRes.json();
    const energyData = await energyRes.json();
    const seasonData = await seasonRes.json();

    bobaTea.value = bubbleData.message;
    energy.value = energyData.message;
    season.value = seasonData.message;
  } catch (err) {
    errorMsg.value = 'Error fetching backend data.';
    console.error(err);
  }
}
//gets access token and fetches data
onMounted(() => {
  let token = null;
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    token = params.get('access_token');
  }
  if (!token) {
    const params = new URLSearchParams(window.location.search);
    token = params.get('access_token');
  }
  if (token) {
    accessToken.value = token;
    window.history.replaceState(null, null, window.location.pathname);
    fetchSpotifyUser(token);
    fetchBackendData(token);
  }
});
</script>

<template>
  <div class="container" style="max-width: 800px; margin: auto; font-family: Arial, sans-serif;">
    <div v-if="errorMsg" style="color: red; margin-bottom: 1em;">{{ errorMsg }}</div>
    
    <!-- tells user to log in-->
    <div v-if="!accessToken">
      <p>please log in to access your personalized music data. yay!</p>
      <a href="http://localhost:8888/login" style="text-decoration: none; background: #1db954; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin-top: 1em;">Log in with Spotify</a>
    </div>
    
    <div v-else-if="!userData">
      <p>loading your spotify data...</p>
    </div>
    
    <!-- displays users name, profile picture, and recommendations based on data-->
    <div v-else>
      <h2>hello, {{ userData.display_name }}!</h2>
      <p><strong>email:</strong> {{ userData.email }}</p>
      <img :src="userData.images[0]?.url" alt="Profile Picture" style="width:100px; border-radius: 50%; margin-bottom: 1em;" />
      
      <div style="background: #1DB954; padding: 1em; border-radius: 10px; margin-top: 1em;">
        <h3>your recommendations</h3>
        <p><strong>boba tea suggestion:</strong> {{ bobaTea }}</p>
        <p><strong>music energy level:</strong> {{ energy }}</p>
        <p><strong>season:</strong> {{ season }}</p>
      </div>
      
      <!-- Boba component with the recommendation -->
      <BobaApp :boba-tea="bobaTea" v-if="bobaTea" />
    </div>
  </div>
</template>