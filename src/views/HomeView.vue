<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

let render = ref("mainMenu");

function renderMainMenu() {
  render.value = "mainMenu";
}

function renderHostLobby() {
  render.value = "hostLobby";
}

function renderJoinLobby() {
  render.value = "joinLobby";
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-grow grid grid-cols-4 gap-4 p-4">
      <div></div>
      <div v-if="render === 'mainMenu'" class="col-span-2">
        <h1 class="text-2xl font-bold text-center text-green-500">Main Menu</h1>
        <div class="text-center mt-4">
          <br />
          <button @click="renderHostLobby()" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Host a Lobby
          </button>
          <button @click="renderJoinLobby()" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Join a Lobby
          </button>
        </div>
      </div>
      <div v-else-if="render === 'hostLobby'" class="grid grid-cols-3 col-span-2">
        <div class="col-span-3">
          <h1 class="text-2xl font-bold text-center text-green-500">Host a Lobby</h1>
          <p class="text-center mt-4">Don't forget to open the port in the gateway !</p>
        </div>
        <div class="col-span-2">
          <p class="text-center mt-4">Port number to listen:</p>
        </div>
        <div>
          <input type="text" placeholder="8080" class="border border-gray-300 rounded p-2 mt-4" />
        </div>
        <div class="col-span-3 text-center mt-4">
          <button @click="renderMainMenu()" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Back
          </button>
          <button @click="hostLobby()" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Continue
          </button>
        </div>
      </div>
      <div v-else-if="render === 'joinLobby'" class="col-span-2">
        <h1 class="text-2xl font-bold text-center text-green-500">Join a Lobby</h1>
        <div class="grid grid-cols-3 items-center col-span-3">
          <p class="text-center mt-4 col-span-2">Paste the lobby id</p>
          <input type="text" placeholder="Lobby ID" class="border border-gray-300 rounded p-2 mt-4" />
        </div>
        <div class="col-span-3 text-center mt-4">
          <button @click="renderMainMenu()" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Back
          </button>
          <button @click="joinLobby()" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Continue
          </button>
        </div>
      </div>
      <div></div>
    </main>
    <footer class="flex justify-between items-center p-4 bg-gray-800 text-white">
      <span>Author: Juan Pardos</span>
      <a href="https://github.com/juanpardos" target="_blank" class="flex items-center">
        <img src="../assets/github-mark-white.svg" alt="GitHub" class="w-6 h-6 mr-4" />
        GitHub
      </a>
    </footer>
  </div>
</template>

<style scoped>
h1 {
  color: #42b983;
  text-align: center;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  text-rendering: optimizeLegibility;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #42b983;
  border: solid 1px black;
  border-radius: 5px;
  cursor: pointer;
}

p {
  font-size: 20px;
  color: #333;
  text-align: center;
}

footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
