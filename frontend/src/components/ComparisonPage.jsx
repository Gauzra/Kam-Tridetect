import {
  FiClock,
  FiBarChart2,
  FiDatabase,
  FiTrendingUp,
  FiLayout,
  FiTarget,
  FiGrid,
  FiArrowRight,
  FiPlus,
  FiLayers,
} from 'react-icons/fi'
import './ComparisonPage.css'

export default function ComparisonPage({ onGoToAnalyze, onGoToHistory }) {
  return (
    <div className="comparison-container">
      {/* PAGE HEADER */}
      <div className="comparison-header">
        <div className="comparison-header-text">
          <div className="badge-planned-pill">
            <FiClock className="badge-icon" />
            <span>MODUL DALAM RANCANGAN (PLANNED FEATURE)</span>
          </div>
          <h1 className="comparison-title">Komparasi Analisis Antaremiten</h1>
          <p className="comparison-subtitle">
            Modul perbandingan multi-emiten untuk mengevaluasi posisi risiko relatif berdasarkan 9 dimensi
            Triple Earnings Management secara saintifik dan berimbang.
          </p>
        </div>
      </div>

      {/* ROADMAP STATUS HERO CARD */}
      <div className="comparison-card roadmap-card">
        <div className="roadmap-header">
          <div className="roadmap-icon-box">
            <FiBarChart2 />
          </div>
          <div className="roadmap-titles">
            <h2 className="roadmap-heading">Status Pengembangan &amp; Kesiapan Metodologi</h2>
            <p className="roadmap-subheading">
              Sesuai prinsip integritas analitis KAM-TRIDETECT, fitur komparasi tidak dijalankan dengan
              data simulasi atau data tiruan. Implementasi modul ini menunggu kesiapan dua pilar data
              terstruktur berikut:
            </p>
          </div>
        </div>

        <div className="prerequisite-grid">
          {/* PILAR 01 */}
          <div className="prereq-card">
            <div className="prereq-top">
              <span className="prereq-pilar-tag">Pilar 01</span>
              <div className="prereq-icon-circle text-blue">
                <FiDatabase />
              </div>
            </div>
            <h3 className="prereq-title">Struktur Metadata Emiten &amp; Periode Laporan</h3>
            <p className="prereq-desc">
              Perbandingan yang sahih mewajibkan laporan keuangan diindeks berdasarkan kode ticker emiten
              resmi (misal: ACST, AADI), tahun buku yang setara, dan jenis opini auditor independen. Data
              ini sedang dipersiapkan untuk otomatisasi pada fase pengembangan berikutnya.
            </p>
            <div className="prereq-status-badge badge-blue">
              <span className="status-dot-blue"></span>
              <span>Status: Persiapan Metadata Skema</span>
            </div>
          </div>

          {/* PILAR 02 */}
          <div className="prereq-card">
            <div className="prereq-top">
              <span className="prereq-pilar-tag">Pilar 02</span>
              <div className="prereq-icon-circle text-amber">
                <FiTrendingUp />
              </div>
            </div>
            <h3 className="prereq-title">Normalisasi Karakteristik Sektor Industri (IDX-IC)</h3>
            <p className="prereq-desc">
              Membandingkan dua emiten dari sektor berbeda secara mentah dapat menghasilkan interpretasi
              yang bias. Sebagai contoh, sektor Konstruksi secara alamiah memiliki risiko pengakuan
              pendapatan kontrak (PSAK 72) yang lebih tinggi dibanding sektor Energi. Diperlukan indeks
              pembobotan industri sebelum komparasi disajikan.
            </p>
            <div className="prereq-status-badge badge-amber">
              <span className="status-dot-amber"></span>
              <span>Status: Formulasi Pembobotan Industri</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONCEPTUAL BLUEPRINT WIREFRAME */}
      <div className="comparison-card blueprint-card">
        <div className="blueprint-header">
          <div className="blueprint-header-titles">
            <div className="blueprint-icon-group">
              <FiLayout className="section-title-icon text-blue" />
              <h2 className="blueprint-heading">Rancangan Antarmuka Modul (Design Blueprint)</h2>
            </div>
            <p className="blueprint-subheading">
              Gambaran tata letak analitis yang akan diaktifkan setelah integrasi metadata emiten terstruktur selesai.
            </p>
          </div>
          <span className="badge-preview-tag">Pratinjau Konseptual</span>
        </div>

        {/* WIREFRAME MOCKUP CANVAS */}
        <div className="wireframe-mockup">
          <div className="wireframe-bar">
            <div className="mockup-selector">
              <span className="mockup-label">Emiten Referensi A:</span>
              <div className="mockup-input">
                <FiLayers className="mockup-input-icon text-blue" />
                <span>PT Acset Indonusa Tbk (Infrastruktur / Konstruksi)</span>
              </div>
            </div>
            <div className="mockup-vs-circle">VS</div>
            <div className="mockup-selector">
              <span className="mockup-label">Emiten Pembanding B:</span>
              <div className="mockup-input">
                <FiLayers className="mockup-input-icon text-slate" />
                <span>PT Total Bangun Persada Tbk (Infrastruktur / Konstruksi)</span>
              </div>
            </div>
          </div>

          <div className="wireframe-content-grid">
            <div className="wireframe-box">
              <div className="wireframe-box-header">
                <FiTarget className="box-header-icon text-blue" />
                <span className="wireframe-box-title">Komparasi Radar 9 Dimensi Risiko</span>
              </div>
              <div className="wireframe-placeholder-visual">
                <div className="radar-mockup-graphic">
                  <div className="radar-circle circle-3"></div>
                  <div className="radar-circle circle-2"></div>
                  <div className="radar-circle circle-1"></div>
                  <div className="radar-crosshair-h"></div>
                  <div className="radar-crosshair-v"></div>
                  <div className="radar-polygon-a"></div>
                  <div className="radar-polygon-b"></div>
                </div>
                <span className="placeholder-caption">Visualisasi Spider / Radar Chart Sektor Homogen</span>
              </div>
            </div>

            <div className="wireframe-box">
              <div className="wireframe-box-header">
                <FiGrid className="box-header-icon text-blue" />
                <span className="wireframe-box-title">Matriks Selisih Frekuensi Indikator</span>
              </div>
              <div className="wireframe-placeholder-visual">
                <div className="bars-mockup-graphic">
                  <div className="mock-bar-pair">
                    <div className="mock-bar bar-a" style={{ height: '70%' }}></div>
                    <div className="mock-bar bar-b" style={{ height: '45%' }}></div>
                  </div>
                  <div className="mock-bar-pair">
                    <div className="mock-bar bar-a" style={{ height: '30%' }}></div>
                    <div className="mock-bar bar-b" style={{ height: '80%' }}></div>
                  </div>
                  <div className="mock-bar-pair">
                    <div className="mock-bar bar-a" style={{ height: '55%' }}></div>
                    <div className="mock-bar bar-b" style={{ height: '60%' }}></div>
                  </div>
                  <div className="mock-bar-pair">
                    <div className="mock-bar bar-a" style={{ height: '85%' }}></div>
                    <div className="mock-bar bar-b" style={{ height: '25%' }}></div>
                  </div>
                </div>
                <span className="placeholder-caption">Delta Kepadatan Kata Kunci per Dimensi Risiko</span>
              </div>
            </div>
          </div>
        </div>

        {/* BLUEPRINT ACTIONS */}
        <div className="blueprint-footer-actions">
          <button type="button" className="btn-secondary-action" onClick={onGoToHistory}>
            <span>Lihat Riwayat Analisis Saat Ini</span>
            <FiArrowRight className="btn-icon" />
          </button>
          <button type="button" className="btn-primary-action" onClick={onGoToAnalyze}>
            <FiPlus className="btn-icon" />
            <span>Lakukan Analisis Berkas Tunggal</span>
          </button>
        </div>
      </div>
    </div>
  )
}
