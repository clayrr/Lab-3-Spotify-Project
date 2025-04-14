<script setup>
import { ref } from 'vue'

const user = ref(null)

const loginWithSpotify = () => {
  window.location.href = 'http://localhost:8888/login'
}
</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-300 to-purple-400 text-white">
    <img src="/vite.svg" alt="Vite logo" class="h-20 mb-4" />
    <h1 class="text-4xl font-bold mb-6">hiiii</h1>
    
    <button @click="loginWithSpotify" class="bg-black text-green-400 px-6 py-3 rounded-full text-lg hover:scale-105 transition-all">
      Connect with Spotify
    </button>

    <p class="mt-8 text-sm text-white/70">spotify music analyzer!!!!</p>
  </main>
</template>

<style scoped>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
