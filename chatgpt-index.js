const express = require("express");
const axios = require("axios");
const { Kafka } = require("kafkajs");

const app = express();
const port = 3000;

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"], // Change to your Kafka broker addresses
});

const producer = kafka.producer();

app.use(express.json());

const activeRooms = [];

app.post("/create-room", async (req, res) => {
  const { roomId } = req.query;
  //   const roomId = Math.random().toString(36).substr(2, 5); // Generate a random room ID
  const roomExpiry = 10000; // Room expiry in milliseconds (10 seconds)
  const roomCreatedAt = new Date();
  const deleteAt = new Date(roomCreatedAt.getTime() + roomExpiry);

  // Send room ID and expiry time to Kafka topic
  await producer.connect();
  await producer.send({
    topic: "room-one",
    messages: [
      {
        value: JSON.stringify({ roomId, roomExpiry, roomCreatedAt, deleteAt }),
      },
    ],
  });
  await producer.disconnect();
  // Store room ID for deletion
  activeRooms.push(roomId);

  console.log(
    `room created: ${roomId}, roomCreatedAt ${roomCreatedAt}, deleteAt ${deleteAt}, hitted: ${new Date()}`
  );
  res.json({ message: "Room created", roomId, roomCreatedAt, deleteAt });
});

app.post("/room-delete", (req, res) => {
  const { roomId, roomExpiry, roomCreatedAt, deleteAt } = req.query;

  //   if (activeRooms.has(roomId)) {
  //     activeRooms.delete(roomId);
  //     console.log(`Room deleted: ${roomId}`);
  //     res.json({ message: `Room deleted: ${roomId}` });
  //   } else {
  //     console.log(`Room not found: ${roomId}`);
  //     res.status(404).json({ message: `Room not found: ${roomId}` });
  //   }

  console.log(
    "room delete request for: ",
    roomId,
    roomExpiry,
    roomCreatedAt,
    deleteAt,
    `hitted: ${new Date()}`
  );
  res.json({ message: `Room deleted: ${roomId}` });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
