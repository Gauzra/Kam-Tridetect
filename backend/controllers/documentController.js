const dbPool = require('../db');

/**
 * Controller untuk mengambil seluruh riwayat dokumen audit
 */
async function getAllDocuments(req, res) {
  try {
    const [rows] = await dbPool.execute(
      `SELECT id, nama_file, status_proses, skor_total, tingkat_risiko, detail_skor, created_at 
       FROM dokumen_audit 
       ORDER BY id DESC`
    );
    res.json({ status: 'success', data: rows });
  } catch (error) {
    console.error('Error fetching audit history:', error.message);
    res.status(500).json({ status: 'error', message: 'Gagal memuat riwayat audit dari basis data.' });
  }
}

/**
 * Controller untuk mengambil rincian satu dokumen audit beserta teks KAM
 */
async function getDocumentById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await dbPool.execute(
      `SELECT id, nama_file, status_proses, teks_opini, skor_total, tingkat_risiko, detail_skor, created_at 
       FROM dokumen_audit 
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'not_found',
        message: `Dokumen dengan ID #${id} tidak ditemukan.`,
      });
    }

    res.json({ status: 'success', data: rows[0] });
  } catch (error) {
    console.error(`Error fetching audit document #${id}:`, error.message);
    res.status(500).json({ status: 'error', message: 'Gagal memuat detail dokumen audit.' });
  }
}

/**
 * Controller untuk menghapus rekaman dokumen audit (Idempotent)
 */
async function deleteDocument(req, res) {
  const { id } = req.params;
  try {
    const [result] = await dbPool.execute(
      'DELETE FROM dokumen_audit WHERE id = ?',
      [id]
    );

    // Respon sukses (baik baris baru saja dihapus maupun sudah tidak ada sebelumnya)
    res.json({
      status: 'success',
      message:
        result.affectedRows > 0
          ? 'Dokumen audit berhasil dihapus dari database.'
          : 'Dokumen sudah tidak ada di arsip database.',
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error(`Error deleting audit document #${id}:`, error.message);
    res.status(500).json({ status: 'error', message: 'Gagal menghapus dokumen dari database.' });
  }
}

module.exports = {
  getAllDocuments,
  getDocumentById,
  deleteDocument,
};

