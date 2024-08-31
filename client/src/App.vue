<template>
  <div class="chat-container" v-if="notJoined">
    <div class="join-container">
      <input class="input-field" v-model="name" placeholder="Join as your name" />
      <button class="join-button" @click="join">Join</button>
    </div>
  </div>
  <div class="chat-container" v-else>
    <div class="message-container">
      <input class="input-field" v-model="sendid" placeholder="Recipient ID" />
      <input class="input-field" v-model="sendMessage" placeholder="Type your message..." />
      <button class="send-button" @click="send">Send</button>
    </div>
    <div class="message-list">
      <div v-for="(message, index) in messages" :key="index" class="message-wrapper" :class="{'user-message': message.senderId === socketName, 'received-message': message.senderId !== socketName}">
        <p><strong>{{message.senderId !== socketName? message.senderId +':' :null }}</strong> {{ message.text }}</p>
      </div>
    </div>
  </div>
</template>



<script>
import { io } from 'socket.io-client';
import { ref, reactive } from 'vue';

export default {
  name: 'App',
  setup() {
    const name = ref('');
    const notJoined = ref(true);
    const sendid = ref('');
    const sendMessage = ref('');
    const messages = reactive([]);
    const socketName = ref('');
    const socket = io("http://localhost:3000");

    socket.on('connected', (arg) => {
      socketName.value = arg;
    });

    socket.on('receivingMessage', (senderId, message) => {
      messages.push({ senderId, text: message });
    });

    function join() {
      notJoined.value = false;
      socket.emit('join', name.value);
    }

    function send() {
      socket.emit("sendingMessage", sendid.value, sendMessage.value);
      messages.push({ senderId: socketName.value, text: sendMessage.value });
      sendMessage.value = ''; 
    }

    return {
      send,
      socketName,
      sendid,
      sendMessage,
      messages,
      notJoined,
      name,
      join,
    };
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.join-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.input-field {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 300px;
}

.join-button, .send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 150px;
}

.join-button:hover, .send-button:hover {
  background-color: #0056b3;
}

.message-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 300px;
}

.message-wrapper {
  padding: 0px 10px 0px 10px ;
  border-radius: 5px;
  word-wrap: break-word;
  min-width: 30px;
}

.user-message {
  background-color: #ccc; /* Gray for the user's own message */
  color: black;
  align-self: flex-end; /* Align user's message to the right */
}

.received-message {
  background-color: #007bff; /* Blue for received messages */
  color: white;
  align-self: flex-start; /* Align received messages to the left */
}
</style>
