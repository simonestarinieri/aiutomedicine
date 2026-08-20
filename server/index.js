#!/usr/bin/env node --env-file=.env
const express = require('express');
const app = express();
const util = require('util');
const cors = require('cors');
const cron = require('./cronHandler');
const db = require('./mysqlConnector');
const barcode = require('bwip-js');
// Load cron configuration from JSON
let select = "select * from medicine";
cron.run()
app.use(cors());

app.get('/api/medicine', async (req,res)=>{
        let [data] = await db.query(select);
        for(med in data){
            console.log(data[med])
            if(data[med].codice){
                await barcode.toBuffer({
                    bcid:'code32',
                    text: data[med].codice, // Note: Code32 often requires specific checksum logic
                    scale:3,
                    height: 10,
                    includetext:true
                }).then(png=>{
                    data[med].codice=png.toString('base64');
                }).catch(err=>{
                    console.error(err);
                });
            }
        }
        res.json(data);
    }
)

app.listen(8080, ()=>{
    console.log('server listening on port 8080');
})
