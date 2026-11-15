const jobService = require('../services/jobService');

/**
 * Controller untuk pengajuan analisis berkas PDF baru (asinkron)
 */
async function submitAnalysis(req, res) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ status: 'error', message: 'Berkas PDF tidak ditemukan dalam unggahan.' });
  }

  const originalName = file.originalname || 'dokumen_tanpa_nama.pdf';
  const savedPath = file.path;

  // Daftarkan jobId di in-memory job store
  const jobId = jobService.registerJob(originalName);

  // Kembalikan HTTP 202 Accepted segera ke klien
  res.status(202).json({
    status: 'processing',
    jobId,
    message: 'Dokumen diterima dan sedang diproses di background.',
  });

  // Jalankan proses pemindaian OCR & NLP di latar belakang (non-blocking)
  jobService.processAnalysisJob(jobId, savedPath, originalName);
}

/**
 * Controller untuk memeriksa progres pemrosesan dokumen berdasarkan jobId
 */
function getAnalysisStatus(req, res) {
  const { jobId } = req.params;
  const job = jobService.getJob(jobId);

  if (!job) {
    return res.status(404).json({
      status: 'not_found',
      message: 'ID Pekerjaan analisis tidak ditemukan atau telah kedaluwarsa.',
    });
  }

  res.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    message: job.message,
    hasil: job.hasil,
  });
}

module.exports = {
  submitAnalysis,
  getAnalysisStatus,
};

