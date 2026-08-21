#!/usr/bin/env node
const express = require('express');
const app = express();
const util = require('util');
const cors = require('cors');
const cron = require('./cronHandler');
const db = require('./mysqlConnector');
// Load cron configuration from JSON
cron.run()
app.use(cors());
app.use(express.json());

app.get('/api/medicine', async (req,res)=>{
        const select = "select * from medicine";
        let [data] = await db.query(select);
        console.log(data);
        res.json(data);
    }
)

app.post('/api/edit',async (req,res)=>{
    const update = 'update medicine set quantità = '+req.body.amount+' where id = '+req.body.id;
    console.log(update)
    let [result] = await db.query(update);
    res.json(result);
})

app.listen(8080, ()=>{
    console.log('server listening on port 8080');
})
