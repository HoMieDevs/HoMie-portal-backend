const express = require('express');
const router = express.Router();

router.use('/auth', require('./authentication'));
router.use('/crew', require('./protected'));

module.exports = router;