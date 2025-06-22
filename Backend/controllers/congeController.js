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
export const DemandeByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM conge WHERE manager_id = ? ORDER BY start_date DESC',
      [userId]
    );
    console.log("Requête de congés pour l'utilisateur :", userId, "Résultats :", rows);

    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des congés :', error);
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
export const getLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM conge WHERE id = ?',
      [id]
    );
    console.log("Requête de congés pour l'ID :", id, "Résultats :", rows);

    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des congés :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE conge SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    res.status(200).json({ message: "Statut mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Erreur serveur" });
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

export const getPaginatedLeavesByUser = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;


  try {
    const [data] = await pool.query(`
      SELECT * FROM conge 
      WHERE employee_id = ?
      ORDER BY date_soumission DESC 
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);

    const [[{ total }]] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM conge 
      WHERE employee_id = ?
    `, [userId]);

    res.json({
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la pagination' });
  }
};

export const getPaginatedLeavesForManager = async (req, res) => {
  const { managerId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 4;
  const offset = (page - 1) * limit;

  try {
    const [data] = await pool.query(
      `SELECT * FROM conge 
       WHERE manager_id = ? AND status = 'En Cours'
       ORDER BY date_soumission DESC
       LIMIT ? OFFSET ?`,
      [managerId, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM conge 
       WHERE manager_id = ? AND status = 'En Cours'`,
      [managerId]
    );

    res.json({
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    console.error("Erreur pagination manager :", err);
    res.status(500).json({ error: 'Erreur lors de la pagination manager' });
  }
};

export const getAllEmployeesForManager = async (req, res) => {
  const { userId } = req.params;

  try {
    const [results] = await pool.query(
      `SELECT DISTINCT employee_id, first_name, last_name
       FROM conge
       WHERE manager_id = ? AND status = 'En Cours'`,
      [userId]
    );

    res.json(results);
  } catch (error) {
    console.error("Erreur récupération employés:", error);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};





