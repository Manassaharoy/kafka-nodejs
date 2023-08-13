const express = require("express");
const axios = require("axios");
const constrollers = require("./controller");
const KafkaConfig = require("./config");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/api/send", constrollers.sendMessageToKafka);

// consume from topic "test-topic"
const kafkaConfig = new KafkaConfig();
kafkaConfig.consume("my-topic", (value) => {
  console.log("📨 Receive message: ", value);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
