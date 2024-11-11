const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');

const productController = require('../controller/product');

router.post('', isAuth, productController.addProduct);

router.get('', isAuth, productController.getAll);

router.get('/:id', isAuth, productController.getById);

router.put('/:id', isAuth, productController.updateProduct);

router.delete('/:id', isAuth, productController.deleteById);

router.delete('', productController.deleteAll, isAuth);

module.exports = router;
