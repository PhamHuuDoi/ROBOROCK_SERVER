const express = require('express');
const auth = require('../modules/auth');
const category = require('../modules/categories');

const router = express.Router();

router.use('/auth', auth);
router.use('/categories', category);
module.exports = router;
