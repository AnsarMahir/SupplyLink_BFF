const express = require('express');
const cors = require('cors');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products/', productController.getAllProducts);
//router.get('/categories',productController.getCategories)
router.get('/products/:id', productController.getProductById);
router.post('/products/', productController.createProduct);
router.patch('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
