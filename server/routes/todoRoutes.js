import express from 'express';
import { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo,
  updatePositions,
  clearCompleted,
  getTodosByCategory,
  getProductivityStats
} from '../controllers/todoController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Base todo operations
router.get('/', protect, getTodos);
router.post('/', protect, createTodo);
router.put('/:id', protect, updateTodo);
router.delete('/:id', protect, deleteTodo);

// Additional operations
router.post('/positions', protect, updatePositions);
router.delete('/completed', protect, clearCompleted);
router.get('/category/:category', protect, getTodosByCategory);
router.get('/stats', protect, getProductivityStats);

export default router;