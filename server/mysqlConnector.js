const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "localhost",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "aiutomedicine",
    waitForConnections: true,       // Queue requests if pool is full
    connectionLimit: 10,            // Max connections in the pool
    maxIdle: 10,                    // Max idle connections (default = connectionLimit)
    idleTimeout: 60000,             // Release idle connections after 60s
    queueLimit: 0,                  // Unlimited queue (set to 0)
    enableKeepAlive: true,          // Detect dead connections
    keepAliveInitialDelay: 0,       // Immediate keep-alive probes
});

module.exports = pool;