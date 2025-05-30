<template>
  
    <div style="background: #121212; color: #fafafa; font-family: 'inter', sans-serif; max-width: 400px; margin: 2rem auto; padding: 1.5rem; border-radius: 8px;">
      <h2 style="text-transform: lowercase; font-weight: 600; margin-bottom: 1rem;">
        pick your decade artist
      </h2>
  
      <!-- decade selector -->
      <label for="decade" style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #ccc;">
        choose a decade
      </label>
      <select id="decade" v-model="decade" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border-radius: 4px; border: none; background: white; color: green;">
        <option disabled value="">select decade</option>
        <option value="70s">1970s</option>
        <option value="80s">1980s</option>
        <option value="90s">1990s</option>
        <option value="00s">2000s</option>
        <option value="10s">2010s</option>
      </select>
  
      <!-- gender selector -->
      <label for="gender" style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #ccc;">
        choose artist gender
      </label>
      <select id="gender" v-model="gender" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border-radius: 4px; border: none; background: white; color: green;">
        <option disabled value="">select gender</option>
        <option value="male">male</option>
        <option value="female">female</option>
        <option value="group">group/band</option>
      </select>
  
      <!-- recommendation display -->
      <div v-if="recommendation" style="margin-top: 1rem; padding: 1rem; background: #1db954; color: black; border-radius: 6px;">
        <p style="text-transform: lowercase; margin: 0;">
          we recommend: <strong>{{ recommendation }}</strong>
        </p>
      </div>
  
      <div v-else style="color: #888; font-style: italic; margin-top: 1rem;">
        select a decade and gender to see an artist recommendation.
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "DecadeVibesApp",
    data() {
      return {
        decade: "",
        gender: "",
        artists: {
          "70s": {
            male: "david bowie",
            female: "stevie nicks",
            group: "led zeppelin"
          },
          "80s": {
            male: "bruce springsteen",
            female: "madonna",
            group: "u2"
          },
          "90s": {
            male: "kurt cobain",
            female: "alanis morissette",
            group: "radiohead"
          },
          "00s": {
            male: "jay-z",
            female: "beyoncé",
            group: "coldplay"
          },
          "10s": {
            male: "bruno mars",
            female: "katy perry",
            group: "one direction"
          }
        }
      };
    },
    computed: {
      recommendation() {
        if (this.decade && this.gender) {
          return this.artists[this.decade][this.gender];
        }
        return "";
      }
    }
  };
  </script>
  