const Pool = require('pg').Pool
require("dotenv").config();


const pool = new Pool({
  user: process.env.RDSUSER,
  host: process.env.RDShost,
  database: process.env.RDSDATABASE,
  password: process.env.RDSPASSWORD,
  port: process.env.RDSPORT,
})

module.exports = pool;
