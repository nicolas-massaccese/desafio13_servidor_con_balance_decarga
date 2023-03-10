const { getMensajes, saveMensaje } = require('../api/mensajes.js');

async function messageSocket(socket, sockets) {

    socket.on('loadMessages', async productos => {
        socket.emit('messages', await getMensajes());
    });

    socket.on('new-message', async message => {
        const msgAdded = await saveMensaje(message);
        sockets.emit('message-added', msgAdded);
    })
}

module.exports = { messageSocket };