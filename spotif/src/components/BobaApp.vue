<!-- styling -->

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">choose your boba!</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(boba, index) in bobaOptions"
        :key="index"
        class="rounded-xl shadow-lg p-4 border hover:shadow-xl transition"
      >
      <!-- toggle button -->

        <button
          @click="toggleBoba(index)"
          class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl w-full mb-2"
        >
          {{ boba.name }}
        </button>

        <div v-if="boba.show" class="text-center">
          <img
            :src="boba.image"
            :alt="boba.name"
            class="w-full h-48 object-cover rounded-md mb-2"
          />
          <p class="text-sm text-gray-600">{{ boba.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<!-- components w/ show boolean and path to image files -->

<script>
export default {
  name: 'BobaApp',
  data() {
    return {
      bobaOptions: [
        {
          name: 'brown sugar boba',
          image: '/images/brownsugar.png',
          show: false,
        },
        {
          name: 'classic milk tea',
          image: '/images/classicmilktea.png',
          show: false,
        },
        {
          name: 'jasmine green tea',
          image: '/images/jasminetea.png',
          show: false,
        },
        {
          name: 'oolong grass jelly',
          image: '/images/oolonggrassjelly.png',
          show: false,
        },
        {
          name: 'thai tea',
          image: '/images/thaitea.png',
          show: false,
        },
      ]
    };
  },
  // if show is true --> false upon toggle, if show is false --> true upon toggle
  methods: {
    toggleBoba(index) {
      this.bobaOptions[index].show = !this.bobaOptions[index].show;
    }
  }
};
</script>

