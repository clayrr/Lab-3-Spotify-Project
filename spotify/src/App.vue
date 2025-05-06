<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const topTracks = ref([])

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const access_token = params.get('access_token')

  if (access_token) {
    // Fetch user profile
    const userRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const userData = await userRes.json();
    user.value = userData;

    // Fetch top tracks
    const tracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const tracksData = await tracksRes.json();
    topTracks.value = tracksData.items;
  }
});


const loginWithSpotify = () => {
  window.location.href = 'http://localhost:5173/login'
}
</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-300 to-purple-400 text-white">
    <img src="/vite.svg" alt="Vite logo" class="h-20 mb-4" />
    <h1 class="text-4xl font-bold mb-6">beats</h1>

    <button v-if="!user" @click="loginWithSpotify" class="bg-black text-green-400 px-6 py-3 rounded-full text-lg hover:scale-105 transition-all">
      Connect with Spotify
    </button>

    <div v-if="user" class="mt-6 text-center">
      <h2 class="text-2xl font-semibold mb-2">welcome, {{ user.display_name }}</h2>
      <img :src="user.images[0]?.url" alt="Profile" class="rounded-full h-24 w-24 mx-auto mb-4" />

      <h3 class="text-xl font-bold mb-2">your top tracks:</h3>
      <ul class="space-y-2 text-left">
        <li v-for="track in topTracks" :key="track.id">
          🎵 {{ track.name }} by {{ track.artists[0].name }}
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
