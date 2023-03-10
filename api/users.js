const Router = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { urlAtlas, database } = require('../config.js');

const bcrypt = require('bcrypt');

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
  
  const userApiRouter = new Router()

  userApiRouter.post('/login', async (req, res) => {
    const usr = req.body.user;
    const pwd = req.body.pass;

    storedUser = await getUser(usr);

    bcrypt.compare(pwd, storedUser.passwd, function(err, result) {
      if (err) {
          console.log(err);
      } else {
          if(result){
            req.session.loguedUser = usr; 
            res.json({estado: 1, usuario: req.session.loguedUser});
          } else {
            res.json({estado: 0, mensaje: "LogIn error - Intnete nuevamente"});
          }
      }
    });
});

  async function getUser(usr){
    const client = connectAtlas();
    const databaseAtlas = client.db(database);
    const collectionProductos = databaseAtlas.collection("users");
  
    let result;
    try {
        const query = { user: usr };
        result = await collectionProductos.findOne(query);
    } finally {
        await client.close();
    }
    return result; //Null si usuario no existe - Objeto usuario si se encuentra en la DB.  
  }

  async function validateUser(usr, pwd){
    const usuario = await getUser(usr);
  }

  module.exports = { userApiRouter };