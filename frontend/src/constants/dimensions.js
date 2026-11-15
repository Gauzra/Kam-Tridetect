export const LABEL_DIMENSI = {
  pengakuan_pendapatan: 'Pengakuan Pendapatan',
  aset_taklancar_dan_investasi: 'Aset Taklancar & Investasi',
  piutang_dan_kas: 'Piutang & Kas',
  persediaan_dan_biaya: 'Persediaan & Biaya',
  utang_dan_liabilitas: 'Utang & Liabilitas',
  going_concern: 'Kelangsungan Usaha (Going Concern)',
  estimasi_dan_pertimbangan: 'Estimasi & Pertimbangan Manajemen',
  kecurangan: 'Kecurangan / Fraud',
  pajak: 'Perpajakan & Beban Tangguhan',
}

export const DESKRIPSI_DIMENSI = {
  pengakuan_pendapatan: {
    standar: 'PSAK 72 / IFRS 15',
    fokus: 'Metode persentase penyelesaian, waktu pengakuan pendapatan kontrak, dan estimasi nilai transaksi.',
    kataKunci: 'pendapatan, pengakuan, kontrak, persentase, penyelesaian, revenue recognition',
  },
  aset_taklancar_dan_investasi: {
    standar: 'PSAK 48 / IAS 36 & PSAK 22 / IFRS 3',
    fokus: 'Uji penurunan nilai (impairment), valuasi goodwill, dan penilaian aset tetap atau entitas asosiasi.',
    kataKunci: 'aset, investasi, impairment, penurunan nilai, goodwill, ekuitas, properti',
  },
  piutang_dan_kas: {
    standar: 'PSAK 71 / IFRS 9',
    fokus: 'Cadangan Kerugian Penurunan Nilai (CKPN) berbasis expected credit loss dan rekonsiliasi kas.',
    kataKunci: 'piutang, kas, bank, receivable, kas dan setara kas',
  },
  persediaan_dan_biaya: {
    standar: 'PSAK 14 / IAS 2',
    fokus: 'Penentuan nilai realisasi neto persediaan, alokasi beban pokok produksi, dan efisiensi persediaan.',
    kataKunci: 'persediaan, biaya, inventory, stok, beban operasi, cost',
  },
  utang_dan_liabilitas: {
    standar: 'PSAK 73 / IFRS 16 & PSAK 50/55/71',
    fokus: 'Kewajiban sewa pembiayaan, restrukturisasi pinjaman bank, liabilitas kontinjensi, dan obligasi.',
    kataKunci: 'utang, liabilitas, pinjam, hutang, liability, obligasi, sewa, lease',
  },
  going_concern: {
    standar: 'SA 570 (Revisi 2021)',
    fokus: 'Kemampuan entitas mempertahankan kelangsungan usaha, defisiensi modal, dan risiko likuiditas.',
    kataKunci: 'going concern, kelangsungan usaha, likuiditas, likuidasi',
  },
  estimasi_dan_pertimbangan: {
    standar: 'SA 540 (Revisi 2021)',
    fokus: 'Asumsi nilai wajar, ketidakpastian estimasi akuntansi, dan subjektivitas judgement manajemen.',
    kataKunci: 'estimasi, pertimbangan, judgement, asumsi, ketidakpastian, uncertainty',
  },
  kecurangan: {
    standar: 'SA 240',
    fokus: 'Tanggung jawab auditor terkait salah saji material akibat manipulasi pembukuan dan fraud.',
    kataKunci: 'kecurangan, fraud, manipulasi, penyelewengan, salah saji material',
  },
  pajak: {
    standar: 'PSAK 46 / IAS 12',
    fokus: 'Pemulihan aset pajak tangguhan, sengketa pemeriksaan pajak, dan ketidakpastian perlakuan pajak.',
    kataKunci: 'pajak, tax, pajak tangguhan, deferred tax',
  },
}

export const WARNA_TINGKAT = {
  TINGGI: {
    label: 'Risiko Tinggi',
    badgeBg: '#fef2f2',
    badgeText: '#dc2626',
    border: '#fca5a5',
    barColor: '#ef4444',
  },
  SEDANG: {
    label: 'Risiko Sedang',
    badgeBg: '#fffbeb',
    badgeText: '#d97706',
    border: '#fcd34d',
    barColor: '#f59e0b',
  },
  RENDAH: {
    label: 'Risiko Rendah',
    badgeBg: '#f0fdf4',
    badgeText: '#16a34a',
    border: '#86efac',
    barColor: '#10b981',
  },
}

