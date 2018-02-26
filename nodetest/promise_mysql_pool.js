"use strict";

//import mysql from 'mysql2/promise';
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '192.168.3.120',
    user: 'root',
    password: 'master'
});
exports.getConnection = () => pool.getConnection();

//export {getConnection}