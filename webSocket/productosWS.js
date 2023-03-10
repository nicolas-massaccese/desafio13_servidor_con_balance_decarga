const { getProductos, saveProduct } = require('../api/productos.js');

async function productSocket(socket, sockets) {

    socket.on('loadProductos', async productos => {
        socket.emit('products', await getProductos());
    });

    socket.on('new-product', async producto => {
        const prodAdded = await saveProduct(producto);
        sockets.emit('product-added', producto);
    })
}

module.exports = { productSocket };