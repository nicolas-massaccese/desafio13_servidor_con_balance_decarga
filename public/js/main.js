let btnProduct;
let btnMessage;
let btnLogout;
let btnQuienSoy;

function eventsAfterLogin(){
  btnProduct = document.querySelector("#btn-newProduct");
  btnProduct.addEventListener("click", addNewProduct);

  btnMessage = document.querySelector("#btn-newMessage");
  btnMessage.addEventListener("click", addNewMessage);

  btnLogout = document.querySelector("#btn-logout");
  btnLogout.addEventListener("click", logout);

  btnQuienSoy = document.querySelector("#btn-quienSoy");
  btnQuienSoy.addEventListener("click", testSession);
}

function testSession(){
  //window.location.href = '/quiensoy';
  window.open('/quiensoy', '_blank');
}

function getFirstLoadData(){
  fetch('http://localhost:8080/api/productos')
    .then(response => response.json())
    .then(data => {
      let html = ""; //document.getElementById('productList').innerHTML;
      data.forEach(element => {
        html = `${html}
        <div class="table-line">
        <p class="nameTb">${element.name}</p>
        <p class="priceTd">$ ${element.price}</p>
        <img src="${element.photo}" alt="${element.name}">
        </div>`;
      });
      document.getElementById('productList').innerHTML = `${html}`;
    })
    .catch(error => console.error(error));
  
  fetch('http://localhost:8080/api/mensajes')
    .then(response => response.json())
    .then(data =>  {  
      let html = ""; //document.getElementById('chatContent').innerHTML;
      data.forEach(message => {
      html += `<div class="chatLine" li><p class="user">${message.autor}&nbsp;</p> <p class="time">[ ${message.timestamp} ] :&nbsp;</p> <p class="msg">${message.mensaje}</p></div>`
      });
      document.getElementById('chatContent').innerHTML = `${html}`;
    })
    .catch(error => console.error(error));
}

function logout(event){
  event.preventDefault();
  window.location.href = '/logout';
}

function addNewProduct(event) {
  event.preventDefault();
  const product = {
    name: document.getElementById('nombre').value,
    price: document.getElementById('precio').value,
    photo: document.getElementById('foto').value
  };
  socket.emit('new-product', product);
}

function addNewMessage(event) {
  event.preventDefault();
  const message = {
    autor: document.getElementById('usuario').value,
    mensaje: document.getElementById('mensaje').value
  };
  socket.emit('new-message', message);
}

// -------------- CHAT -----------------------------------------

socket.on('messages', data => {
  let html = document.getElementById('chatContent').innerHTML;

  data.forEach(message => {
    html += `<div class="chatLine" li><p class="user">${message.autor}&nbsp;</p> <p class="time">[ ${message.timestamp} ] :&nbsp;</p> <p class="msg">${message.mensaje}</p></div>`
  });

  document.getElementById('chatContent').innerHTML = `${html}`;
});

socket.on('message-added', message => {
  let html = document.getElementById('chatContent').innerHTML;

  html += `<div class="chatLine" li><p class="user">${message.autor}</p> <p class="time">[ ${message.timestamp} ] : </p> <p class="msg">${message.mensaje}</p></div>`;

  document.getElementById('chatContent').innerHTML = `${html}`;
});



// -------------- PRODUCTOS -----------------------------------------

socket.on('products', data => {
  let html = document.getElementById('productList').innerHTML;

  data.forEach(element => {
    html = `${html}
    <div class="table-line">
    <p class="nameTb">${element.name}</p>
    <p class="priceTd">$ ${element.price}</p>
    <img src="${element.photo}" alt="${element.name}">
    </div>`;
  });

  document.getElementById('productList').innerHTML = `${html}`;
});

socket.on('product-added', message => {
  let html = document.getElementById('productList').innerHTML;

  html += `<div class="table-line">
  <p class="nameTb">${message.name}</p>
  <p class="priceTd">$ ${message.price}</p>
  <img src="${message.photo}" alt="${message.name}">
  </div>`;
  
  document.getElementById('productList').innerHTML = `${html}`;
});
