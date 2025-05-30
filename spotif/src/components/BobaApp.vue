<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">your personalized boba!</h1>
    <!-- header -->
    <div v-if="selectedBoba" class="flex justify-center">
      <div class="rounded-xl shadow-lg p-4 border hover:shadow-xl transition max-w-md">
        <div class="text-center">
          <h2 class="bg-green-500 text-white font-semibold py-2 px-4 rounded-xl mb-4">
            {{ selectedBoba.name }}
          </h2>
          <img
            :src="selectedBoba.image"
            :alt="selectedBoba.name"
            class="w-full h-48 object-cover rounded-md mb-2"
          />
          <p class="text-sm text-gray-600">{{ selectedBoba.description }}</p>
        </div>
      </div>
    </div>
    <!-- error message -> you did something wrong! -->
    <div v-else class="text-center">
      <p class="text-gray-600">No boba recommendation found. Please check your Spotify integration.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BobaApp',

  //recieves a bobaTea string as a prop from the parent component (app.vue)
  props: {
    bobaTea: {
      type: String,
      default: ''
    }
  },
  
  data() {
    return {
      //hardcoded list of avaiable boba options
      bobaOptions: [
        {
          name: 'brown sugar boba',
          image: '/images/brownsugar.png',
          description: 'creamy brown sugar milk tea with chewy tapioca pearls'
        },
        {
          name: 'classic milk tea',
          image: '/images/classicmilktea.png',
          description: 'traditional black tea with milk and tapioca pearls'
        },
        {
          name: 'jasmine green tea',
          image: '/images/jasminetea.png',
          description: 'fragrant jasmine green tea with a floral aroma'
        },
        {
          name: 'oolong grass jelly',
          image: '/images/oolonggrassjelly.png',
          description: 'semi-fermented oolong tea with refreshing grass jelly'
        },
        {
          name: 'thai tea',
          image: '/images/thaitea.png',
          description: 'sweet thai-style tea with condensed milk'
        }
      ]
    };
  },
  computed: {
    //determines which boba to show
    selectedBoba() {
      if (!this.bobaTea) return null;
      
      // try matching boba based on the recommendation
      const foundBoba = this.bobaOptions.find(boba => 
        boba.name.toLowerCase().includes(this.bobaTea.toLowerCase()) ||
        this.bobaTea.toLowerCase().includes(boba.name.toLowerCase())
      );
      
      return foundBoba || this.bobaOptions[0]; // default to first option if no match
    }
  }
};
</script>