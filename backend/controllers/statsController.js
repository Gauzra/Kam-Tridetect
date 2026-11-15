const dbPool = require('../db');

/**
 * Controller untuk menghitung statistik ringkasan dashboard Overview
 */
async function getOverviewStats(req, res) {
  try {
    const [kpiRows] = await dbPool.execute(`
      SELECT 
        COUNT(*) as total_dokumen,
        SUM(CASE WHEN skor_total >= 60 THEN 1 ELSE 0 END) as risiko_tinggi,
        SUM(CASE WHEN skor_total >= 30 AND skor_total < 60 THEN 1 ELSE 0 END) as risiko_sedang,
        SUM(CASE WHEN skor_total < 30 AND skor_total IS NOT NULL THEN 1 ELSE 0 END) as risiko_rendah,
        SUM(CASE WHEN skor_total IS NULL THEN 1 ELSE 0 END) as belum_dinilai,
        AVG(skor_total) as rata_rata_skor
      FROM dokumen_audit
    `);

    const [recentRows] = await dbPool.execute(`
      SELECT id, nama_file, status_proses, skor_total, tingkat_risiko, created_at 
      FROM dokumen_audit 
      ORDER BY id DESC 
      LIMIT 5
    `);

    const kpi = kpiRows[0] || {};
    res.json({
      status: 'success',
      data: {
        total_dokumen: Number(kpi.total_dokumen || 0),
        risiko_tinggi: Number(kpi.risiko_tinggi || 0),
        risiko_sedang: Number(kpi.risiko_sedang || 0),
        risiko_rendah: Number(kpi.risiko_rendah || 0),
        belum_dinilai: Number(kpi.belum_dinilai || 0),
        rata_rata_skor:
          kpi.rata_rata_skor != null ? Number(Number(kpi.rata_rata_skor).toFixed(1)) : null,
        recent_analyses: recentRows,
      },
    });
  } catch (error) {
    console.error('Error fetching overview stats:', error.message);
    res.status(500).json({ status: 'error', message: 'Gagal memuat statistik ringkasan overview.' });
  }
}

module.exports = {
  getOverviewStats,
};

