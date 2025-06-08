import { OAuth2Client } from 'google-auth-library';
import pool from '../db.js';

const client = new OAuth2Client(process.env.CLIENT_ID);

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        console.log(`Utilisateur connecté: ${email} (${name})`);

        const [rows] = await pool.execute(
            'SELECT role FROM users WHERE email = ?', [email]
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: 'Email non autorisé' });
        }

        const role = rows[0].role;

        res.json({
            message: 'Login successful',
            email,
            name,
            role,
        });
    } catch (error) {
        console.error('Erreur de vérification du token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};