const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../Middleware/authMiddleware');
const productrouter = express.Router();


// Create a new product (POST /api/products)
productrouter.post('/create', authMiddleware, productController.createProduct);

// Get all products (GET /api/products)
productrouter.get('/all', authMiddleware, productController.getAllProducts);

// Get a specific product by ID (GET /api/products/:productId)
productrouter.get('/:productId', authMiddleware, productController.getProductById);

// Update a specific product by ID (PUT /api/products/:productId)
productrouter.put('/:productId', authMiddleware, productController.updateProduct);

// Delete a specific product by ID (DELETE /api/products/:productId)
productrouter.delete('/:productId', authMiddleware, productController.deleteProduct);

module.exports = productrouter;
