const express = require("express");

const app = express();
const port = 3001;

app.use(express.json());

const activeRooms = new Map();

app.post("/room-delete", (req, res) => {
  const { roomId } = req.body;

  if (activeRooms.has(roomId)) {
    activeRooms.delete(roomId);
    console.log(`Room deleted: ${roomId}`);
    res.json({ message: `Room deleted: ${roomId}` });
  } else {
    console.log(`Room not found: ${roomId}`);
    res.status(404).json({ message: `Room not found: ${roomId}` });
  }
});

app.listen(port, () => {
  console.log(`Room Delete App listening at http://localhost:${port}`);
});
