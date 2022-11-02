let resultElement = document.querySelector('.result')

let word = "123456";

let wordArray = word.toUpperCase().split('');

console.log(wordArray);

let actualRow = document.querySelector('.row');

wordArray.forEach((item, index) =>{
    if(index === 0){
        actualRow.innerHTML += '<input type="text" maxlength="1" class="square focus">';
    }else{
        actualRow.innerHTML += '<input type="text" maxlength="1" class="square">';
    }
})

let focusElement = document.querySelector('.focus');
console.log(focusElement);
focusElement.focus();

let squares = document.querySelectorAll('.square');

squares = [...squares];

squares.forEach(element =>{
    element.addEventListener('input', event=>{
        //Se almacena el ingreso del usuario
        let squaresFilled = document.querySelectorAll('.square');
        squaresFilled = [...squaresFilled];

        let finalUserInput = [];

        squaresFilled.forEach(element =>{
            finalUserInput.push(element.value.toUpperCase());
        })

        if(event.target.nextElementSibling){
            event.target.nextElementSibling.focus();
        }else{
            
            


            let existIndexArray = existLetter(wordArray, finalUserInput)
            console.log(existIndexArray)
            existIndexArray.forEach(element =>{
                squares[element].classList.add('gold')
            })
            // COMPARAR ARRAY'S PARA CAMBIAR EL ESTILO
            let rightIndex = compareArrays(wordArray, finalUserInput);
            rightIndex.forEach(element => {
                if(squares[element].classList.contains('gold')){
                    squares[element].classList.remove('gold');
                    squares[element].classList.add('green');
                }
            })
            // SI LOS ARRAYS SON IGUALES
            // CAMBIAR ESTILO PERO SI EXISTE LA LETRA PERO NO POSICION CORRECTA
            

            if(rightIndex.length == wordArray.length){
                showResults("Ganaste")
            }
            else{
                showResults(`La respuesta correcta era: ${word.toUpperCase()}. Intentalo denuevo`)
            }
        }   
    });
})



// FUNCIONES

function compareArrays(array1, array2){
    let iqualsIndex = []
    array1.forEach((element, index) => {
        if(element == array2[index]){
            console.log(`En posicion ${index} si son iguales`);
            iqualsIndex.push(index)
        }else{
            console.log(`En posicion ${index} no son iguales`);
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
    resultElement.innerHTML = `
    <p>${msg}</p>
    <button class="button">Reiniciar</button>`
    let resetBtn = document.querySelector('.button')
            resetBtn.addEventListener('click', ()=>{
                location.reload();
    });
}