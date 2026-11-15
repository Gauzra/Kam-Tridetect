const express = require('express');
const router = express.Router();
const { getOverviewStats } = require('../controllers/statsController');

// GET /api/overview-stats -> Ambil metrik agregat untuk dashboard Overview
router.get('/overview-stats', getOverviewStats);

module.exports = router;

