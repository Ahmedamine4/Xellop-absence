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
        const first_name = payload.given_name;    // prénom
        const last_name = payload.family_name;    // nom de famille
        
        console.log(`Utilisateur connecté: ${email} (${first_name} ${last_name})`);

        // Vérifie le rôle dans ta table collaborateurs
        const [rows] = await pool.execute(
            `SELECT employee_id, first_name, last_name, email, manager_id, annual_leave_balance, role 
             FROM collaborateurs 
             WHERE email = ?`, 
            [email]
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: 'Email non autorisé' });
        }

        // Extraction des données de l'utilisateur
        const user = rows[0];
        const role = user.role;
        const manager_id = user.manager_id;
        const annual_leave_balance = user.annual_leave_balance;

        // Envoie la réponse avec toutes les informations
        res.json({
            message: 'Login successful',
            email,
            first_name:  payload.given_name, 
            last_name:  payload.family_name,
            role,
            manager_id,
            annual_leave_balance,
            employee_id: user.employee_id
        });
    } catch (error) {
        console.error('Erreur de vérification du token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
