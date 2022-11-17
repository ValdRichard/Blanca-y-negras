const express = require ('express');
const app = express();
const path = require('path')

// Configuracion

app.set ('port', process.env.PORT || 3000);

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'hbs');


// Inicializar servidor
const server = app.listen(app.get ('port'), () => {
    console.log('servidor en el puerto http://localhost:3000');
});

// Routes

const routes = require ('./src/routes')

app.use ("/" , routes)

// Web socket

const socketIO= require ('socket.io')

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log("new connection", socket.id);

    socket.on('chat:mensaje', (data) => {
        socket.broadcast.emit('mensaje', data)
    });


    socket.on('typing', (data) =>{
        socket.broadcast.emit('typing', data)
    });

    socket.on('chat:enviar', (data) =>{
        console.log(data)
    });
})






