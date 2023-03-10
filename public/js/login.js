const socket = io();

const btnLogin = document.querySelector("#btn-login");
btnLogin.addEventListener("click", loginUser);


async function loginUser(event) {
    event.preventDefault();
    const user = { 'user': `${document.getElementById('user').value}`,
                    'pass': `${document.getElementById('pass').value}`,
                };
    
    if(user.user == "" || user.pass == "") {
        alert("Debe completar Usuario & Contraseña");
    } else {
        await fetch('http://localhost:8080/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json() )
        .then(data => socket.emit('login-user', data) );
    }
}

socket.on('user-error', error => {
    alert(error);
});

socket.on('reload', obj => {
    btnLogin.removeEventListener("click", loginUser);
    
    const object = JSON.parse(obj);

    document.getElementById('mainHTML').innerHTML = object.html;
    document.getElementById('wellcomeUserName').innerHTML = `Bienvenido ${object.user}`;
    eventsAfterLogin();
    getFirstLoadData();
});


socket.on('redirect', function(destination) {
    window.location.href = destination;
});