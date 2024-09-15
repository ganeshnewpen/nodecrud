// config/db.js

const mysql = require('mysql2');

// Create a connection pool (recommended for multiple connections)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root2',        // Replace with your MySQL username
  password: 'GANESH2000',  // Replace with your MySQL password
  database: 'nodecruddb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool to use in other modules
module.exports = pool.promise();
