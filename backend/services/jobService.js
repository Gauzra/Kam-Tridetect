const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const dbPool = require('../db');

// In-memory job store: jobId -> { id, status, progress, hasil, message }
const jobs = {};

// Batas waktu maksimum untuk seluruh proses NLP (menit)
const NLP_TIMEOUT_MS = 8 * 60 * 1000; // 8 menit

function createJobId() {
  return crypto.randomBytes(16).toString('hex');
}

function getJob(jobId) {
  return jobs[jobId] || null;
}

function registerJob(originalName) {
  const jobId = createJobId();
  jobs[jobId] = {
    id: jobId,
    nama_file: originalName,
    status: 'processing',
    progress: 10,
    hasil: null,
    message: null,
    created_at: new Date(),
  };
  return jobId;
}

/**
 * Kirim berkas PDF ke NLP engine Python (port 8000).
 * Dibungkus Promise.race() agar job gagal dengan pesan jelas
 * bila Python tidak merespons dalam NLP_TIMEOUT_MS milidetik.
 */
async function callNlpEngine(savedPath, originalName) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(savedPath), originalName);

  // Promise pengiriman aktual (Axios)
  const requestPromise = axios.post(
    'http://localhost:8000/ekstrak-dan-proses',
    formData,
    {
      headers: { ...formData.getHeaders() },
      // Beri Axios sedikit lebih lama dari batas internal agar
      // Promise.race() selalu menang lebih dulu ketika terjadi timeout.
      timeout: NLP_TIMEOUT_MS + 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  // Promise timeout internal
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `NLP engine tidak merespons setelah ${NLP_TIMEOUT_MS / 60000} menit. ` +
          'Dokumen mungkin terlalu besar atau mesin sedang kelebihan beban. ' +
          'Coba lagi dengan dokumen yang lebih kecil atau hubungi administrator.'
        )
      );
    }, NLP_TIMEOUT_MS);
  });

  // Siapa pun yang selesai lebih dulu menang
  return Promise.race([requestPromise, timeoutPromise]);
}

async function processAnalysisJob(jobId, savedPath, originalName) {
  try {
    jobs[jobId].progress = 15;
    console.log(`[JOB ${jobId}] Memulai analisis: ${originalName}`);

    // 1. Kirim berkas PDF ke Python NLP & OCR engine (Port 8000)
    const pythonResponse = await callNlpEngine(savedPath, originalName);

    jobs[jobId].progress = 75;
    const hasilPython = pythonResponse.data || {};

    // Log durasi yang dilaporkan Python (tersedia di respons)
    if (hasilPython.durasi_detik !== undefined) {
      console.log(
        `[JOB ${jobId}] NLP engine selesai dalam ${hasilPython.durasi_detik}s`
      );
    }

    // 2. Persiapkan data ekstraksi & penilaian risiko
    const statusProses = hasilPython.status || 'error';
    const teksOpini =
      hasilPython.status === 'success' && typeof hasilPython.data === 'string' && hasilPython.data
        ? hasilPython.data
        : hasilPython.message || 'Gagal memproses dokumen';

    const skorRisiko = hasilPython.skor_risiko || null;
    const skorTotal =
      skorRisiko && typeof skorRisiko.skor === 'number' ? skorRisiko.skor : null;
    const tingkatRisiko =
      skorRisiko && skorRisiko.tingkat ? skorRisiko.tingkat : null;
    const detailSkorJson = skorRisiko ? JSON.stringify(skorRisiko) : null;

    // 3. Simpan ke database MySQL
    const [result] = await dbPool.execute(
      `INSERT INTO dokumen_audit 
        (nama_file, status_proses, teks_opini, skor_total, tingkat_risiko, detail_skor) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [originalName, statusProses, teksOpini, skorTotal, tingkatRisiko, detailSkorJson]
    );

    jobs[jobId].progress = 95;

    // 4. Set job berhasil
    jobs[jobId].status = 'success';
    jobs[jobId].progress = 100;
    jobs[jobId].hasil = {
      status: 'success',
      id_dokumen: result.insertId,
      data_ekstraksi: hasilPython,
    };
    console.log(`[JOB ${jobId}] ✅ Selesai — ID dokumen: ${result.insertId}`);
  } catch (error) {
    jobs[jobId].status = 'error';
    jobs[jobId].message = error.message;
    console.error(`[JOB ERROR ${jobId}]:`, error.message);
  } finally {
    // 5. Bersihkan file upload sementara
    try {
      if (fs.existsSync(savedPath)) {
        fs.unlinkSync(savedPath);
      }
    } catch (e) {
      console.warn('Gagal menghapus file temporary:', e.message);
    }
  }
}

module.exports = {
  getJob,
  registerJob,
  processAnalysisJob,
};
