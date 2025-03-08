const socket = io();  //Initializes a WebSocket connection between the client (browser) and the server using Socket.IO. It allows real-time communication between both ends.

if(navigator.geolocation){  // navigator.geolocation is a built-in object in JavaScript uses geolocation API that contains methods to retrieve the user's current location in real-time.
    navigator.geolocation.watchPosition((position) => {   //The watchPosition() method continuously monitors the user's location in real-time and triggers a callback function whenever the position changes.
        const {latitude, longitude} = position.coords;
        //console.log("Fetched location:", latitude, longitude);  // Debugging
        socket.emit("send-location", {latitude, longitude});  // emitting a custom event called send-location from frontend to the server/backend with the user's current latitude and longitude.
    }, (err) => {
        console.log(err);
    },
    {
        enableHighAccuracy: true,
        maximumAge:0, // tells not to cache the location instead take it in real time always
        timeout:5000  // recheck location every 5 seconds
    });
};

const map = L.map("map").setView([0,0], 16); // Initializes a new Leaflet map instance. The map() method takes the ID of the HTML element where the map will be rendered.

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Arihant\'s Location tracker'
}).addTo(map); // Tile layers add actual map visuals.

const markers = {};


socket.on("receive-location", (data) => { // client-side Socket.IO event listener that listens for a receive-location event from the server.
    const {id, latitude, longitude} = data; // Destructuring the data received from the server
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }   
});

socket.on("user-disconnected", (id) => {
    map.removeLayer(markers[id]);
    delete markers[id];
})
