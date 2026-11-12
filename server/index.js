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

// GET /api/medicine - list all medicines
app.get('/api/medicine', async (req,res)=>{
    const select = "select * from medicine";
    let [data] = await db.query(select);
    console.log(data);
    res.json(data);
})

// POST /api/medicine - insert a new medicine
app.post('/api/medicine', async (req,res)=>{
    const { nome, nome_alternativo, quantità, codice, istruzione, alberto, dina } = req.body;
    if (!nome || !quantità) {
      return res.status(400).json({ error: 'Nome e quantità sono obbligatori.' });
    }
    try {
      const values = [nome, nome_alternativo, String(quantità), JSON.stringify(istruzione), codice, alberto, dina];
      const sql = 'INSERT INTO `medicine` (`id`, `nome`, `nome_alternativo`, `quantità`, `istruzione`, `codice`, `alberto`, `dina`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)';
      const result = await db.query(sql, [null, ...values]);
      res.json(result);
    } catch(e){
      res.status(500).json({ error: e.message });
    }
})

// POST /api/edit - update an existing medicine
app.post('/api/edit',async (req,res)=>{
    const update = 'UPDATE medicine SET nome=?, nome_alternativo=?, quantità=?, istruzione=?, codice=?, alberto=?, dina=? WHERE id=?';
    console.log(update);
    let [result] = await db.query(update, [req.body.nome, req.body.nome_alternativo, req.body.quantità, req.body.istruzione, req.body.codice, req.body.alberto, req.body.dina, req.body.id]);
    res.json(result);
})

app.listen(8080, ()=>{
    console.log('server listening on port 8080');
})