import express from 'express';
import { createLeaveRequest, getLeaveRequestsByUser } from '../controllers/congeController.js';
import pool from '../db.js';
import { updateLeave } from '../controllers/congeController.js';
import { updateLeaveStatus } from '../controllers/congeController.js';
import { DemandeByUser } from '../controllers/congeController.js';
import { getLeaveStatus } from '../controllers/congeController.js';
import { getPaginatedLeavesByUser } from '../controllers/congeController.js';
import { getPaginatedLeavesForManager } from '../controllers/congeController.js';
import { getAllEmployeesForManager } from '../controllers/congeController.js';


const router = express.Router();

router.post('/', createLeaveRequest);

router.get('/:userId', getLeaveRequestsByUser);

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM conge WHERE id = ?", [req.params.id]);
    res.json({ message: "Leave deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/paginated/:userId', getPaginatedLeavesByUser);
router.get('/manager/paginated/:managerId', getPaginatedLeavesForManager);
router.get('/manager/allnames/:userId', getAllEmployeesForManager);


router.put('/:id', updateLeave);

router.get('/one/:userId', DemandeByUser);
router.get('/two/:id', getLeaveStatus );
router.put('/one/:id', updateLeaveStatus);


export default router;





