const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');

const keys = require('./keys');

const appObj = express();

appObj.use(express.json());
appObj.use(express.urlencoded({ extended: true }));
appObj.use(cors());

const PORT = process.env.PORT || 5000;


const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDataBase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log('Lost pg client'));

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();


appObj.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})

