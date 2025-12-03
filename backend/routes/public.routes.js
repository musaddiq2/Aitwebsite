import express from 'express';

const router = express.Router();

// Public routes (no authentication required)
router.get('/courses', (req, res) => {
  res.json({ success: true, message: 'Public courses route' });
});

router.get('/about', (req, res) => {
  res.json({ success: true, message: 'About route' });
});

export default router;

