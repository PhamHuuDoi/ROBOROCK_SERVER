const express = require('express');
const auth = require('../modules/auth');
const category = require('../modules/categories');
const products = require('../modules/products');
const warehouse=require('../modules/warehouse');
const router = express.Router();

router.use('/auth', auth);
router.use('/categories', category);
router.use('/products', products);
router.use('/warehouses', warehouse);

module.exports = router;
