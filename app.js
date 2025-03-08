const express = require('express');
const app = express();
const path = require('path');

const http = require('http');  // projectFlow.txt : 2 
const socketio = require('socket.io');

const server = http.createServer(app);

const io = socketio(server); //intergrating socket.io with http server. so that it can handle both normal HTTP req like GET,POST and also websockets evenmts like send-location, receive-location

app.set("view engine", "ejs"); 
app.use(express.static(path.join(__dirname,"public"))); 

io.on("connection", function(socket){  // server-side Socket.IO event listener that listens for a new connection event from the client.
    socket.on("send-location", function(data){  // server-side Socket.IO event listener that listens for a send-location event from the client. and captures what client sent in data 
        io.emit("receive-location", {id: socket.id, ...data});  // server-side Socket.IO event emitter that emits a receive-location event to all connected clients with the data received from the client. -- logic is we reieved client data from send-location event and now we sent that data to all connected client by calling receive-location event(broadcasts data)  .  id:socket.id is a unique marker fror each user
    });

    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);  // server-side Socket.IO event emitter that emits a user-disconnected event to all connected clients with the ID of the disconnected client. notifies all clients to remove that user’s marker from the map.
    });
    console.log("Connected");
});

app.get("/", function(req,res){
    res.render("index");
});


// server.listen(3000);
server.listen(3001, '0.0.0.0', () => {
    console.log("Server running on http://192.168.23.4:3000");
});


