<template>
  <div class="chat-container">
    <main class="chat-main">
      <h1 class="chat-title">Lobby</h1>
      <div class="lobby-id-box">
        <p class="lobby-id">{{ lobbyId }}</p>
      </div>
      <div class="chat-box">
        <div class="messages" ref="messagesEnd">
          <div v-for="(msg, idx) in messages" :key="idx"
            :class="['message', msg.sender === 'You' ? 'me' : msg.sender === 'System' ? 'System' : 'peer']">
            <div
              :class="['bubble', msg.sender === 'You' ? 'bubble-me' : msg.sender === 'Peer' ? 'bubble-peer' : 'bubble-System']">
              <span class="text">{{ msg.text }}</span>
            </div>
          </div>
        </div>
        <form @submit.prevent="sendMessage" class="input-row">
          <input v-model="newMessage" type="text" placeholder="Send a message..." class="input-msg" />
          <button type="submit" class="send-btn">Send</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import CryptoJS from 'crypto-js';
import { onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const lobbyId = route.query.lobbyId || '';
const messages = ref([]);
const newMessage = ref('');
const AES_KEY = 'b7e4c2a1d3f8e9b0';
let ws = null;
const messagesEnd = ref(null);

function sendMessage() {
  if (newMessage.value.trim() === '') return;
  messages.value.push({ sender: 'You', text: newMessage.value });
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(newMessage.value);
  }
  newMessage.value = '';
  scrollToBottom();
}

function connectToPeer() {
  try {
    const decrypted = CryptoJS.AES.decrypt(lobbyId, AES_KEY).toString(CryptoJS.enc.Utf8);
    const [ip, port] = decrypted.split(':');
    const wsUrl = `ws://${ip}:${port}`;
    ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      messages.value.push({ sender: 'System', text: 'Connected to the lobby.' });
      scrollToBottom();
    };
    ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        messages.value.push({ sender: 'Peer', text: event.data });
      } else if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function () {
          messages.value.push({ sender: 'Peer', text: reader.result });
          scrollToBottom();
        };
        reader.readAsText(event.data);
        return;
      }
      scrollToBottom();
    };
    ws.onclose = () => {
      messages.value.push({ sender: 'System', text: 'Connection closed.' });
      scrollToBottom();
    };
    ws.onerror = (err) => {
      messages.value.push({ sender: 'System', text: 'Connection error.' });
      scrollToBottom();
    };
  } catch (e) {
    messages.value.push({ sender: 'System', text: 'Invalid Lobby ID.' });
    scrollToBottom();
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEnd.value) {
      messagesEnd.value.scrollTop = messagesEnd.value.scrollHeight;
    }
  });
}

onMounted(() => {
  if (lobbyId) {
    connectToPeer();
  }
});
</script>

<style scoped>
.chat-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chat-main {
  width: 100%;
  max-width: fit-content;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-title {
  color: #22c55e;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
}

.lobby-id-box {
  background: #e5e7eb;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 18px;
  width: 100%;
  word-break: break-all;
}

.lobby-id {
  font-family: 'Fira Mono', 'Consolas', monospace;
  font-size: 0.95rem;
  color: #374151;
  text-align: center;
}

.chat-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 400px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 0;
  box-sizing: border-box;
  justify-content: flex-end;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 18px 12px 8px 12px;
  height: 320px;
}

.message {
  margin-bottom: 10px;
  font-size: 1.08rem;
  line-height: 1.5;
  display: flex;
  align-items: baseline;
}

.message.me {
  justify-content: flex-end;
}

.message.peer {
  justify-content: flex-start;
}

.message.System {
  justify-content: center;
}

.bubble {
  max-width: 70%;
  padding: 8px 14px;
  border-radius: 16px;
  display: inline-block;
  word-break: break-word;
}

.bubble-me {
  background: #dcfce7;
  align-self: flex-end;
}

.bubble-peer {
  background: #e0e7ff;
  align-self: flex-start;
}

.bubble-System {
  background: #fef9c3;
  align-self: center;
}

.message .text {
  margin-left: 6px;
  color: #222;
}

.input-row {
  display: flex;
  width: 100%;
  border-top: 1px solid #e5e7eb;
  padding: 10px 0 0 0;
  margin-top: 0;
}

.input-msg {
  color: black;
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 6px 0 0 6px;
  padding: 10px;
  font-size: 1rem;
  outline: none;
}

.send-btn {
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 0 6px 6px 0;
  padding: 0 22px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.send-btn:hover {
  background: #16a34a;
}
</style>
