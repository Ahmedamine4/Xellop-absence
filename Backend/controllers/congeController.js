import pool from '../db.js';

export const createLeaveRequest = async (req, res) => {
  try {
    const { employee_id, start_date, end_date, type, status,manager_id, first_name, last_name } = req.body;

    console.log("Reçu :", { employee_id, start_date, end_date, type, status, manager_id, first_name, last_name });

    if (!employee_id || !start_date || !end_date || !type || !status || !manager_id || !first_name || !last_name ) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    await pool.execute(
      'INSERT INTO conge (employee_id, start_date, end_date, type, status, manager_id, first_name, last_name ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [employee_id, start_date, end_date, type, status || 'En Cours' ,manager_id, first_name, last_name]
    );

    res.status(201).json({ message: 'Demande enregistrée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de la demande :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getLeaveRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM conge WHERE employee_id = ? ORDER BY start_date DESC',
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des congés :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


