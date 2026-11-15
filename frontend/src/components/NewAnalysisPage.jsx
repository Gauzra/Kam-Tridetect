import { useState, useRef } from 'react'
import axios from 'axios'
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiRotateCcw,
  FiCpu,
  FiCopy,
  FiCheck,
  FiLayers,
  FiDatabase,
  FiHash,
  FiCode,
} from 'react-icons/fi'
import { LABEL_DIMENSI, WARNA_TINGKAT } from '../constants/dimensions'
import { useToast } from '../context/NotificationContext'
import './NewAnalysisPage.css'

export default function NewAnalysisPage({ onGoToHistory }) {
  const toast = useToast()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasil, setHasil] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('hasil_analisis')) || null
    } catch {
      return null
    }
  })
  const [error, setError] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [copied, setCopied] = useState(false)

  const fileInputRef = useRef(null)
  const resultRef = useRef(null)

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      const msg = 'Hanya dokumen dengan format .PDF yang didukung oleh sistem.'
      setError(msg)
      toast.warning(msg)
      return
    }
    setFile(selectedFile)
    setError(null)
    setHasil(null)
    setProgress(0)
    sessionStorage.removeItem('hasil_analisis')
    toast.info(`Berkas "${selectedFile.name}" siap dianalisis.`)
  }

  const startPolling = (jobId) => {
    const pollInterval = 2000
    const poll = async () => {
      try {
        const res = await axios.get(`/api/analisis-status/${jobId}`, { timeout: 10000 })
        const job = res.data

        if (job.status === 'success') {
          setProgress(100)
          setHasil(job.hasil)
          sessionStorage.setItem('hasil_analisis', JSON.stringify(job.hasil))
          setLoading(false)
          toast.success('Analisis dokumen & evaluasi 9 dimensi risiko selesai!')
          setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' })
          }, 250)
          return
        }

        if (job.status === 'error') {
          const msg = job.message || 'Gagal memproses dokumen audit.'
          setError(msg)
          toast.error(msg)
          setLoading(false)
          setProgress(0)
          return
        }

        setProgress(job.progress || 0)
        setTimeout(poll, pollInterval)
      } catch (err) {
        setTimeout(poll, pollInterval)
      }
    }
    poll()
  }

  const handleUpload = async () => {
    if (!file) {
      const msg = 'Silakan pilih berkas PDF Laporan Keuangan terlebih dahulu.'
      setError(msg)
      toast.warning(msg)
      return
    }

    setLoading(true)
    setError(null)
    setProgress(10)

    const formData = new FormData()
    formData.append('file_pdf', file)

    try {
      const response = await axios.post('/api/analisis-dokumen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })
      const { jobId } = response.data
      startPolling(jobId)
    } catch (err) {
      console.error('UPLOAD ERROR:', err)
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Terjadi kendala saat mengirim dokumen ke server.'
      setError(msg)
      toast.error(msg)
      setLoading(false)
      setProgress(0)
    }
  }

  const handleReset = () => {
    setFile(null)
    setHasil(null)
    setError(null)
    setProgress(0)
    sessionStorage.removeItem('hasil_analisis')
    toast.info('Pilihan berkas berhasil dibatalkan.')
  }

  const handleCopy = () => {
    const teks = hasil?.data_ekstraksi?.data
    if (!teks) return
    navigator.clipboard.writeText(teks)
    setCopied(true)
    toast.success('Teks Hal Audit Utama (KAM) berhasil disalin ke clipboard.')
    setTimeout(() => setCopied(false), 2000)
  }

  const getStageDescription = (p) => {
    if (p < 25) return 'Mengunggah dan memverifikasi integritas berkas PDF...'
    if (p < 60) return 'Menyisir halaman, menjalankan ekstraksi teks dan OCR Tesseract 300 DPI...'
    if (p < 85) return 'Menerapkan preprocessing NLP: Tokenisasi dan stemming kata dasar Sastrawi...'
    if (p < 100) return 'Menghitung kepadatan kata kunci dan skor 9 dimensi risiko Triple EM...'
    return 'Analisis selesai. Menyimpan hasil terstruktur ke database MySQL...'
  }

  const skor = hasil?.data_ekstraksi?.skor_risiko
  const tingkat = skor?.tingkat || 'RENDAH'
  const styleTingkat = WARNA_TINGKAT[tingkat] || WARNA_TINGKAT.RENDAH
  const frekuensi = skor?.frekuensi_per_dimensi || {}
  const totalKeywords = skor?.total_kemunculan_kata_risiko ?? 0
  const maxFreq = Object.values(frekuensi).length ? Math.max(...Object.values(frekuensi), 1) : 1

  return (
    <div className="analysis-container">
      {/* PAGE HEADER */}
      <div className="analysis-header">
        <div className="analysis-header-text">
          <h1 className="analysis-title">Analisis Dokumen Baru</h1>
          <p className="analysis-subtitle">
            Unggah berkas Laporan Keuangan Tahunan (PDF). Sistem akan memindai lembar Hal Audit Utama (KAM)
            menggunakan Hybrid OCR &amp; NLP Bahasa Indonesia untuk mengevaluasi 9 dimensi risiko manipulasi laba.
          </p>
        </div>
      </div>

      {/* ERROR NOTICE */}
      {error && (
        <div className="analysis-error-banner">
          <div className="error-banner-left">
            <FiAlertCircle className="error-icon" />
            <div className="error-message">
              <strong>Terjadi Kendala:</strong> {error}
            </div>
          </div>
          <button type="button" className="btn-dismiss-error" onClick={() => setError(null)}>
            Tutup
          </button>
        </div>
      )}

      {/* UPLOAD DROPZONE CARD */}
      <div className="analysis-card upload-card">
        <div
          className={`analysis-dropzone ${isDragOver ? 'is-dragover' : ''} ${
            file ? 'has-file' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileChange(e.dataTransfer.files[0])
            }
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            disabled={loading}
          />

          <div className="dropzone-icon-circle">
            {file ? <FiFileText /> : <FiUploadCloud />}
          </div>

          {file ? (
            <div className="file-info-preview">
              <span className="file-name-bold">{file.name}</span>
              <span className="file-size-badge">
                Ukuran berkas: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
              <span className="file-switch-hint">Klik di sini jika ingin mengganti berkas</span>
            </div>
          ) : (
            <div className="dropzone-text-block">
              <span className="dropzone-main-title">Seret &amp; Letakkan Berkas PDF di Sini</span>
              <span className="dropzone-sub-title">
                atau klik untuk memilih dokumen laporan keuangan dari komputer
              </span>
              <span className="dropzone-restriction">
                Format yang didukung: Dokumen PDF Laporan Keuangan Tahunan (Maks. 50 MB)
              </span>
            </div>
          )}
        </div>

        <div className="upload-actions-bar">
          {file && !loading && (
            <button type="button" className="btn-reset-file" onClick={handleReset}>
              <FiRotateCcw className="btn-icon" />
              <span>Ganti Berkas</span>
            </button>
          )}

          <button
            type="button"
            className="btn-start-analysis"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            <FiCpu className="btn-icon" />
            <span>{loading ? 'Memproses Dokumen...' : 'Mulai Analisis Dokumen'}</span>
          </button>
        </div>
      </div>

      {/* PROCESSING MONITOR */}
      {loading && (
        <div className="analysis-card monitor-card">
          <div className="monitor-header-row">
            <div>
              <span className="monitor-tag">PROSES EKSEKUSI ASINKRON</span>
              <h3 className="monitor-title">Pemindaian OCR &amp; Evaluasi NLP Sedang Berjalan</h3>
            </div>
            <div className="monitor-progress-box">
              <span className="monitor-progress-number">{progress}%</span>
            </div>
          </div>

          <div className="monitor-progress-track">
            <div className="monitor-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="monitor-status-desc">
            <span className="pulse-indicator-dot"></span>
            <span className="status-desc-text">{getStageDescription(progress)}</span>
          </div>

          <div className="monitor-steps-grid">
            <div className={`step-item ${progress >= 10 ? 'is-complete' : 'is-pending'}`}>
              <div className="step-badge">
                {progress > 10 ? <FiCheck /> : '1'}
              </div>
              <div className="step-info">
                <span className="step-name">Upload Dokumen</span>
                <span className="step-desc">Validasi berkas PDF</span>
              </div>
            </div>

            <div
              className={`step-item ${
                progress >= 70 ? 'is-complete' : progress >= 10 ? 'is-active' : 'is-pending'
              }`}
            >
              <div className="step-badge">
                {progress > 70 ? <FiCheck /> : '2'}
              </div>
              <div className="step-info">
                <span className="step-name">OCR &amp; Ekstraksi KAM</span>
                <span className="step-desc">Tesseract 300 DPI</span>
              </div>
            </div>

            <div
              className={`step-item ${
                progress >= 90 ? 'is-complete' : progress >= 70 ? 'is-active' : 'is-pending'
              }`}
            >
              <div className="step-badge">
                {progress > 90 ? <FiCheck /> : '3'}
              </div>
              <div className="step-info">
                <span className="step-name">NLP &amp; Stemming</span>
                <span className="step-desc">PySastrawi matcher</span>
              </div>
            </div>

            <div
              className={`step-item ${
                progress >= 100 ? 'is-complete' : progress >= 90 ? 'is-active' : 'is-pending'
              }`}
            >
              <div className="step-badge">
                {progress === 100 ? <FiCheck /> : '4'}
              </div>
              <div className="step-info">
                <span className="step-name">Penyusunan Skor</span>
                <span className="step-desc">9 Dimensi Triple EM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULT SECTION */}
      {hasil && (
        <div className="analysis-card result-card" ref={resultRef}>
          <div className="result-header-row">
            <div className="result-header-meta">
              <span className="badge-done">
                <FiCheckCircle className="badge-icon" />
                <span>Analisis Selesai</span>
              </span>
              <h2 className="result-doc-name">
                {hasil.data_ekstraksi?.emiten_file || file?.name || 'Dokumen Audit'}
              </h2>
              <span className="result-id-tag">ID Rekaman Database: #{hasil.id_dokumen}</span>
            </div>

            <button type="button" className="btn-view-history" onClick={onGoToHistory}>
              <span>Buka di Riwayat Analisis</span>
              <FiArrowRight className="btn-icon" />
            </button>
          </div>

          {skor ? (
            <div className="score-summary-box" style={{ borderColor: styleTingkat.border }}>
              <div className="score-primary-column">
                <span className="score-heading-label">Skor Indikator Risiko Triple EM</span>
                <div className="score-huge-row">
                  <span className="score-huge-number" style={{ color: styleTingkat.barColor }}>
                    {skor.skor}
                  </span>
                  <span className="score-huge-denom">/ 100</span>
                </div>
                <div
                  className="risk-tag-large"
                  style={{
                    backgroundColor: styleTingkat.badgeBg,
                    color: styleTingkat.badgeText,
                    borderColor: styleTingkat.border,
                  }}
                >
                  {styleTingkat.label}
                </div>
              </div>

              <div className="score-metrics-column">
                <div className="metric-box-clean">
                  <div className="metric-icon-box">
                    <FiHash />
                  </div>
                  <div className="metric-content">
                    <span className="metric-title">Kata Kunci Risiko Terdeteksi</span>
                    <strong className="metric-value">{totalKeywords} kemunculan</strong>
                    <span className="metric-caption">pada lembar Hal Audit Utama (KAM)</span>
                  </div>
                </div>

                <div className="metric-box-clean">
                  <div className="metric-icon-box text-success">
                    <FiDatabase />
                  </div>
                  <div className="metric-content">
                    <span className="metric-title">Status Penyimpanan</span>
                    <strong className="metric-value text-success">Tersimpan di MySQL</strong>
                    <span className="metric-caption">Tabel dokumen_audit #{hasil.id_dokumen}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="result-empty-box">
              <FiAlertCircle className="empty-box-icon" />
              <p>{hasil.data_ekstraksi?.message || 'Kata kunci opini tidak ditemukan pada dokumen ini.'}</p>
            </div>
          )}

          {/* 9-DIMENSION BAR CHART */}
          {Object.keys(frekuensi).length > 0 && (
            <div className="dimension-section-wrap">
              <div className="dimension-header-bar">
                <div className="dimension-title-group">
                  <FiLayers className="section-icon text-blue" />
                  <div>
                    <h3 className="dimension-main-title">Frekuensi Indikator per 9 Dimensi Risiko</h3>
                    <span className="dimension-sub-title">
                      Distribusi kata kunci penanda risiko manipulasi laba
                    </span>
                  </div>
                </div>
              </div>

              <div className="dimension-bars-container">
                {Object.entries(frekuensi).map(([key, count]) => {
                  const percent = (count / maxFreq) * 100
                  return (
                    <div key={key} className="dimension-bar-row">
                      <div className="dimension-row-text">
                        <span className="dimension-label-name">{LABEL_DIMENSI[key] || key}</span>
                        <span
                          className="dimension-count-tag"
                          style={{ color: count > 0 ? styleTingkat.barColor : '#64748B' }}
                        >
                          {count} kata kunci
                        </span>
                      </div>
                      <div className="dimension-track-bg">
                        <div
                          className="dimension-fill-bar"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: count > 0 ? styleTingkat.barColor : '#CBD5E1',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* EXTRACTED TEXT PANEL */}
          <div className="evidence-section-wrap">
            <div className="evidence-header-bar">
              <div className="evidence-title-group">
                <FiCode className="section-icon text-slate" />
                <h3 className="evidence-main-title">
                  Bukti Transkrip Hal Audit Utama (Hasil Ekstraksi OCR/Teks)
                </h3>
              </div>
              <button type="button" className="btn-copy-evidence" onClick={handleCopy}>
                {copied ? (
                  <>
                    <FiCheck className="btn-icon text-success" />
                    <span>Tersalin ke Clipboard</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="btn-icon" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>
            </div>
            <pre className="evidence-text-viewer">
              {hasil.data_ekstraksi?.data || hasil.data_ekstraksi?.message || 'Tidak ada teks yang diekstraksi.'}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
