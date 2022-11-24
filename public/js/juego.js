const socket = io("http://localhost:3000");

let sala = localStorage.sala;
let nombre = localStorage.usuario;
let jugadores;

let yo = document.querySelector("#yo");
let rival = document.querySelector("#oponente");
let alerta = document.querySelector("#alerta");

let send = document.querySelector(".send");
let resultElement = document.querySelector(".result");
let action = document.getElementById("action");
let salida = document.getElementById("salida");
let enviarMsj = document.getElementById("btnEnviar");

let tabla = document.getElementById("tabla");

function enterClick(input, button){
  document.getElementById(input)
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById(button).click();
    }
});
}


enterClick("Mensaje", "btnEnviar")
enterClick("input4", "enviarNumero2")
enterClick("nu4", "enviarNumero")


function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}

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
    
    let comparacion = [];
    
    squaresFilled.forEach((element) => {
      comparacion.push(element.value);
    }); 

    console.log(hasDuplicates(comparacion))

    if (!hasDuplicates(comparacion)) {
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

        alert("Ganaste!!!");
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
    }
    else {
      toastr['error']('No repita los numeros');
    }
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
  let comp = []
  
  numero.forEach((element) => {
    comp.push(element.value);
  });

  if (!hasDuplicates(comp)){
    numero.forEach((element) => {
      element.disabled = true;
      adivinar.push(element.value);
    });
  
    socket.emit("numero", {
      numero: adivinar.join("-"),
      array: adivinar,
      sala: sala,
    });
  }
  else{
    toastr['error']('No repita los numeros');
  }
  
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
  toastr['success']("El rival envio el numero, le toca a usted")
  resultado(data.array);
  n.forEach((element) => {
    element.disabled = false;
  });
});

socket.on("lost", () => {
  alert("OH NO!, HAS PERDIDO");
  setTimeout(() =>
  {
    location.href = "/"
  }, 2000)
});

socket.on("turno", () => {
  toastr['warning']("Es tu turno")
  n.forEach((element) => {
    element.disabled = false;
  });
  send.disabled = false;
});

socket.emit("join", {
  sala: sala,
  usuario: nombre,
});
