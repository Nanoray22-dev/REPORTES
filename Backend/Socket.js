const jwt = require("jsonwebtoken");
const WebSocket = require("ws");
const Message = require("./Models/Message");
const User = require("./Models/User");

const notifyAllClients = (wss, event, data) => {
  if (wss && wss.clients) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event, data }));
      }
    });
  } else {
    console.error("WebSocket server or clients are not defined");
  }
};

module.exports = (wss, io) => {
  if (!wss) {
    console.error("WebSocket server is not defined");
    return;
  }

  wss.on("connection", (socket, req) => {
    const token = req.headers.cookie?.split("=")[1];
    if (!token) {
      socket.close();
      return;
    }

    let userId;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      userId = decodedToken.userId;
    } catch (err) {
      socket.close();
      return;
    }

    socket.userId = userId;

    socket.on("message", async (data) => {
      try {
        const messageData = JSON.parse(data);
        const { recipient, text, file } = messageData;

        const message = new Message({
          sender: userId,
          recipient,
          text,
          file,
        });

        await message.save();

        const sender = await User.findById(userId);
        const recipientUser = await User.findById(recipient);

        const fullMessage = {
          _id: message._id,
          sender: sender.username,
          recipient: recipientUser.username,
          text: message.text,
          file: message.file,
          createdAt: message.createdAt,
        };

        io.emit("message", fullMessage);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
  });
};

module.exports.notifyAllClients = notifyAllClients;
