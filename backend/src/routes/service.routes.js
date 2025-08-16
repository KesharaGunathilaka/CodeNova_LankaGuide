import express from 'express';
import {
  getServicesByDepartment,
  getService,
  createService
} from '../controllers/service.controller.js';

const router = express.Router();

// Public routes
router.get('/department/:departmentId', getServicesByDepartment);
router.get('/:id', getService);

// Admin routes (add authentication middleware as needed)
router.post('/', createService);

export default router;