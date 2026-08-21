#!/usr/bin/env node
const express = require('express');
const app = express();
const util = require('util');
const cors = require('cors');
const cron = require('./cronHandler');
const db = require('./mysqlConnector');
// Load cron configuration from JSON
let select = "select * from medicine";
cron.run()
app.use(cors());

app.get('/api/medicine', async (req,res)=>{
        let [data] = await db.query(select);
        console.log(data);
        res.json(data);
    }
)

app.listen(8080, ()=>{
    console.log('server listening on port 8080');
})
