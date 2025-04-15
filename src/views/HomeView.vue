<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';

let render = ref("mainMenu");
let port = ref('');
let joinLobbyId = ref('');
const AES_KEY = 'b7e4c2a1d3f8e9b0';
const router = useRouter();

function renderMainMenu() {
  render.value = "mainMenu";
}

function renderHostLobby() {
  render.value = "hostLobby";
}

function renderJoinLobby() {
  render.value = "joinLobby";
}

async function hostLobby() {
  const response = await fetch('http://localhost:3001/start-server', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ port: port.value })
  });
  if (!response.ok) {
    alert('WebSocket server could not be started.');
    return;
  }
  let ip = await getLocalIP();
  if (!ip) {
    alert('Could not get local IP address.');
    return;
  }
  const data = `${ip}:${port.value}`;
  const encrypted = CryptoJS.AES.encrypt(data, AES_KEY).toString();
  router.push({ name: 'chat', query: { lobbyId: encrypted } });
}

function joinLobby() {
  if (!joinLobbyId.value) {
    alert('Please enter a valid lobby ID.');
    return;
  }
  router.push({ name: 'chat', query: { lobbyId: joinLobbyId.value } });
}

function getLocalIP() {
  return fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => data.ip)
    .catch(() => 'localhost');
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
          <button @click="renderHostLobby()" class="custom-btn">
            Host Lobby
          </button>
          <button @click="renderJoinLobby()" class="custom-btn">
            Join Lobby
          </button>
        </div>
      </div>
      <div v-else-if="render === 'hostLobby'" class="grid grid-cols-3 col-span-2">
        <div class="col-span-3">
          <h1 class="text-2xl font-bold text-center text-green-500">Host Lobby</h1>
          <p class="text-center mt-4">Don't forget to open the port in the gateway !</p>
        </div>
        <div class="col-span-2">
          <p class="text-center mt-4">Port number to listen:</p>
        </div>
        <div>
          <input v-model="port" type="text" placeholder="8080" class="border border-gray-300 rounded p-2 mt-4" />
        </div>
        <div class="col-span-3 text-center mt-4">
          <button @click="renderMainMenu()" class="custom-btn">
            Back
          </button>
          <button @click="hostLobby()" class="custom-btn">
            Continue
          </button>
        </div>
      </div>
      <div v-else-if="render === 'joinLobby'" class="grid grid-cols-4 col-span-2">
        <div class="col-span-4">
          <h1 class="text-2xl font-bold text-center text-green-500">Join Lobby</h1>
        </div>
        <div class="grid grid-cols-3 items-center col-span-4 mt-5">
          <p class="text-center mt-4 col-span-1 mr-2">Paste the lobby id</p>
          <input v-model="joinLobbyId" type="text" placeholder="Lobby ID"
            class="border border-gray-300 rounded mt-4 col-span-2" />
        </div>
        <div class="col-span-4 text-center mt-4">
          <button @click="renderMainMenu()" class="custom-btn">
            Back
          </button>
          <button @click="joinLobby()" class="custom-btn">
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
  color: var(--color-text);
  text-align: center;
  margin-right: 2rem;
}

footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}

.custom-btn {
  background-color: #22c55e;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  margin: 10px;
  font-size: 16px;
  border: solid 1px black;
  cursor: pointer;
  transition: background 0.2s;
}

.custom-btn:hover {
  background-color: #16a34a;
}
</style>
