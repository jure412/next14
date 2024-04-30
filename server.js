const next = require("next");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
const port = process.env.NEXT_PUBLIC_PORT;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined");
    });

    socket.on("user-joined", (roomId) => {
      socket.to(roomId).emit("user-joined");
    });

    socket.on("drawing-line", (roomId, { prevPoint, currentPoint, color }) => {
      +socket
        .to(roomId)
        .emit("drawing-line", { prevPoint, currentPoint, color });
    });

    socket.on("clear", (roomId) => {
      socket.to(roomId).emit("clear");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
