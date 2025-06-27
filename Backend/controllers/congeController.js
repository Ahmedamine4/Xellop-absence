import pool from '../db.js';
import sendEmail  from '../utils/sendEmail.js';

export const createLeaveRequest = async (req, res) => {
  try {
    const { employee_id, start_date, end_date, type, status,manager_id, first_name, last_name, email } = req.body;
    const date_soumission = new Date();
 
    console.log("Reçu :", { employee_id, start_date, end_date, type, status, manager_id, first_name, last_name , email});

    if (!employee_id || !start_date || !end_date || !type || !status || !manager_id || !first_name || !last_name ) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    await pool.execute(
      'INSERT INTO conge (employee_id, start_date, end_date, type, status, manager_id, first_name, last_name, date_soumission, email ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [employee_id, start_date, end_date, type, status || 'En Cours' ,manager_id, first_name, last_name, date_soumission, email]
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
    // 1. Récupérer la demande
    const [rows] = await pool.query("SELECT * FROM conge WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    const { start_date, end_date, employee_id } = rows[0];
    const start = new Date(start_date);
    const end = new Date(end_date);
    const nbJours = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // 2. Récupérer le solde + email du collaborateur
    const [[collab]] = await pool.query(
      "SELECT annual_leave_balance, email, first_name FROM collaborateurs WHERE employee_id = ?",
      [employee_id]
    );

    if (!collab) {
      return res.status(404).json({ message: "Collaborateur non trouvé" });
    }

    const { annual_leave_balance, email, first_name } = collab;

    if (status === "Validé" && annual_leave_balance < nbJours) {
      return res.status(400).json({
        message: `Solde insuffisant. Solde actuel : ${annual_leave_balance}, jours demandés : ${nbJours}`
      });
    }

    // 3. Mettre à jour le statut
    const [result] = await pool.query(
      "UPDATE conge SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Échec de la mise à jour" });
    }

    // 4. Si Validé → déduire solde + email
    if (status === "Validé") {
      await pool.query(
        "UPDATE collaborateurs SET annual_leave_balance = annual_leave_balance - ? WHERE employee_id = ?",
        [nbJours, employee_id]
      );

      if (email) {
        const subject = "Statut de votre demande de congé";
        const message = `Bonjour ${first_name},\n\nVotre demande de congé a été validée.\n\nCordialement,\nL'équipe RH`;

        await sendEmail(email, subject, message);
      } else {
        console.warn("Aucune adresse email trouvée pour envoyer l’email.");
      }
    }

    // 5. Si Refusé → envoyer email uniquement
    if (status === "Refusé" && email) {
      const subject = "Statut de votre demande de congé";
      const message = `Bonjour ${first_name},\n\nVotre demande de congé a été refusée.\n\nCordialement,\nL'équipe RH`;

      await sendEmail(email, subject, message);
    }

    res.status(200).json({ message: "Statut mis à jour avec succès" });

  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error);
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
  const filterName = req.query.filterName || null;
  try {
    let baseQuery = `
      SELECT * FROM conge 
      WHERE manager_id = ? AND status = 'En Cours'
    `;
    let countQuery = `
      SELECT COUNT(*) as total FROM conge 
      WHERE manager_id = ? AND status = 'En Cours'
    `;
    const params = [managerId];
    const countParams = [managerId];

    if (filterName && filterName !== "All") {
      baseQuery += " AND employee_id = ?";
      countQuery += " AND employee_id = ?";
      params.push(filterName);
      countParams.push(filterName);
    }

    baseQuery += ` ORDER BY date_soumission DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [data] = await pool.query(baseQuery, params);
    const [[{ total }]] = await pool.query(countQuery, countParams);

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
      `SELECT DISTINCT col.employee_id, col.first_name, col.last_name
       FROM conge c
       JOIN collaborateurs col ON c.employee_id = col.employee_id
       WHERE c.manager_id = ? AND c.status = 'En Cours'`,
      [userId]
    );

    res.json(results);
  } catch (error) {
    console.error("Erreur récupération employés:", error);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};






