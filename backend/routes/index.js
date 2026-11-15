const express = require('express');
const router = express.Router();

const analysisRoutes = require('./analysisRoutes');
const documentRoutes = require('./documentRoutes');
const statsRoutes = require('./statsRoutes');

// Mount child routes under /api
router.use('/', analysisRoutes);
router.use('/', documentRoutes);
router.use('/', statsRoutes);

module.exports = router;

