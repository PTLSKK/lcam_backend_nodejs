const express = require('express');
const configController = require('../controllers/configController');

const router = express.Router();

router.route('/:guid').get(configController.getConfig);
router.route('/').post(configController.setConfig);

module.exports = router;
