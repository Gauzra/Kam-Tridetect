const express = require('express');
const router = express.Router();
const {
  getAllDocuments,
  getDocumentById,
  deleteDocument,
} = require('../controllers/documentController');

// GET /api/dokumen-audit -> Ambil seluruh riwayat dokumen
router.get('/dokumen-audit', getAllDocuments);

// GET /api/dokumen-audit/:id -> Ambil detail dokumen beserta teks KAM
router.get('/dokumen-audit/:id', getDocumentById);

// DELETE /api/dokumen-audit/:id -> Hapus rekaman dokumen dari database
router.delete('/dokumen-audit/:id', deleteDocument);

module.exports = router;

