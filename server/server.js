const express = require('express');
const app = express();
const { createServer } = require('http');
const server = createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
const port = 3000;

app.use(cors());
const users = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected with ID: ' + socket.id);
  

  socket.emit("connected", socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected with ID: ' + socket.id);
    for (const name in users) {
        if (users[name] === socket.id) {
          delete users[name]; // Remove the user from the users object
          break;
        }
      }
    console.log('Remaining connected users:', users);
  });
  socket.on('join',(name)=>{
    // console.log(name);
    
users[name]=socket.id;
  })
socket.on('sendingMessage',(sendid, message) =>{
    
    const toId=users[sendid];
    
    const senderName = getKeyByValue(users, socket.id);
    // console.log(toId);
    socket.to(toId).emit('receivingMessage',senderName, message)
})
  io.emit('levelHai', 'bilkul');
});



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function getKeyByValue(obj, value) {
    return Object.entries(obj).find(([key, val]) => val === value)?.[0];
  }
