const {Redis} = require('ioredis');
require('dotenv').config();


const redisConnection = new Redis({
    host :process.env.REDIS_HOST,
    port : parseInt(process.env.REDIS_PORT) || 6379,
    password : process.env.REDIS_PASSWORD,
    tls:process.env.NODE_ENV === 'production' ? {} : undefined,
    maxRetriesPerRequest:null
});

console.log('Redis Host:', process.env.REDIS_HOST);
console.log('Redis Port:', process.env.REDIS_PORT);

redisConnection.on('connect',()=>{
    console.log('Redis Connected');
});
redisConnection.on('error',(err)=>{
    console.log('Redis Error',err.message)
})

module.exports = redisConnection;