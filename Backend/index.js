const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/utilisateurs', (req, res) => {
  db.query('SELECT * FROM utilisateur', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.listen(3000, () => console.log('🚀 Serveur Express démarré sur http://localhost:3000'));
