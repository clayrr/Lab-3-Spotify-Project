<script>
import { ref } from 'vue'

const energyLevel = ref("")

const getEnergy = () => {
    const levels = {
        low: "Low energy",
        modLow: "Moderately low energy",
        mod: "Moderate energy",
        high: "High energy",
    };

    energyLevel.value = levels[energy.value]
}

</script>

<template>

<div class="audio">
        <h1>Energy Level</h1>
        <select v-model="energy">
            <option disabled value="">Select an energy level</option>
            <option value="low">Low (<0.25)</option>
            <option value="modLow">Moderately low (<0.5)</option>
            <option value="mod">Moderate (<0.75)</option>
            <option value="high">High (<1.0)</option>
        </select>

        <button @click="getEnergy">Find Your Energy</button>

        <h2>{{ energyLevel }}</h2>
    </div>
</template>


<style>
div {
    text-align: center;
    padding: 20px;
}
</style>