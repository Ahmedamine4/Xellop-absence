import express from 'express';
import { createLeaveRequest, getLeaveRequestsByUser } from '../controllers/congeController.js';
import pool from '../db.js';
import { updateLeave } from '../controllers/congeController.js';
import { updateLeaveStatus } from '../controllers/congeController.js';

const router = express.Router();

router.post('/', createLeaveRequest);
router.get('/:userId', getLeaveRequestsByUser);
// Supprimer une demande
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM conge WHERE id = ?", [req.params.id]);
    res.json({ message: "Leave deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', updateLeave);

router.get('/one/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM conge WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Demande non trouvée' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.put('/one/:id', updateLeaveStatus);


export default router;





