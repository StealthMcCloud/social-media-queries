const { Client } = require('pg');
const express = require('express');

const port = 3000;

const app = express();
app.use(express.json());
const client = new Client({
    database: 'social-media'
});

app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        if (err) {
            res.status(500).send();
            return console.log(`${err}. Server having issues!`) 
        };
        res.send(result.rows);
    });
});

app.post("/users", (req, res) => {
    const queryText = 'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *';
    const values = [req.body.username, req.body.bio];
    client.query(queryText, values, (err, result) => {
        if(err) {
            res.status(500).send();
            return console.log(`${err}. stupid server.`)
        };
        res.status(201).send(result.rows[0]);
        console.log(result.rows[0]);
    });
});

app.get("/users/:id", (req, res) => {
    const idValue = req.params.id;
    const queryText = `SELECT id FROM users WHERE id=${idValue}`;
    client.query(queryText, (err, result) => {
        if(err) {
            res.status(500).send();
            return console.log(`${err}. stupid server.`);
        };
        if(result.rows == 0) {
            res.status(404).send();
            return console.log(`${err} because no user by that name was found :'(`);
        };
        res.status(201).send(result.rows[0]);
        console.log(result.rows[0]);
    });
});

app.listen(port, () => {
    client.connect();
});