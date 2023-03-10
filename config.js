const path = require ('path');

require('dotenv').config()
const process = require('process')

const {  mongoUser, mongoPass, mongoDb, mongoUri  } = require('./enviroment.js');

const user= mongoUser;
const pass = mongoPass;
const database = mongoDb;
const urlAtlas = mongoUri;


module.exports = { urlAtlas, database,
    PLAT: process.argv,
    S: process.platform,
    NODEV: process.version,
    MEM: process.memoryUsage.rss(),
    PTH: process.execPath,
    ID: process.pid,
    FILE: process.cwd(),
    
};

