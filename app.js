const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

let roomTimer = null;

// Webhook endpoint to handle events
app.post('/close-room-notification', (req, res) => {
  // Handle the received notification to close the room here
  console.log('Received close room notification');
  clearTimeout(roomTimer);
  roomTimer = null;

  res.status(200).send('Close room notification received.');
});

// Room create endpoint to initiate the room and start timer
app.get('/room-create', (req, res) => {
  if (roomTimer) {
    res.status(400).send('A room is already active.');
    return;
  }

  // Simulating room creation by logging a message
  console.log('Room created.');

  // Start a timer for 1 minute (60,000 milliseconds)
  roomTimer = setTimeout(() => {
    // Send a notification to close the room after 1 minute
    const closeNotificationUrl = 'http://localhost:3000/close-room-notification'; // Update with your URL
    axios.post(closeNotificationUrl)
      .then(response => {
        console.log('Close room notification sent:', response.data);
      })
      .catch(error => {
        console.error('Error sending close room notification:', error.message);
      });

    // Clear the timer
    clearTimeout(roomTimer);
    roomTimer = null;
  }, 10000); // 1 minute

  res.status(200).send('Room created and timer started.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
