import {
  FiShield,
  FiFileText,
  FiLayers,
  FiCheckCircle,
  FiTrendingUp,
  FiGrid,
  FiCpu,
  FiTerminal,
  FiDatabase,
  FiActivity,
  FiBookmark,
} from 'react-icons/fi'
import { LABEL_DIMENSI, DESKRIPSI_DIMENSI } from '../constants/dimensions'
import './AboutSystemPage.css'

export default function AboutSystemPage() {
  return (
    <div className="about-container">
      {/* PAGE HEADER */}
      <div className="about-header">
        <div className="about-header-text">
          <h1 className="about-title">Tentang Sistem</h1>
          <p className="about-subtitle">
            Spesifikasi arsitektur platform intelijen audit, kerangka analitis penapisan Triple
            Earnings Management, dan teknologi pemrosesan bahasa alami (NLP) yang digunakan.
          </p>
        </div>
      </div>

      {/* TUJUAN PRODUK */}
      <div className="about-card">
        <div className="about-card-header">
          <div className="card-badge-row">
            <FiShield className="card-badge-icon text-blue" />
            <span className="card-tag-pill">PROFIL PLATFORM</span>
          </div>
          <h2 className="about-card-heading">Tujuan Produk KAM-TRIDETECT</h2>
        </div>

        <p className="about-paragraph-lead">
          KAM-TRIDETECT adalah <strong>Professional Audit Intelligence Platform</strong> yang dirancang
          untuk mendukung auditor independen, komite audit, dan analis pasar modal dalam menelaah laporan
          keuangan emiten secara objektif. Sistem ini berfokus pada analisis mendalam terhadap dokumen naratif
          laporan auditor, khususnya lembar <strong>Hal Audit Utama (Key Audit Matters / KAM)</strong>,
          untuk mendeteksi indikasi awal rekayasa laba (<em>earnings management</em>).
        </p>

        <div className="product-values-grid">
          <div className="value-card">
            <div className="value-icon-circle text-blue">
              <FiFileText />
            </div>
            <h3 className="value-title">Otomasi Ekstraksi Berkas Nyata</h3>
            <p className="value-desc">
              Menangani tantangan format bilingual dua kolom dan dokumen hasil pindaian scan bertanda
              tangan basah auditor menggunakan Optical Character Recognition (OCR) beresolusi tinggi 300 DPI.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-circle text-blue">
              <FiLayers />
            </div>
            <h3 className="value-title">Penapisan Risiko Multidimensi</h3>
            <p className="value-desc">
              Mengukur kepadatan leksikal penanda risiko pada sembilan dimensi akuntansi kritis yang
              selaras dengan Standar Audit SA 701 dan standar pelaporan keuangan PSAK / IFRS.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-circle text-success">
              <FiCheckCircle />
            </div>
            <h3 className="value-title">Kredibilitas &amp; Ketertelusuran</h3>
            <p className="value-desc">
              Menyajikan skor risiko 0–100 yang terhubung langsung dengan bukti transkrip teks laporan audit
              aslinya, memastikan setiap hasil penapisan dapat diverifikasi secara transparan.
            </p>
          </div>
        </div>
      </div>

      {/* KONSEP TRIPLE EARNINGS MANAGEMENT */}
      <div className="about-card">
        <div className="about-card-header">
          <div className="card-badge-row">
            <FiTrendingUp className="card-badge-icon text-blue" />
            <span className="card-tag-pill">KERANGKA ANALITIS</span>
          </div>
          <h2 className="about-card-heading">Konsep Triple Earnings Management (TEM)</h2>
        </div>

        <p className="about-paragraph-regular">
          Praktik rekayasa laba kontemporer melibatkan strategi berlapis yang diklasifikasikan ke dalam
          tiga mekanisme utama:
        </p>

        <div className="tem-feature-grid">
          <div className="tem-feature-box border-blue">
            <div className="tem-tag-pill tag-blue">AEM</div>
            <h3 className="tem-feature-title">Accrual-based Earnings Management</h3>
            <p className="tem-feature-desc">
              Manipulasi yang dilakukan melalui diskresi estimasi akuntansi tanpa mengubah arus kas riil
              perusahaan, seperti penyesuaian umur manfaat aset, estimasi cadangan kerugian penurunan nilai
              piutang (CKPN), dan pengakuan provisi biaya.
            </p>
          </div>

          <div className="tem-feature-box border-amber">
            <div className="tem-tag-pill tag-amber">RAM</div>
            <h3 className="tem-feature-title">Real Activities Manipulation</h3>
            <p className="tem-feature-desc">
              Manipulasi yang melibatkan penyimpangan dari siklus operasional normal perusahaan, seperti
              pemberian diskon harga temporer agresif, overproduksi barang untuk menyerap biaya tetap, dan
              penundaan pengeluaran riset maupun biaya pemeliharaan.
            </p>
          </div>

          <div className="tem-feature-box border-purple">
            <div className="tem-tag-pill tag-purple">CS</div>
            <h3 className="tem-feature-title">Classification Shifting</h3>
            <p className="tem-feature-desc">
              Rekayasa penyajian laporan laba rugi dengan menggeser klasifikasi pos beban dari beban
              pokok/operasional ke pos non-operasional atau pos luar biasa, sehingga laba operasi inti
              (EBIT) tampak lebih sehat bagi analis.
            </p>
          </div>
        </div>
      </div>

      {/* 9 DIMENSI ANALISIS */}
      <div className="about-card">
        <div className="about-card-header">
          <div className="card-badge-row">
            <FiGrid className="card-badge-icon text-blue" />
            <span className="card-tag-pill">TAKSONOMI RISIKO</span>
          </div>
          <h2 className="about-card-heading">Sembilan Dimensi Analisis Hal Audit Utama (SA 701)</h2>
        </div>

        <p className="about-paragraph-regular">
          Platform memetakan temuan Hal Audit Utama (KAM) ke dalam sembilan dimensi risiko akuntansi spesifik:
        </p>

        <div className="dimensions-spec-grid">
          {Object.entries(DESKRIPSI_DIMENSI).map(([key, info], idx) => (
            <div key={key} className="dimension-spec-card">
              <div className="spec-card-top">
                <span className="spec-index">Dimensi {String(idx + 1).padStart(2, '0')}</span>
                <span className="spec-std">
                  <FiBookmark className="spec-std-icon" />
                  <span>{info.standar}</span>
                </span>
              </div>
              <h3 className="spec-name">{LABEL_DIMENSI[key]}</h3>
              <p className="spec-fokus">
                <strong>Fokus Analisis:</strong> {info.fokus}
              </p>
              <div className="spec-keywords">
                <span className="spec-keywords-label">Indikator Kata Kunci:</span>
                <code className="spec-code-tag">{info.kataKunci}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALUR TEKNOLOGI OCR & NLP */}
      <div className="about-card">
        <div className="about-card-header">
          <div className="card-badge-row">
            <FiCpu className="card-badge-icon text-blue" />
            <span className="card-tag-pill">ARSITEKTUR TEKNOLOGI</span>
          </div>
          <h2 className="about-card-heading">Alur Pemrosesan Dokumen &amp; Engine Stack</h2>
        </div>

        <div className="pipeline-flow-grid">
          <div className="pipeline-step-card">
            <div className="step-num-badge">Tahap 01</div>
            <div className="pipeline-step-body">
              <div className="step-icon-wrap text-blue">
                <FiFileText />
              </div>
              <h3 className="pipeline-title">PDF Extraction</h3>
              <p className="pipeline-text">
                Pustaka <code>pdfplumber</code> menyisir teks digital dan menangani pemotongan tata letak
                bilingual multi-kolom.
              </p>
            </div>
          </div>

          <div className="pipeline-step-card">
            <div className="step-num-badge">Tahap 02</div>
            <div className="pipeline-step-body">
              <div className="step-icon-wrap text-blue">
                <FiTerminal />
              </div>
              <h3 className="pipeline-title">Optical Character Recognition</h3>
              <p className="pipeline-text">
                Engine <code>Tesseract OCR 300 DPI</code> memindai halaman scan bertanda tangan basah dan
                stempel KAP dengan dataset Bahasa Indonesia.
              </p>
            </div>
          </div>

          <div className="pipeline-step-card">
            <div className="step-num-badge">Tahap 03</div>
            <div className="pipeline-step-body">
              <div className="step-icon-wrap text-blue">
                <FiActivity />
              </div>
              <h3 className="pipeline-title">NLP &amp; Stemming</h3>
              <p className="pipeline-text">
                Pustaka <code>PySastrawi</code> melakukan stopword removal dan reduksi kata dasar Bahasa
                Indonesia secara leksikal.
              </p>
            </div>
          </div>

          <div className="pipeline-step-card">
            <div className="step-num-badge">Tahap 04</div>
            <div className="pipeline-step-body">
              <div className="step-icon-wrap text-blue">
                <FiDatabase />
              </div>
              <h3 className="pipeline-title">Scoring &amp; Storage</h3>
              <p className="pipeline-text">
                Menghitung skor risiko 0–100 dan menyimpan rekaman audit terstruktur ke basis data MySQL.
              </p>
            </div>
          </div>
        </div>

        <div className="tech-stack-section">
          <span className="tech-stack-label">Teknologi Inti Platform:</span>
          <div className="tech-stack-row">
            <span className="tech-badge">Python 3.14</span>
            <span className="tech-badge">FastAPI</span>
            <span className="tech-badge">Node.js 24 / Express 5</span>
            <span className="tech-badge">MySQL 8.4</span>
            <span className="tech-badge">React 19 / Vite 8</span>
            <span className="tech-badge">PySastrawi &amp; NLTK</span>
            <span className="tech-badge">Tesseract-OCR 300 DPI</span>
          </div>
        </div>
      </div>
    </div>
  )
}
