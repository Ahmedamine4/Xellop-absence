import express from 'express';
import { googleLogin } from '../controllers/authController.js';

const router = express.Router();

// Gestion CORS pour les requêtes OPTIONS (preflight)
router.options('/google-login', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': 'http://localhost:5175',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.sendStatus(200);
});

// Route POST normale
router.post('/google-login', googleLogin);

export default router;