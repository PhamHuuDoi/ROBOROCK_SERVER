const express = require('express');
const auth = require('../modules/auth');
const category = require('../modules/categories');
const products = require('../modules/products');
const warehouse=require('../modules/warehouse');
const branchs=require('../modules/branchs');
const inventory=require('../modules/inventories');
const router = express.Router();

router.use('/auth', auth);
router.use('/categories', category);
router.use('/products', products);
router.use('/warehouses', warehouse);
router.use('/branchs', branchs);
router.use('/inventory', inventory);
module.exports = router;
