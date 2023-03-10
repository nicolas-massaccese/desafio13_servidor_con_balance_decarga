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

const productosApiRouter = new Router()

productosApiRouter.get('/api/productos', async (req, res) => {
    const client = connectAtlas();
    const databaseAtlas = client.db(database);
    const collectionProductos = databaseAtlas.collection("productos");

    let productos=[];
    try {
        const options = {
            sort: { name: 1 }, // sort returned documents in ascending order by name (A->Z).
            projection: { _id: 1, name: 1, price: 1, photo: 1 }, // Include only fields in document.
        };
        const cursorAtlas = collectionProductos.find({},options);

        if ((await cursorAtlas.countDocuments) === 0) {
            productos.push( {error: "NO EXISTEN PRODUCTOS EN LA BASE"} );
        } else {
            await cursorAtlas.forEach(element => productos.push(element));
        }
    } finally {
        await client.close();
    }
    res.send(productos);
});


productosApiRouter.get('/api/productos/:prodName', async (req, res) => {
    const { prodName } = req.params;

    const client = connectAtlas();
    const databaseAtlas = client.db(database);
    const collectionProductos = databaseAtlas.collection("productos");

    let producto=[];
    try {
        const query = { name: prodName };
        const result = await collectionProductos.findOne(query);
        if(result == null){
            producto.push( { error: `NO EXISTE ${prodName} EN LA BASE` } );
        } else {
            producto.push(result);
        }
    } finally {
        await client.close();
    }
    res.send(producto);
});

productosApiRouter.post('/api/productos', async (req, res) => {
    res.send("ALTA de Producto");
});

productosApiRouter.post('/api/productos/:id', (req, res) => {
    res.send("ACTUALIZACION de Producto");
});

productosApiRouter.delete('/api/productos/:id', (req, res) => {
    res.send("ELIMINACION de Producto");
});


async function getProductos(){
    const client = connectAtlas();
    const databaseAtlas = client.db(database);
    const collectionProductos = databaseAtlas.collection("productos");

    let productos=[];
    try {
        const options = {
            sort: { name: 1 }, // sort returned documents in ascending order by name (A->Z).
            projection: { _id: 1, name: 1, price: 1, photo: 1 }, // Include only fields in document.
        };
        const cursorAtlas = collectionProductos.find({},options);

        if ((await cursorAtlas.countDocuments) === 0) {
            productos.push( {error: "NO EXISTEN PRODUCTOS EN LA BASE"} );
        } else {
            await cursorAtlas.forEach(element => productos.push(element));
        }
    } finally {
        await client.close();
    }
    return productos;
}

async function saveProduct(producto){
    console.log(producto);

    const client = connectAtlas();
    const databaseAtlas = client.db(database);
    const collectionProductos = databaseAtlas.collection("productos");
    try {
        const cursorAtlas = collectionProductos.insertOne(producto, function(err, res) {
            if (err) throw err;
            console.log(`Document inserted: ${producto}`);
        });
    } finally {
        await client.close();
    }
}


module.exports = { productosApiRouter, getProductos, saveProduct };