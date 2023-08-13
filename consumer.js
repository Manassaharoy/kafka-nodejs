// const { kafka } = require("./client");
// const group = process.argv[2];

// async function init() {
//   const consumer = kafka.consumer({ groupId: group });
//   await consumer.connect();

//   await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
//       console.log(
//         `${group}: [${topic}]: PART:${partition}:`,
//         message.value.toString()
//       );
//     },
//   });
// }

// init();

const { Kafka } = require("kafkajs");
const axios = require("axios");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"], // Change to your Kafka broker addresses
});

const consumer = kafka.consumer({ groupId: "room-creation-consumer" });

const processRoomExpiry = async (message) => {
  const { roomId, roomExpiry, roomCreatedAt, deleteAt } = JSON.parse(message.value.toString());
//   const { roomId, roomExpiry } = JSON.parse(message.value.toString());

  console.log(`Room created: ${roomId}`);

  // Wait for the specified room expiry time
  await new Promise((resolve) => setTimeout(resolve, roomExpiry));

  console.log(`Room expired: ${roomId}`);

  // Send room ID to room-delete API
  try {
    await axios.post(`http://localhost:3000/room-delete?roomId=${roomId}&roomExpiry:${roomExpiry}&roomCreatedAt=${roomCreatedAt}&deleteAt=${deleteAt}`);
    console.log(`Room deleted: ${roomId}`);
  } catch (error) {
    console.error(`Failed to delete room: ${roomId}`);
  }
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "room-one",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await processRoomExpiry(message);
    },
  });
};

run().catch(console.error);
