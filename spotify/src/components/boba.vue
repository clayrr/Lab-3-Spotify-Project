<script setup lang="ts">
import { ref } from 'vue'

const genre = ref("")
const result = ref("")

const bobaMatch = {
    pop: " milk tea",
    rock: "taro bubble tea ",
    jazz: "brown sugar boba ",
    hiphop: "matcha latte ",
    edm: "thai tea ",
    indie: "honeydew milk tea "
}

const getBoba = () => {
    result.value = bobaMatch[genre.value] || "pick a genre!"
}
</script>

<template>
    <div class="boba-quiz">
        <h1>What Boba Tea Are You?</h1>
        <select v-model="genre">
            <option disabled value="">Select a genre</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="hiphop">Hip-Hop</option>
            <option value="edm">EDM</option>
            <option value="indie">Indie</option>
        </select>
        <button @click="getBoba">Find Out</button>
        <h2>{{ result }}</h2>
    </div>
</template>

<style scoped>
div {
    text-align: center;
    padding: 20px;
}

select,
button {
    margin-top: 10px;
    padding: 8px;
}
</style>