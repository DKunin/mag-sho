'use strict';
const JsonDB = require('node-json-db');
const express = require('express');
const hasha = require('hasha');
const fs = require('fs');
const app = express();
const PORT = 3738;
const db = new JsonDB('links', true);

app.get('/api/shorten', function(req, res) {
    const { url } = req.query;
    const unescaped = unescape(url);
    const hashed = hasha(unescaped, { algorithm: 'md5' });
    db.push('/' + hashed, unescaped);
    res.send(hashed);
});

app.get('/api/get', function(req, res) {
    const { hash } = req.query;
    res.redirect(db.getData('/' + hash));
});

// Clead DB every hour
setInterval(() => {
    fs.writeFileSync('./links.json', '{}', () => {});
}, 1000 * 60 * 60);

app.listen(PORT);
