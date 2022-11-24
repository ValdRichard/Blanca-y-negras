const socket = io("http://localhost:3000");

let sala = localStorage.sala;
let nombre = localStorage.usuario;
let jugadores;

let yo = document.querySelector("#yo");
let rival = document.querySelector("#oponente");

let send = document.querySelector(".send");
let resultElement = document.querySelector(".result");
let action = document.getElementById("action");
let salida = document.getElementById("salida");
let enviarMsj = document.getElementById("btnEnviar");

let tabla = document.getElementById("tabla");

function resultado(data) {
  console.log(data);

  blancas = 0;
  negras = 0;

  let focusElement = document.querySelector(".focus");
  focusElement.focus();

  let squares = document.querySelectorAll(".numero");

  squares = [...squares];

  // Verifica caja por si es blanca o negra
  send.addEventListener("click", () => {
    //Se almacena el ingreso del usuario
    let squaresFilled = document.querySelectorAll(".numero");
    squaresFilled = [...squaresFilled];

    let finalUserInput = [];

    squaresFilled.forEach((element) => {
      finalUserInput.push(element.value);
    });

    let existIndexArray = existLetter(data, finalUserInput);

    existIndexArray.forEach((element) => {
      squares[element].classList.add("gold");
    });

    // COMPARAR ARRAY'S PARA CAMBIAR EL ESTILO
    let rightIndex = compareArrays(data, finalUserInput);
    rightIndex.forEach((element) => {
      if (squares[element].classList.contains("gold")) {
        squares[element].classList.remove("gold");
        squares[element].classList.add("green");
      }
    });
    negras = document.querySelectorAll(".gold").length;
    blancas = document.querySelectorAll(".green").length;
    if (rightIndex.length == data.length) {
      registro(negras, blancas, finalUserInput);

      blancas = 0;
      negras = 0;

      socket.emit("perdio", {
        sala: sala,
      });

      alert("ganaste");
      location.href = "/";
    } else {
      socket.emit("turno", {
        sala: sala,
      });

      registro(negras, blancas, finalUserInput);

      blancas = 0;
      negras = 0;

      send.disabled = true;
    }
    squares = document.querySelectorAll(".numero");
    squares.forEach((element) => {
      element.value = "";
      element.classList.remove("gold");
      element.classList.remove("green");
      element.disabled = true;
    });
  });
}

// Compara lo que ingresa el usuario, con el array del otro usuario

function compareArrays(array1, array2) {
  let iqualsIndex = [];
  array1.forEach((element, index) => {
    if (element == array2[index]) {
      iqualsIndex.push(index);
    }
  });
  return iqualsIndex;
}

function existLetter(array1, array2) {
  let existIndexArray = [];
  array2.forEach((element, index) => {
    if (array1.includes(element)) {
      existIndexArray.push(index);
    }
  });
  return existIndexArray;
}

function registro(negras, blancas, finalUserInput) {
  let tr = document.createElement("tr");

  let num = document.createElement("th");
  let neg = document.createElement("th");
  let bla = document.createElement("th");

  num.setAttribute("scope", "col");
  neg.setAttribute("scope", "col");
  bla.setAttribute("scope", "col");

  tabla.appendChild(tr);
  tr.appendChild(num);
  tr.appendChild(neg);
  tr.appendChild(bla);

  neg.innerText = negras;
  bla.innerText = blancas;
  num.innerText = finalUserInput;
}

// Web socket
let numero = document.querySelectorAll(".adivinar");
let enviar = document.querySelector(".enviar");
let n = document.querySelectorAll(".numero");

let adivinar = [];

enviar.addEventListener("click", (e) => {
  numero.forEach((element) => {
    console.log(element);
    element.disabled = true;
    adivinar.push(element.value);
  });

  socket.emit("numero", {
    numero: adivinar.join("-"),
    array: adivinar,
    sala: sala,
  });
});

let mensaje = document.getElementById("Mensaje");
let cont = document.querySelector(".mensaje");

enviarMsj.addEventListener("click", () => {
  socket.emit("chat:mensaje", {
    nombre: nombre,
    mensaje: mensaje.value,
    sala: sala,
  });
  mensaje.value = "";
});

socket.on("mensaje", (data) => {
  let msj = data.mensaje;

  let div = document.createElement("div");
  div.classList.add("msj");

  let p = document.createElement("p");
  p.innerText = data.nombre;

  let h4 = document.createElement("h4");
  h4.innerText = msj;

  cont.appendChild(div);
  div.appendChild(p);
  div.appendChild(h4);
});

socket.on("new", (data) => {
  let msj = data.mensaje;

  let div = document.createElement("div");
  div.classList.add("msj");

  let p = document.createElement("p");
  p.innerText = data.system;

  let h4 = document.createElement("h4");
  h4.innerText = msj;

  cont.appendChild(div);
  div.appendChild(p);
  div.appendChild(h4);
});

socket.on("run", (data) => {
  document.querySelector(".container-mamadisimo").classList.remove("d-none");
  document.querySelector(".wait").classList.add("d-none");
  rival.innerText = data.players.player2;
  yo.innerText = data.players.player1;
});

socket.on("respuesta", (data) => {
  alert("ya ingreso su numero el jugador");
  resultado(data.array);
  n.forEach((element) => {
    element.disabled = false;
  });
});

socket.on("lost", () => {
  alert("oh no, perdiste");
});

socket.on("turno", () => {
  alert("Es tu turno");
  n.forEach((element) => {
    element.disabled = false;
  });
  send.disabled = false;
});

socket.emit("join", {
  sala: sala,
  usuario: nombre,
});
