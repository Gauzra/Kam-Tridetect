const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { submitAnalysis, getAnalysisStatus } = require('../controllers/analysisController');

// POST /api/analisis-dokumen -> Upload PDF dan jalankan pemrosesan asinkron
router.post('/analisis-dokumen', upload.single('file_pdf'), submitAnalysis);

// GET /api/analisis-status/:jobId -> Polling status dan progres pekerjaan
router.get('/analisis-status/:jobId', getAnalysisStatus);

module.exports = router;

