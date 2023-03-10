const Router = require('express');

const { fork } = require('child_process');
const randomsApiRouter = new Router()


const longProcess = fork('./helpers/longProcess.js');


randomsApiRouter.get('/api/randoms', async (req, res) => {
    
    const{cant} = req.query;
    
    
    function randomNumbers ( min, max) {
        return Math.floor(Math.random() * ( max - min +1) + min);
    };
    var numeros = [];
    if (!cant) {
        for( let i = 1; i <= 100000 ; i++){

            let elemento = {};

            elemento.numero = randomNumbers(1, 1000);

            let indice = numeros.findIndex(x => x.numero == elemento.numero);

            if (indice == -1){
                elemento.repeticiones = 1;
                numeros.push(elemento);
            } else {
                numeros[indice].repeticiones = numeros[indice].repeticiones + 1;
            };
        };
    } else {
        for( let i = 1; i <= cant ; i++){

            let elemento = {};

            elemento.numero = randomNumbers(1, 1000);

            let indice = numeros.findIndex(x => x.numero == elemento.numero);

            if (indice == -1){
                elemento.repeticiones = 1;
                numeros.push(elemento);
            } else {
                numeros[indice].repeticiones = numeros[indice].repeticiones + 1;
            };
        };
    };
    res.json(numeros);
});

randomsApiRouter.get('/api/randoms/check', async (req, res) => {

    longProcess.send('message');

    longProcess.on('message', (msg) => {
        res.end(`la suma es  ${msg.num}`);

    })
});

module.exports = { randomsApiRouter };