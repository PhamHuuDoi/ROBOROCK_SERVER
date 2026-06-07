const express = require('express');
const auth = require('../modules/auth');


const router = express.Router();

router.use('/auth', auth);

module.exports = router;
