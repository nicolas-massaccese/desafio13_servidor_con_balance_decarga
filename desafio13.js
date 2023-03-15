const express = require('express');
const { createServer } = require('http');
const socketIo = require('socket.io');
const expressSession = require('express-session');

const { productosApiRouter } = require('./api/productos.js');
const { mensajesApiRouter } = require('./api/mensajes.js');
const { userApiRouter } = require('./api/users.js');
const { randomsApiRouter } = require('./api/randoms.js');

const { productSocket } = require('./webSocket/productosWS.js');
const { messageSocket } = require('./webSocket/mensajesWS.js');

const { mainPage } = require('./pages/loadPages.js');

const path = require ('path');

const { config, a, b, c, d } = require('./enviroment.js');
const { ID, NODEV, FILE, PTH, MEM } = require('./config.js');




const cluster = require('cluster');
const numCpus = require('os').cpus().length;

if (config.m == 'CLUSTER' && cluster.isPrimary) {
    console.log({numCpus});
    // console.log('cluster');
    console.log(`Master ${process.pid} running`);

// Creamos tantos procesos hijo por CPU que tengamos
    for (i = 0; i < numCpus ; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    })
} else {

    const app = express();

    const server = createServer(app);
    const io = socketIo(server, {cors: {origin:"*"}});

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(`${path.join(__dirname, `public`)}`));

    app.use(expressSession({
        secret: 'my-super-secret',
        resave: true,
        saveUninitialized: true,
    }));

    app.use(productosApiRouter);
    app.use(mensajesApiRouter);
    app.use(userApiRouter);
    app.use(randomsApiRouter);

    app.get('/quiensoy', (req,res) => {
        if(req.session.loguedUser){
            res.send(`Usuario Logueado: ${req.session.loguedUser} !!!`);
        } else {
            res.send(`No se ha iniciado session aún !!!`);
        }
    });

    app.get('/logout', (req,res) => {
        req.session.destroy((err) => {
        if (err) {
            res.status(500).send(`Something terrible just happened!!!`);
        } else {
            res.redirect('/');
        }
        })
    });

    io.on('connection', async client => {
        console.log(`Client ${client.id} connected`);

        productSocket(client, io.sockets);
        messageSocket(client, io.sockets);

        client.on('login-user', data => {
        if(data.estado == 1){
            const sendString = JSON.stringify({ user: data.usuario, html: mainPage });
            client.emit('reload', sendString);
        } else {
            client.emit('user-error', data.mensaje);
        }
        });
    });


        app.get('/info', async (req, res) => {
        
            res.send(`       
                    <p> <b>número de procesadores presentes en el servidor.:</b> ${numCpus}  </p>
                    <p> <b>Argumentos de entrada:</b>  </p>
                    <p> <b>Nombre de la plataforma (sistema operativo):</b>   </p>
                    <p> <b>Versión de node.js:</b> ${NODEV} </p>
                    <p> <b>Memoria total reservada (rss):</b> ${MEM} </p>
                    <p> <b>Path de ejecución:</b> ${PTH}</p>
                    <p> <b>Process id:</b> ${ID}</p>
                    <p> <b>Carpeta del proyecto:</b> ${FILE}</p>
                `)
            });

            app.get('/prueba', (_, res) => {
                res.send(`Servidor en puerto ${config.p}, proceso ${process.pid}, ${new Date().toISOString()}`);
            });
            

            server.listen(config.p, () => {
                console.log(`Servidor http WebSocket escuchando en el puerto ${server.address().port}, proceso ${ID}, ${new Date().toISOString()}`);
            });
            server.on("error", error => console.log(`Error en servidor ${error}`));
            
}








// server.listen(config.p, () => {
//     console.log(`Servidor http WebSocket escuchando en el puerto ${server.address().port}, proceso ${ID}, ${new Date().toISOString()}`);
// });
// server.on("error", error => console.log(`Error en servidor ${error}`));



