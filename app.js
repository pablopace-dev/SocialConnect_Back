const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const http = require("http");
const { Server } = require("socket.io");

const { connect } = require('./helpers/dbConnect');

port = process.env.PORT;

app.use(cors());                                    //Cors
app.use(express.static(__dirname + '/public'));     //Carpeta static

app.use(express.urlencoded({ extended: false }));   // Parse application/x-www-form-urlencoded
app.use(express.json());                             // Parse application/json

//Conexión
connect();

//Chat server socket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    },
});
module.exports = { io }

//Rutas
app.use('/api/users', require('./routers/routerUsers'));    //Users
app.use('/api/public', require('./routers/routerPublic'));    //Profiles
app.use('/api/socket', require('./routers/routerSocket'));    //Execute socket commands

//Awake
app.use('/wakeup', (req, res) => {
    
    console.log("I'm awake (Social Connect - Back)");

    res.status(200).json({
        ok: true,
        msg: `I'm awake (Social Connect - Back)`
    });

});


//Chat server controller
const { socketController } = require('./controllers/socketController');
socketController();


//404
app.use((req, res) => { res.status(404).send({ msg: `Ruta no encontrada: ${req.url}` }); });


//Listener
server.listen(port, () => console.log(`Server listenning on port ${port}...`));