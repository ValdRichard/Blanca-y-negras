const socket = io('http://localhost:3000')

// DOM
let resultElement = document.querySelector('.result')
let numero = document.getElementById('numero');
let usuario = document.getElementById('usuario');
let send = document.getElementById('send');
let enviar = document.getElementById('enviar');
let action = document.getElementById('action');
let salida = document.getElementById('salida');

// Tabla
let neg = document.getElementById('negras');
let blan = document.getElementById('blancas');


let actualRow = document.querySelector('.entrada');


//dibuja las cajas
function dibujarCajas (data) {
    data.forEach((item, index) =>{
        if(index === 0){
            actualRow.innerHTML += '<input type="number" maxlength="1" oninput="if(this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)" id="numero" class="square focus">';
            
        }else{
            actualRow.innerHTML += '<input type="number" maxlength="1" oninput="if(this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)" id="numero" class="square focus">';
        }
    });
}

function validarTecla(event) {
    if(event.target.value.indexOf(event.key)>=0 && event.key === event.key) {
        event.preventDefault();
    }  
}
numero.addEventListener('keypress', validarTecla);


function resultado (data){
    
    let blancas = 0
    let negras = 0

    let focusElement = document.querySelector('.focus');
    focusElement.focus();

    let squares = document.querySelectorAll('.square');

    squares = [...squares];

    // Verifica caja por si es blanca o negra
    squares.forEach(element =>{

        element.addEventListener('input', event=>{
            //Se almacena el ingreso del usuario
            let squaresFilled = document.querySelectorAll('.square');
            squaresFilled = [...squaresFilled];

            let finalUserInput = [];

            squaresFilled.forEach(element =>{
                finalUserInput.push(element.value);
            })

            if(event.target.nextElementSibling) {

                event.target.nextElementSibling.focus();

            } else {

                let existIndexArray = existLetter(data, finalUserInput)

                existIndexArray.forEach(element =>{
                    squares[element].classList.add('gold')
                })

                // COMPARAR ARRAY'S PARA CAMBIAR EL ESTILO
                let rightIndex = compareArrays(data, finalUserInput);
                rightIndex.forEach(element => {

                    if(squares[element].classList.contains('gold')){
                        squares[element].classList.remove('gold');
                        squares[element].classList.add('green');
                    } 


                })
                negras = document.querySelectorAll('.gold').length
                blancas = document.querySelectorAll('.green').length
                console.log(negras , blancas)
                if(rightIndex.length == data.length){
                    showResults("Ganaste")
                }
                else{
                    showResults(`Blancas: ${blancas} negras: ${negras}. Intentalo denuevo`)
                    neg.innerText = negras
                    blan.innerText = blancas
                    blancas = 0
                    negras = 0
                }
            }   
        });
    })
}


// Compara lo que ingresa el usuario, con el array del otro usuario

function compareArrays(array1, array2){
    let iqualsIndex = []
    array1.forEach((element, index) => {
        if(element == array2[index]){
            iqualsIndex.push(index)
        }
    })
    return iqualsIndex;
}

function existLetter(array1, array2){
    let existIndexArray =[];
    array2.forEach((element, index)=>{
        if(array1.includes(element)){
            existIndexArray.push(index)
        }
    })
    return existIndexArray;
}

function showResults(msg){
    let squares = document.querySelectorAll('.square');
    resultElement.classList.remove("d-none")
    resultElement.innerHTML = `
    <p>${msg}</p>
    <button class="button" type="reset">Reiniciar</button>`
    let resetBtn = document.querySelector('.button')
            resetBtn.addEventListener('click', ()=>{
                resultElement.classList.add("d-none")
                squares.forEach(element =>{
                    element.value = ""
                });
                
    });
}


// Web socket

send.addEventListener ('click', () => {
    socket.emit("chat:mensaje", {
        usuario: usuario.value,
        numero: numero.value,
        array: numero.value.split('')
    });
});

numero.addEventListener('click', () => {
    socket.emit('typing', usuario.value);
});

socket.on('typing', (data) => {
    action.innerHTML += `
    <p id="salida"><em>${data} typing...</em></p>

    `
});


socket.on('mensaje', (data) => {
    salida.innerHTML= `<p><strong>${data.usuario} ya escribio su numero, adivinalo</strong></p>`
    dibujarCajas (data.array);
    resultado(data.array,data.numero)
});

