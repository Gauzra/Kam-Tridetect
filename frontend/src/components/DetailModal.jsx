import { useState } from 'react'
import {
  FiX,
  FiCopy,
  FiCheck,
  FiFileText,
  FiHash,
  FiCheckCircle,
  FiLayers,
  FiCode,
  FiCalendar,
} from 'react-icons/fi'
import { LABEL_DIMENSI, WARNA_TINGKAT } from '../constants/dimensions'
import { useToast } from '../context/NotificationContext'
import './DetailModal.css'

export default function DetailModal({ item, onClose }) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  if (!item) return null

  // Detail skor bisa berupa object atau JSON string dari DB
  let skorData = item.detail_skor
  if (typeof skorData === 'string') {
    try {
      skorData = JSON.parse(skorData)
    } catch {
      skorData = null
    }
  }

  const skorNilai = item.skor_total ?? skorData?.skor ?? null
  const tingkat =
    item.tingkat_risiko ||
    skorData?.tingkat ||
    (skorNilai != null
      ? skorNilai >= 60
        ? 'TINGGI'
        : skorNilai >= 30
        ? 'SEDANG'
        : 'RENDAH'
      : 'TIDAK DIKETAHUI')
  const styleTingkat = WARNA_TINGKAT[tingkat] || {
    badgeBg: '#F1F5F9',
    badgeText: '#475569',
    border: '#CBD5E1',
    barColor: '#64748B',
    label: tingkat,
  }

  const frekuensi = skorData?.frekuensi_per_dimensi || {}
  const totalKeywords = skorData?.total_kemunculan_kata_risiko ?? 0
  const maxFreq = Object.values(frekuensi).length
    ? Math.max(...Object.values(frekuensi), 1)
    : 1

  const handleCopy = () => {
    if (!item.teks_opini) return
    navigator.clipboard.writeText(item.teks_opini)
    setCopied(true)
    toast.success('Teks Hal Audit Utama (KAM) berhasil disalin ke clipboard.')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-meta-top">
              <span className="modal-badge-id">DOKUMEN #{item.id}</span>
              <span className="modal-date">
                <FiCalendar className="modal-meta-icon" />
                <span>
                  {new Date(item.created_at).toLocaleString('id-ID', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </span>
              </span>
            </div>
            <div className="modal-title-row">
              <FiFileText className="modal-title-icon" />
              <h3 className="modal-title">{item.nama_file}</h3>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup modal"
            title="Tutup"
          >
            <FiX />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="modal-body">
          {skorNilai != null ? (
            <div className="modal-score-card" style={{ borderColor: styleTingkat.border }}>
              <div className="modal-score-left">
                <span className="modal-score-label">Skor Risiko Triple EM</span>
                <div className="modal-score-row">
                  <span className="modal-score-val" style={{ color: styleTingkat.barColor }}>
                    {skorNilai}
                  </span>
                  <span className="modal-score-denom">/ 100</span>
                </div>
                <div
                  className="modal-risk-tag"
                  style={{
                    backgroundColor: styleTingkat.badgeBg,
                    color: styleTingkat.badgeText,
                    borderColor: styleTingkat.border,
                  }}
                >
                  {styleTingkat.label}
                </div>
              </div>

              <div className="modal-score-right">
                <div className="modal-metric-chip">
                  <div className="metric-chip-icon">
                    <FiHash />
                  </div>
                  <div className="metric-chip-content">
                    <span className="chip-label">Kata Kunci Risiko Terdeteksi:</span>
                    <strong className="chip-value">{totalKeywords} kemunculan</strong>
                  </div>
                </div>

                <div className="modal-metric-chip">
                  <div className="metric-chip-icon text-success">
                    <FiCheckCircle />
                  </div>
                  <div className="metric-chip-content">
                    <span className="chip-label">Status Penapisan:</span>
                    <strong className="chip-value text-success">
                      Berhasil diekstraksi &amp; dinilai
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="modal-no-score-card">
              <p className="no-score-text">
                Dokumen ini berstatus <strong>{item.status_proses}</strong> tanpa nilai skor
                terstruktur di arsip lama.
              </p>
            </div>
          )}

          {/* 9 DIMENSION GRID */}
          {Object.keys(frekuensi).length > 0 && (
            <div className="modal-dimensi-section">
              <div className="section-title-wrap">
                <FiLayers className="section-title-icon text-blue" />
                <h4 className="section-subtitle">Distribusi Frekuensi per 9 Dimensi Risiko:</h4>
              </div>

              <div className="dimensi-grid">
                {Object.entries(frekuensi).map(([key, count]) => (
                  <div key={key} className="dimensi-item-card">
                    <div className="dimensi-row-header">
                      <span className="dimensi-title">{LABEL_DIMENSI[key] || key}</span>
                      <span
                        className="dimensi-count"
                        style={{ color: count > 0 ? styleTingkat.barColor : '#64748B' }}
                      >
                        {count} kata
                      </span>
                    </div>
                    <div className="dimensi-progress-bg">
                      <div
                        className="dimensi-progress-fill"
                        style={{
                          width: `${(count / maxFreq) * 100}%`,
                          backgroundColor: count > 0 ? styleTingkat.barColor : '#CBD5E1',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEXT KAM VIEWER */}
          <div className="modal-text-section">
            <div className="text-section-header">
              <div className="section-title-wrap">
                <FiCode className="section-title-icon text-slate" />
                <h4 className="section-subtitle">Teks Hal Audit Utama (KAM) yang Diekstraksi:</h4>
              </div>
              <button type="button" className="btn-copy-modal" onClick={handleCopy}>
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
            <pre className="extracted-text-box">
              {item.teks_opini || 'Tidak ada teks opini yang tersimpan pada rekaman dokumen ini.'}
            </pre>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="modal-footer">
          <button type="button" className="btn-close-modal" onClick={onClose}>
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  )
}
