export default function BrandLogo({ variant = 'horizontal', size = 38, className = '' }) {
  // Simbol Geometris: Menggabungkan Dokumen Audit (struktur lembar lipat),
  // Intelijen Keuangan (garis analitis terhubung), dan Deteksi Risiko (aperture/fokus scanning)
  const symbolSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="brand-symbol-svg"
      aria-label="KAM-TriDetect Symbol"
    >
      {/* Lapisan 1: Document Outline & Precision Edge */}
      <rect
        x="6"
        y="5"
        width="28"
        height="34"
        rx="5"
        stroke="#172B4D"
        strokeWidth="2.5"
        fill="#FFFFFF"
      />
      {/* Sudut Dokumen Lipat / Analisis Dokumen */}
      <path
        d="M26 5V13C26 14.1 26.9 15 28 15H34"
        stroke="#172B4D"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Lapisan 2: Financial Intelligence - Garis Bar Analitik */}
      <line x1="12" y1="14" x2="21" y2="14" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="19" x2="23" y2="19" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="24" x2="19" y2="24" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

      {/* Lapisan 3: Risk Detection Aperture & Focused Scanning Crosshair */}
      <g transform="translate(18, 18)">
        {/* Lingkaran Deteksi */}
        <circle cx="12" cy="12" r="9" fill="#EAF0FA" stroke="#356AE6" strokeWidth="2.2" />
        {/* Titik Inti Fokus Risiko */}
        <circle cx="12" cy="12" r="3.2" fill="#356AE6" />
        {/* Reticle / Crosshair Scanner */}
        <line x1="12" y1="1" x2="12" y2="5" stroke="#356AE6" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="19" x2="12" y2="23" stroke="#356AE6" strokeWidth="2" strokeLinecap="round" />
        <line x1="1" y1="12" x2="5" y2="12" stroke="#356AE6" strokeWidth="2" strokeLinecap="round" />
        <line x1="19" y1="12" x2="23" y2="12" stroke="#356AE6" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )

  if (variant === 'symbol' || variant === 'favicon') {
    return <div className={`brand-symbol-wrap ${className}`}>{symbolSvg}</div>
  }

  return (
    <div className={`brand-horizontal-lockup ${className}`}>
      {symbolSvg}
      <div className="brand-text-column">
        <span className="brand-logotype">KAM-TRIDETECT</span>
        <span className="brand-tagline">AUDIT INTELLIGENCE PLATFORM</span>
      </div>
    </div>
  )
}

