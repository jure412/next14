import dotenv from "dotenv";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
const port = process.env.NEXT_PUBLIC_PORT;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);
  let roomId = null;
  let users = [];
  let draw = {};

  io.on("connection", (socket) => {
    socket.on("join-room", ({ id, meId }) => {
      socket.join(id);
      roomId = id;
      users = [...users, [meId, socket.id]];
      io.to(id).emit("syncing-canvas", meId, draw);
    });

    socket.on(
      "draw-start",
      ({
        drawignId,
        offsetX,
        offsetY,
        brushWidth,
        selectedTool,
        selectedColor,
        fillColor,
      }) => {
        draw = {
          ...draw,
          [drawignId]: {
            drawingStart: {
              roomId,
              offsetX,
              offsetY,
              brushWidth,
              selectedTool,
              selectedColor,
              fillColor,
            },
            drawing: [],
            drawingEnd: false,
          },
        };
        socket.to(roomId).emit("draw-start", {
          offsetX,
          offsetY,
          brushWidth,
          selectedTool,
          selectedColor,
          fillColor,
        });
      }
    );

    socket.on("drawing", ({ drawignId, roomId, offsetX, offsetY }) => {
      draw[drawignId].drawing = [
        ...draw[drawignId].drawing,
        { roomId, offsetX, offsetY },
      ];
      socket.to(roomId).emit("drawing", {
        offsetX,
        offsetY,
      });
    });

    socket.on("draw-end", ({ drawignId, roomId }) => {
      draw[drawignId].drawingEnd = true;
      socket.to(roomId).emit("draw-end");
    });

    socket.on("clear", () => {
      if (users[socket.id]) {
        delete users[socket.id];
      }
      socket.to(roomId).emit("clear");
    });

    socket.on("handle-disconnect", () => {
      const disconectedUser = users.find((user) => user[1] === socket.id);
      socket.to(roomId).emit("user-disconnected", disconectedUser);
      const newUsers = users.filter((user) => user[1] !== socket.id);
      users = newUsers;
      roomId = null;
      draw = {};
    });

    socket.on("disconnect", () => {
      const disconectedUser = users.find((user) => user[1] === socket.id);
      socket.to(roomId).emit("user-disconnected", disconectedUser);
      const newUsers = users.filter((user) => user[1] !== socket.id);
      users = newUsers;
      roomId = null;
      draw = {};
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
