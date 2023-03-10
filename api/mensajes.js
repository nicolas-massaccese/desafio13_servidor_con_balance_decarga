const Router = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const { urlAtlas, database } = require('../config.js');

function connectAtlas(){
    const client = new MongoClient(
        urlAtlas,
        {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
        }
    );
    return client;
}

const mensajesApiRouter = new Router()

mensajesApiRouter.get('/api/mensajes', async (req, res) => {
    const client = connectAtlas();
    const databaseAtlas = client.db(database);
    const collectionMensajes = databaseAtlas.collection("mensajes");

    let mensajes=[];
    try {
        const cursorAtlas = collectionMensajes.find();

        if ((await cursorAtlas.countDocuments) === 0) {
            mensajes.push( {error: "NO EXISTEN MENSAJES EN LA BASE"} );
        } else {
            await cursorAtlas.forEach(element => mensajes.push(element));
        }
    } finally {
        await client.close();
    }
    res.send(mensajes);
});

mensajesApiRouter.get('/api/mensajes/:msgAutor', async (req, res) => {
    const { msgAutor } = req.params;

    const client = connectAtlas();
    const databaseAtlas = client.db(database);
    const collectionMensajes = databaseAtlas.collection("mensajes");

    let mensaje=[];
    try {
        const query = { autor: msgAutor };
        const result = await collectionMensajes.findOne(query);
        if(result == null){
            mensaje.push( { error: `NO EXISTE ${msgAutor} EN LA BASE` } );
        } else {
            mensaje.push(result);
        }
    } finally {
        await client.close();
    }
    res.send(mensaje);
});

mensajesApiRouter.post('/api/mensajes', (req, res) => {
    res.send("ALTA de Mensaje");
});

mensajesApiRouter.post('/api/mensajes/:id', (req, res) => {
    res.send("ACTUALIZACION de Mensaje");
});

mensajesApiRouter.delete('/api/mensajes/:id', (req, res) => {
    res.send("ELIMINACION de Mensaje");
});


async function getMensajes(){
    const client = connectAtlas();
    const databaseAtlas = client.db(database);
    const collectionProductos = databaseAtlas.collection("mensajes");

    let mensajes=[];
    try {
        const options = {
            sort: { name: 1 }, // sort returned documents in ascending order by name (A->Z).
        };
        const cursorAtlas = collectionProductos.find({},options);

        if ((await cursorAtlas.countDocuments) === 0) {
            productos.push( {error: "NO EXISTEN MENSAJES EN LA BASE"} );
        } else {
            await cursorAtlas.forEach(element => mensajes.push(element));
        }
    } finally {
        await client.close();
    }
    return mensajes;
}

async function saveMensaje(mensaje){
    let now = getTime();
    const newMsg = { timestamp: now, ...mensaje };

    const client = connectAtlas();
    const databaseAtlas = client.db(database);
    const collectionProductos = databaseAtlas.collection("mensajes");
    try {
        const cursorAtlas = collectionProductos.insertOne(newMsg, function(err, res) {
            if (err) throw err;
            console.log(`Document inserted: ${newMsg}`);
        });
    } finally {
        await client.close();
        return newMsg;
    }
}

function getTime(){
    var currentdate = new Date(); 
    var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return datetime;
}


module.exports = { mensajesApiRouter, getMensajes, saveMensaje };