process.on('message', () => {

    function randomNumbers ( min, max){
        return Math.floor(Math.random() * ( max - min +1) + min);
    }

    var numeros = [];

        for( let i = 1; i <= 500000000 ; i++){

            let elemento = {};

            elemento.numero = randomNumbers(1, 1000);

            let indice = numeros.findIndex(x => x.numero == elemento.numero)

            if(indice == -1){
                elemento.repeticiones = 1;
                numeros.push(elemento);
            }	
            else
                numeros[indice].repeticiones = numeros[indice].repeticiones + 1;

        }

    res.json(numeros);
});