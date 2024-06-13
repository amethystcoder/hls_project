const sql = require('mysql');
require('dotenv').config()

let connectionPool = sql.createPool({
    connectionLimit:20,
    host:"localhost",
    user:"root",
    password:"",
    database: "videodb",
    waitForConnections:true,
    flags:'IGNORE_SPACE'
});

module.exports = connectionPool
