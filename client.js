// Import the socket.io-client library
const io = require('socket.io-client');

// Connect to the server's socket
const socket = io.connect('http://localhost:5001');

// Event handler for successful connection
socket.on('connect', () => {
    console.log('Connected to server');
    
    // Send a notification
    socket.emit('send_notification', { message: 'New Notification' });
    console.log('Send Notification')

    // Trigger an event
    socket.emit('trigger_event', { level: 5 }); // Change level value as needed
    console.log('Trigger Event')
});

// Event handler for receiving a notification
socket.on('send_notification', (data) => {
    console.log('Notification received:', data);
});

// // Import the socket.io-client library
// const io = require('socket.io-client');

// // Connect to the server's socket
// const socket = io.connect('http://localhost:5001');

// // Event handler for successful connection
// socket.on('connect', () => {
//     console.log('Connected to server');
// });

// // Event handler for receiving a notification
// socket.on('send_notification', (data) => {
//     console.log('Notification received:', data);
// });

// // Send a message to trigger an event
// socket.emit('trigger_event', { level: 5 }); // Change level value as needed
