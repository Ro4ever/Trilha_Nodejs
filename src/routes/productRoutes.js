// src/routes/productRoutes.js
const express = require('Router'); // Corrigido para Router
const router = express.Router();
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// Rotas protegidas para administradores
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, ProductController.createProduct);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, ProductController.updateProduct);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, ProductController.deleteProduct);

module.exports = router;