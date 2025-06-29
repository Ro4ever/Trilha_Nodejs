// src/routes/feedbackRoutes.js
const express = require('Router'); // Corrigido para Router
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para usuários comuns enviarem feedback
router.post('/products/:id/feedback', authMiddleware.verifyToken, FeedbackController.addFeedbackToProduct);

// Rotas para administradores
router.get('/admin', authMiddleware.verifyToken, authMiddleware.isAdmin, FeedbackController.getAllFeedbacks);
router.put('/admin/:id/moderate', authMiddleware.verifyToken, authMiddleware.isAdmin, FeedbackController.moderateFeedback);
router.delete('/admin/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, FeedbackController.deleteFeedback);

module.exports = router;