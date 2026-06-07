const express = require('express');
const auth = require('../modules/auth');
const category = require('../modules/categories');
const products = require('../modules/products');

const router = express.Router();

router.use('/auth', auth);
router.use('/categories', category);
router.use('/products', products);
module.exports = router;
