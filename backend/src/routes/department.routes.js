import express from 'express';
import {
  getDepartments,
  getDepartment,
  createDepartment
} from '../controllers/department.controller.js';

const router = express.Router();

// Public routes
router.get('/', getDepartments);
router.get('/:id', getDepartment);

// Admin routes (add authentication middleware as needed)
router.post('/', createDepartment);

export default router;