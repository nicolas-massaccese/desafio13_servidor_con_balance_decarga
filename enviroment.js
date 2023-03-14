const yargs = require('yargs/yargs')(process.argv.slice(2));

const mongoUser = process.env.MONGO_USER
const mongoPass = process.env.MONGO_PASS
const mongoDb = process.env.MONGO_DB
const mongoUri = process.env.MONGO_URI

const a = 8050;
const b = 8051;
const c = 8052;
const d = 8053;

const config = yargs.alias(

    {
        p: 'puerto',
        m: 'modo'
    },
)
.default({
    puerto: 8080,
    modo: 'CLUSTER'
}).argv; 

console.log(JSON.stringify(config, null, 2));

module.exports = { mongoUser, mongoPass, mongoDb, mongoUri, config, a, b, c, d };
