const express = require('express');
const router = express.Router();

router.use('/', require('./authentication'));
router.use('/addstaff', require('./addStaff'));

module.exports = router;