import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  FiFileText,
  FiAlertTriangle,
  FiAlertCircle,
  FiCheckCircle,
  FiActivity,
  FiPlus,
  FiArrowRight,
  FiEye,
  FiInfo,
  FiRefreshCw,
  FiLayers,
  FiClock,
} from 'react-icons/fi'
import { WARNA_TINGKAT } from '../constants/dimensions'
import './OverviewPage.css'

export default function OverviewPage({ onNavigate, onSelectDocument }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOverview = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('/api/overview-stats')
      if (res.data?.status === 'success') {
        setStats(res.data.data)
      }
    } catch (err) {
      console.error('Fetch overview stats error:', err)
      setError('Gagal memuat ringkasan data dari server. Pastikan backend aktif.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  const total = stats?.total_dokumen || 0
  const tinggi = stats?.risiko_tinggi || 0
  const sedang = stats?.risiko_sedang || 0
  const rendah = stats?.risiko_rendah || 0
  const belumDinilai = stats?.belum_dinilai || 0
  const rataRata = stats?.rata_rata_skor

  // Proporsi distribusi
  const ratedCount = tinggi + sedang + rendah
  const pctTinggi = ratedCount > 0 ? ((tinggi / ratedCount) * 100).toFixed(1) : 0
  const pctSedang = ratedCount > 0 ? ((sedang / ratedCount) * 100).toFixed(1) : 0
  const pctRendah = ratedCount > 0 ? ((rendah / ratedCount) * 100).toFixed(1) : 0

  return (
    <div className="overview-container">
      {/* HEADER SECTION */}
      <div className="overview-header">
        <div className="overview-header-text">
          <h1 className="overview-title">Overview Audit</h1>
          <p className="overview-subtitle">
            Ringkasan eksekutif penapisan risiko Triple Earnings Management dari arsip Laporan Auditor Independen.
          </p>
        </div>
        <div className="overview-header-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => onNavigate('analisis')}
          >
            <FiPlus className="btn-icon" />
            <span>Analisis Berkas Baru</span>
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="overview-error-banner">
          <div className="error-banner-content">
            <FiAlertCircle className="error-icon" />
            <div className="error-text">
              <strong>Koneksi Terputus:</strong> {error}
            </div>
          </div>
          <button type="button" className="btn-retry" onClick={fetchOverview}>
            <FiRefreshCw className="btn-icon" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="kpi-grid">
        {/* Total Dokumen */}
        <div className="kpi-card card-total">
          <div className="kpi-top">
            <span className="kpi-label">Total Dokumen</span>
            <div className="kpi-icon-badge badge-blue">
              <FiFileText />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-number-wrap">
              <span className="kpi-value">{loading ? '...' : total}</span>
              <span className="kpi-unit">berkas</span>
            </div>
            <span className="kpi-caption">Tersimpan di database audit</span>
          </div>
        </div>

        {/* Risiko Tinggi */}
        <div className="kpi-card card-danger">
          <div className="kpi-top">
            <span className="kpi-label">Risiko Tinggi</span>
            <div className="kpi-icon-badge badge-red">
              <FiAlertTriangle />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-number-wrap">
              <span className="kpi-value text-danger">{loading ? '...' : tinggi}</span>
              <span className="kpi-tag tag-danger">Skor ≥ 60</span>
            </div>
            <span className="kpi-caption">Prioritas telaah forensik</span>
          </div>
        </div>

        {/* Risiko Sedang */}
        <div className="kpi-card card-warning">
          <div className="kpi-top">
            <span className="kpi-label">Risiko Sedang</span>
            <div className="kpi-icon-badge badge-amber">
              <FiAlertCircle />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-number-wrap">
              <span className="kpi-value text-warning">{loading ? '...' : sedang}</span>
              <span className="kpi-tag tag-warning">Skor 30 – 59</span>
            </div>
            <span className="kpi-caption">Pantauan pos estimasi akrual</span>
          </div>
        </div>

        {/* Risiko Rendah */}
        <div className="kpi-card card-success">
          <div className="kpi-top">
            <span className="kpi-label">Risiko Rendah</span>
            <div className="kpi-icon-badge badge-green">
              <FiCheckCircle />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-number-wrap">
              <span className="kpi-value text-success">{loading ? '...' : rendah}</span>
              <span className="kpi-tag tag-success">Skor &lt; 30</span>
            </div>
            <span className="kpi-caption">Kepadatan risiko leksikal wajar</span>
          </div>
        </div>

        {/* Rata-Rata Skor */}
        <div className="kpi-card card-average">
          <div className="kpi-top">
            <span className="kpi-label">Rata-Rata Skor</span>
            <div className="kpi-icon-badge badge-slate">
              <FiActivity />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-number-wrap">
              <span className="kpi-value">
                {loading ? '...' : rataRata != null ? rataRata : '-'}
              </span>
              {rataRata != null && <span className="kpi-unit">/ 100</span>}
            </div>
            <span className="kpi-caption">
              {rataRata != null ? 'Rata-rata dari dokumen ber-skor' : 'Belum ada dokumen ber-skor'}
            </span>
          </div>
        </div>
      </div>

      {/* RISK PROPORTION BAR */}
      <div className="overview-card">
        <div className="overview-card-header">
          <div className="card-header-titles">
            <div className="header-icon-title">
              <FiLayers className="section-title-icon text-blue" />
              <h2 className="overview-card-title">Distribusi Klasifikasi Risiko</h2>
            </div>
            <p className="overview-card-subtitle">
              Proporsi hasil penapisan dari seluruh laporan keuangan emiten yang memiliki skor terstruktur.
            </p>
          </div>
          <div className="card-header-badge">
            <span className="badge-rated-count">{ratedCount} Dokumen Dinilai</span>
          </div>
        </div>

        {ratedCount > 0 ? (
          <div className="proportion-wrapper">
            <div className="proportion-bar-track">
              {tinggi > 0 && (
                <div
                  className="proportion-slice slice-danger"
                  style={{ width: `${pctTinggi}%` }}
                  title={`Risiko Tinggi: ${tinggi} (${pctTinggi}%)`}
                />
              )}
              {sedang > 0 && (
                <div
                  className="proportion-slice slice-warning"
                  style={{ width: `${pctSedang}%` }}
                  title={`Risiko Sedang: ${sedang} (${pctSedang}%)`}
                />
              )}
              {rendah > 0 && (
                <div
                  className="proportion-slice slice-success"
                  style={{ width: `${pctRendah}%` }}
                  title={`Risiko Rendah: ${rendah} (${pctRendah}%)`}
                />
              )}
            </div>

            <div className="proportion-legend-row">
              <div className="legend-chip">
                <span className="legend-dot dot-danger"></span>
                <span className="legend-name">Risiko Tinggi:</span>
                <span className="legend-figure text-danger">
                  {tinggi} ({pctTinggi}%)
                </span>
              </div>
              <div className="legend-chip">
                <span className="legend-dot dot-warning"></span>
                <span className="legend-name">Risiko Sedang:</span>
                <span className="legend-figure text-warning">
                  {sedang} ({pctSedang}%)
                </span>
              </div>
              <div className="legend-chip">
                <span className="legend-dot dot-success"></span>
                <span className="legend-name">Risiko Rendah:</span>
                <span className="legend-figure text-success">
                  {rendah} ({pctRendah}%)
                </span>
              </div>
              {belumDinilai > 0 && (
                <div className="legend-chip chip-muted">
                  <span className="legend-dot dot-muted"></span>
                  <span className="legend-name">Arsip Awal:</span>
                  <span className="legend-figure">{belumDinilai}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="overview-empty-box">
            <FiInfo className="empty-box-icon" />
            <p>Belum ada dokumen ber-skor terstruktur untuk memvisualisasikan distribusi risiko.</p>
          </div>
        )}
      </div>

      {/* RECENT ANALYSES TABLE */}
      <div className="overview-card">
        <div className="overview-card-header">
          <div className="card-header-titles">
            <div className="header-icon-title">
              <FiClock className="section-title-icon text-slate" />
              <h2 className="overview-card-title">Analisis Terbaru</h2>
            </div>
            <p className="overview-card-subtitle">
              Lima berkas laporan audit yang terakhir kali diproses oleh sistem.
            </p>
          </div>
          <button
            type="button"
            className="btn-view-all"
            onClick={() => onNavigate('riwayat')}
          >
            <span>Buka Seluruh Riwayat</span>
            <FiArrowRight className="btn-icon-right" />
          </button>
        </div>

        {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
          <div className="overview-table-responsive">
            <table className="overview-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-file">Nama Berkas Dokumen</th>
                  <th className="col-time">Waktu Proses</th>
                  <th className="col-status">Status</th>
                  <th className="col-score">Skor Risiko</th>
                  <th className="col-action">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_analyses.map((row) => {
                  let tingkat = row.tingkat_risiko
                  if (!tingkat && row.skor_total != null) {
                    tingkat =
                      row.skor_total >= 60
                        ? 'TINGGI'
                        : row.skor_total >= 30
                        ? 'SEDANG'
                        : 'RENDAH'
                  }
                  const styleTingkat = WARNA_TINGKAT[tingkat]

                  return (
                    <tr key={row.id}>
                      <td className="cell-id">
                        <span className="id-tag">#{row.id}</span>
                      </td>
                      <td className="cell-filename">
                        <div className="file-cell-wrap">
                          <FiFileText className="file-icon-lead" />
                          <span className="file-title-text" title={row.nama_file}>
                            {row.nama_file}
                          </span>
                        </div>
                      </td>
                      <td className="cell-timestamp">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : '-'}
                      </td>
                      <td className="cell-status">
                        <span
                          className={`status-pill ${
                            row.status_proses === 'success'
                              ? 'status-pill-success'
                              : 'status-pill-danger'
                          }`}
                        >
                          <span className="status-dot"></span>
                          <span>{row.status_proses === 'success' ? 'Sukses' : 'Gagal'}</span>
                        </span>
                      </td>
                      <td className="cell-score">
                        {row.skor_total != null ? (
                          <div className="score-badge-inline">
                            <span className="score-value-bold">{row.skor_total}</span>
                            <span
                              className="score-tier-tag"
                              style={{
                                backgroundColor: styleTingkat?.badgeBg,
                                color: styleTingkat?.badgeText,
                                borderColor: styleTingkat?.border,
                              }}
                            >
                              {tingkat}
                            </span>
                          </div>
                        ) : (
                          <span className="badge-legacy">Arsip awal</span>
                        )}
                      </td>
                      <td className="cell-action">
                        <button
                          type="button"
                          className="btn-action-detail"
                          onClick={() => onSelectDocument(row.id)}
                        >
                          <FiEye className="btn-icon" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overview-empty-box">
            <FiInfo className="empty-box-icon" />
            <p>Belum ada riwayat dokumen audit yang tersimpan dalam sistem.</p>
          </div>
        )}
      </div>

      {/* DISCLAIMER / NOTICE */}
      <div className="overview-disclaimer">
        <div className="disclaimer-icon-wrap">
          <FiInfo className="disclaimer-icon" />
        </div>
        <div className="disclaimer-body">
          <h4 className="disclaimer-heading">Pemberitahuan Metodologis & Penafian Legal</h4>
          <p className="disclaimer-paragraph">
            Skor risiko dan indikator leksikal yang disajikan oleh platform KAM-TRIDETECT merupakan hasil
            penapisan analitis awal (<em>screening indicator</em>) berdasarkan model ekstraksi Hal Audit Utama
            (Key Audit Matters). Metrik ini berfungsi sebagai pendukung telaah substantif dan bukan merupakan
            kesimpulan final atau vonis hukum atas manipulasi laporan keuangan maupun kelalaian auditor.
          </p>
        </div>
      </div>
    </div>
  )
}
