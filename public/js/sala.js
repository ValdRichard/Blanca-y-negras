const socket = io("http://localhost:3000");

let nombre = document.querySelector(".nombre");
let unirse = document.getElementById("unirse");
let crear = document.getElementById("crear");
let sala = document.getElementById("crearSala");
let nameSala = document.getElementById("unirseSala");

crear.addEventListener("click", () => {
  socket.emit("crear", {
    usuario: nombre.value,
    sala: sala.value,
  });
});

unirse.addEventListener("click", () => {
  socket.emit("crear", {
    usuario: nombre.value,
    sala: nameSala.value,
  });
});

socket.on("conexion", ({ sessionID, userID, sala, nombre }) => {
  // store it in the localStorage
  localStorage.setItem("sessionID", sessionID);
  localStorage.setItem("sala", sala);
  localStorage.setItem("usuario", nombre);

  // save the ID of the user
  socket.userID = userID;

  location.href = "/juego";
});
