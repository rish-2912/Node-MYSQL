const mysql=require('mysql2');


const pool=mysql.createPool({
    host:'localhost',
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB
});


module.exports=pool;