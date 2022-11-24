const express = require("express");
const app = express();
const path = require("path");
const randomId = require("random-id");

// Configuracion

app.set("port", process.env.PORT || 3000);

// Archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");

// Inicializar servidor
const server = app.listen(app.get("port"), () => {
  console.log("servidor en el puerto http://localhost:3000");
});

// Routes

const routes = require("./src/routes");

app.use("/", routes);

app.use("/juego", routes);

app.use("/sala", routes);

// Web socket

const socketIO = require("socket.io");
const io = socketIO(server);

let room;
let players = {};

io.use((socket, next) => {
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  next();
});

io.on("connection", (socket) => {
  socket.on("crear", (data) => {
    socket.emit("conexion", {
      sessionID: socket.sessionID,
      userID: socket.userID,
      sala: data.sala,
      nombre: data.usuario,
    });
  });

  socket.on("chat:mensaje", (data) => {
    io.to(data.sala).emit("mensaje", data);
  });

  socket.on("join", (data) => {
    socket.join(data.sala);
    if (room === data.sala) {
      players.player2 = data.usuario;
      io.to(data.sala).emit("run", {
        players,
      });
      console.log(players);
    } else {
      room = data.sala;
      players.player1 = data.usuario;
    }
    console.log(room);
    socket.to(data.sala).emit("new", {
      mensaje: `se unio un usuario`,
      system: "system",
    });
  });

  socket.on("numero", (data) => {
    socket.broadcast.to(data.sala).emit("respuesta", data);
  });

  socket.on("perdio", (data) => {
    socket.broadcast.to(data.sala).emit("lost", data);
  });

  socket.on("turno", (data) => {
    socket.broadcast.to(data.sala).emit("turno", data);
  });

  socket.on("disconnect", () => {
    console.log("usuario se desconecto");
  });
});
