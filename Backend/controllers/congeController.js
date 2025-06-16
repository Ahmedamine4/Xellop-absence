import pool from '../db.js';

export const createLeaveRequest = async (req, res) => {
  try {
    const { employee_id, start_date, end_date, type, status,manager_id, first_name, last_name } = req.body;
    const date_soumission = new Date();

    console.log("Reçu :", { employee_id, start_date, end_date, type, status, manager_id, first_name, last_name });

    if (!employee_id || !start_date || !end_date || !type || !status || !manager_id || !first_name || !last_name ) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    await pool.execute(
      'INSERT INTO conge (employee_id, start_date, end_date, type, status, manager_id, first_name, last_name, date_soumission ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [employee_id, start_date, end_date, type, status || 'En Cours' ,manager_id, first_name, last_name, date_soumission]
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
export const updateLeave = async (req, res) => {
  const { id } = req.params;
  const { start_date, end_date, type, status } = req.body;
  
    console.log("Données reçues pour la mise à jour :", { id, start_date, end_date, type, status });

  try {
    const [result] = await pool.query(
      `UPDATE conge SET start_date = ?, end_date = ?, type = ?, status = ? WHERE id = ?`,
      [start_date, end_date, type, status, id]
    );
    

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    res.status(200).json({ message: "Demande modifiée avec succès" });
  } catch (error) {
    console.error("Erreur dans updateLeave :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



