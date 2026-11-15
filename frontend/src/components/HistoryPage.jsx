import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  FiSearch,
  FiX,
  FiRefreshCw,
  FiPlus,
  FiFileText,
  FiEye,
  FiTrash2,
  FiAlertCircle,
  FiInbox,
  FiRotateCcw,
} from 'react-icons/fi'
import { WARNA_TINGKAT } from '../constants/dimensions'
import { useToast, useConfirm } from '../context/NotificationContext'
import DetailModal from './DetailModal'
import './HistoryPage.css'

export default function HistoryPage({ onGoToAnalyze, initialSelectedId, onModalClosed }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const toast = useToast()
  const confirm = useConfirm()

  const fetchHistory = async (isManual = false) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('/api/dokumen-audit')
      if (res.data?.status === 'success') {
        const rows = res.data.data || []
        setList(rows)

        if (isManual) {
          toast.info('Data riwayat audit berhasil diperbarui dari database.')
        }

        // Jika dipanggil dengan direct id dari overview
        if (initialSelectedId) {
          const match = rows.find((r) => r.id === initialSelectedId)
          if (match) {
            handleOpenDetail(match)
          }
        }
      }
    } catch (err) {
      console.error('Fetch history error:', err)
      const msg = 'Gagal memuat riwayat audit dari server. Pastikan backend aktif.'
      setError(msg)
      if (isManual) {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleOpenDetail = async (item) => {
    if (!item.teks_opini) {
      try {
        const res = await axios.get(`/api/dokumen-audit/${item.id}`)
        if (res.data?.status === 'success') {
          setSelectedItem(res.data.data)
          return
        }
      } catch (err) {
        console.error('Fetch detail error:', err)
      }
    }
    setSelectedItem(item)
  }

  const handleCloseDetail = () => {
    setSelectedItem(null)
    if (onModalClosed) onModalClosed()
  }

  const handleDelete = async (id, nama) => {
    const isConfirmed = await confirm({
      title: 'Hapus Dokumen Audit',
      message: `Apakah Anda yakin ingin menghapus arsip dokumen "${nama}" dari database? Tindakan ini bersifat permanen dan data analisis tidak dapat dipulihkan.`,
      confirmText: 'Ya, Hapus Dokumen',
      cancelText: 'Batalkan',
      type: 'danger',
    })

    if (!isConfirmed) return

    setDeletingId(id)
    try {
      await axios.delete(`/api/dokumen-audit/${id}`)
      setList((prev) => prev.filter((item) => item.id !== id))
      toast.success(`Dokumen "${nama}" berhasil dihapus dari database.`)
    } catch (err) {
      if (err.response?.status === 404) {
        setList((prev) => prev.filter((item) => item.id !== id))
        toast.info(`Dokumen "${nama}" sudah tidak ada di basis data dan telah dihapus dari tabel.`)
      } else {
        toast.error('Gagal menghapus dokumen dari database. Pastikan koneksi server aktif.')
      }
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = list.filter((item) =>
    item.nama_file?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="history-container">
      {/* PAGE HEADER */}
      <div className="history-header">
        <div className="history-header-text">
          <h1 className="history-title">Riwayat Analisis</h1>
          <p className="history-subtitle">
            Arsip seluruh berkas laporan keuangan emiten yang telah diproses dan tersimpan di basis data MySQL.
          </p>
        </div>
        <div className="history-header-actions">
          <button type="button" className="btn-new-analysis" onClick={onGoToAnalyze}>
            <FiPlus className="btn-icon" />
            <span>Analisis Berkas Baru</span>
          </button>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="history-error-banner">
          <div className="error-banner-left">
            <FiAlertCircle className="error-icon" />
            <div className="error-message">
              <strong>Kendala Koneksi:</strong> {error}
            </div>
          </div>
          <button type="button" className="btn-retry-history" onClick={() => fetchHistory(true)}>
            <FiRefreshCw className="btn-icon" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* TABLE CARD */}
      <div className="history-card">
        {/* TOOLBAR */}
        <div className="history-toolbar">
          <div className="search-field-wrap">
            <FiSearch className="search-icon-lead" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama berkas emiten..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearch('')}
                title="Hapus pencarian"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="toolbar-right-actions">
            <span className="record-count-text">
              {filtered.length} dari {list.length} dokumen
            </span>
            <button
              type="button"
              className="btn-refresh-table"
              onClick={() => fetchHistory(true)}
              disabled={loading}
              title="Segarkan riwayat dari server"
            >
              <FiRefreshCw className={`btn-icon ${loading ? 'is-spinning' : ''}`} />
              <span>Segarkan</span>
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="history-loading-box">
            <div className="history-spinner"></div>
            <p>Memuat data riwayat dari database MySQL...</p>
          </div>
        )}

        {/* TABLE DATA */}
        {!loading && filtered.length > 0 && (
          <div className="history-table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-file">Nama Berkas Dokumen</th>
                  <th className="col-time">Waktu Pemrosesan</th>
                  <th className="col-status">Status</th>
                  <th className="col-score">Skor Risiko</th>
                  <th className="col-actions">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  let tingkat = item.tingkat_risiko
                  if (!tingkat && item.skor_total != null) {
                    tingkat =
                      item.skor_total >= 60
                        ? 'TINGGI'
                        : item.skor_total >= 30
                        ? 'SEDANG'
                        : 'RENDAH'
                  }
                  const styleTingkat = WARNA_TINGKAT[tingkat]

                  return (
                    <tr key={item.id}>
                      <td className="cell-id">
                        <span className="id-badge">#{item.id}</span>
                      </td>
                      <td className="cell-filename">
                        <div className="file-item-group">
                          <FiFileText className="file-lead-icon" />
                          <span className="file-name-string" title={item.nama_file}>
                            {item.nama_file}
                          </span>
                        </div>
                      </td>
                      <td className="cell-timestamp">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : '-'}
                      </td>
                      <td className="cell-status">
                        <span
                          className={`status-pill ${
                            item.status_proses === 'success'
                              ? 'status-pill-success'
                              : 'status-pill-danger'
                          }`}
                        >
                          <span className="status-dot"></span>
                          <span>{item.status_proses === 'success' ? 'Sukses' : 'Gagal'}</span>
                        </span>
                      </td>
                      <td className="cell-score">
                        {item.skor_total != null ? (
                          <div className="score-inline-wrap">
                            <span className="score-val-bold">{item.skor_total}</span>
                            <span
                              className="risk-tag-badge"
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
                          <span className="legacy-archive-tag">Arsip awal</span>
                        )}
                      </td>
                      <td className="cell-actions">
                        <div className="row-actions-group">
                          <button
                            type="button"
                            className="btn-action-view"
                            onClick={() => handleOpenDetail(item)}
                            title="Pratinjau detail skor dan transkrip"
                          >
                            <FiEye className="btn-icon" />
                            <span>Detail</span>
                          </button>
                          <button
                            type="button"
                            className="btn-action-delete"
                            onClick={() => handleDelete(item.id, item.nama_file)}
                            disabled={deletingId === item.id}
                            title="Hapus rekaman dari database"
                          >
                            <FiTrash2 className="btn-icon" />
                            <span>{deletingId === item.id ? '...' : 'Hapus'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && !error && (
          <div className="history-empty-box">
            <FiInbox className="empty-box-icon" />
            <h4 className="empty-box-title">
              {search ? 'Dokumen Tidak Ditemukan' : 'Belum Ada Arsip Dokumen'}
            </h4>
            <p className="empty-box-text">
              {search
                ? `Tidak ada berkas yang cocok dengan kata kunci pencarian "${search}".`
                : 'Belum ada laporan keuangan audit yang dianalisis pada sistem ini.'}
            </p>
            {search ? (
              <button
                type="button"
                className="btn-reset-search"
                onClick={() => setSearch('')}
              >
                <FiRotateCcw className="btn-icon" />
                <span>Reset Pencarian</span>
              </button>
            ) : (
              <button type="button" className="btn-new-analysis" onClick={onGoToAnalyze}>
                <FiPlus className="btn-icon" />
                <span>Unggah Dokumen Pertama</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedItem && <DetailModal item={selectedItem} onClose={handleCloseDetail} />}
    </div>
  )
}
