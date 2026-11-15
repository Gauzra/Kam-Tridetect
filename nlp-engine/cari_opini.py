# nlp-engine/cari_opini.py
import re

import pdfplumber
import pytesseract

# Path Tesseract di sistem operasi Windows Anda
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# ---------------------------------------------------------------------------
# Konfigurasi halaman & OCR
# ---------------------------------------------------------------------------

# Berapa halaman yang selalu dipindai dari depan dan dari belakang dokumen
# (dikurangi dari 15 → 10 untuk mempercepat pipeline)
OCR_HALAMAN_DEPAN = 10
OCR_HALAMAN_BELAKANG = 10

# Halaman dianggap "ber-teks digital" jika panjang teksnya melewati ambang ini
AMBANG_TEKS_DIGITAL = 30

# Resolusi DPI untuk OCR:
#   - DETEKSI (pass 1): resolusi rendah, cukup untuk menemukan keyword
#   - EKSTRAKSI (pass 2): resolusi tinggi, kualitas teks untuk NLP scoring
DPI_DETEKSI = 150
DPI_EKSTRAKSI = 300

# ---------------------------------------------------------------------------
# Daftar kata kunci (lowercase untuk efisiensi perbandingan)
# ---------------------------------------------------------------------------

# Kata kunci kuat: penanda judul Laporan Auditor Independen / KAM.
# (dipakai untuk menyeleksi halaman tengah lewat teks digital tanpa OCR)
KEYWORD_UTAMA = [
    "laporan auditor independen",
    "independent auditor",
    "independent auditors' report",
    "independent auditor's report",
    "hal audit utama",
    "key audit matter",
]

# Kata kunci pelengkap: dipakai untuk menerima hasil akhir suatu halaman.
KEYWORD_PELENGKAP = [
    "laporan auditor independen",
    "independent auditor",
    "independent auditors' report",
    "independent auditor's report",
    "hal audit utama",
    "key audit matter",
    "opini",
    "opinion",
    "basis opini",
    "basis for opinion",
    "tanggung jawab auditor",
    "auditors' responsibility",
    "auditor's responsibility",
    "auditors' responsibilities",
    "opini wajar tanpa pengecualian",
    "opini wajar",
    "unqualified opinion",
]

# Kata kunci untuk halaman KAM (Hal Audit Utama).
KEYWORD_KAM = [
    "hal audit utama",
    "key audit matter",
    "hal audit utama yang teridentifikasi",
    "the key audit matters identified",
    "kami menguraikan hal audit utama",
    "kami menentukan hal-hal tersebut",
    "how our audit addressed",
    "bagaimana audit kami merespons",
]

# ---------------------------------------------------------------------------
# Pre-compile semua pola regex SATU KALI saat modul di-import
# (menghindari recompile berulang di setiap halaman / pemanggilan fungsi)
# ---------------------------------------------------------------------------

def _build_patterns(keyword_list):
    """Kompilasi daftar kata kunci ke list pola regex case-insensitive."""
    return [re.compile(re.escape(kw), re.IGNORECASE) for kw in keyword_list]

_PATTERNS_UTAMA     = _build_patterns(KEYWORD_UTAMA)
_PATTERNS_PELENGKAP = _build_patterns(KEYWORD_PELENGKAP)
_PATTERNS_KAM       = _build_patterns(KEYWORD_KAM)


# ---------------------------------------------------------------------------
# Fungsi utilitas
# ---------------------------------------------------------------------------

def normalisasi_teks(teks):
    """Ratakan spasi & ubah ke huruf kecil agar pencocokan kata kunci tahan noise OCR."""
    return re.sub(r"\s+", " ", (teks or "").lower())


def _cocok_dengan_patterns(teks_normal, patterns):
    """
    Return True jika SALAH SATU pola dari `patterns` ditemukan dalam teks.
    Menggunakan re.search() yang jauh lebih cepat daripada sliding-window
    SequenceMatcher O(n×m).
    """
    if not teks_normal:
        return False
    return any(p.search(teks_normal) for p in patterns)


def punya_keyword_utama(teks):
    return _cocok_dengan_patterns(normalisasi_teks(teks), _PATTERNS_UTAMA)


def punya_keyword_pelengkap(teks):
    return _cocok_dengan_patterns(normalisasi_teks(teks), _PATTERNS_PELENGKAP)


def punya_keyword_kam(teks):
    return _cocok_dengan_patterns(normalisasi_teks(teks), _PATTERNS_KAM)


# ---------------------------------------------------------------------------
# OCR helpers (dua resolusi terpisah)
# ---------------------------------------------------------------------------

def teks_halaman_ocr_deteksi(halaman):
    """
    Pass 1 — OCR resolusi rendah (DPI_DETEKSI) untuk MENDETEKSI keyword.
    Jauh lebih cepat; cukup akurat untuk menemukan frasa seperti
    'laporan auditor independen' atau 'key audit matter'.
    """
    gambar = halaman.to_image(resolution=DPI_DETEKSI).original
    return pytesseract.image_to_string(gambar, lang="ind")


def teks_halaman_ocr_ekstraksi(halaman):
    """
    Pass 2 — OCR resolusi tinggi (DPI_EKSTRAKSI) hanya untuk halaman
    yang sudah TERKONFIRMASI mengandung opini/KAM.
    Menghasilkan teks berkualitas untuk scoring NLP.
    """
    gambar = halaman.to_image(resolution=DPI_EKSTRAKSI).original
    return pytesseract.image_to_string(gambar, lang="ind")


# ---------------------------------------------------------------------------
# Deteksi halaman kandidat
# ---------------------------------------------------------------------------

def daftar_halaman_kandidat(pdf, total_halaman):
    """
    Halaman yang harus diperiksa = depan + belakang + deteksi teks digital di tengah.

    Perubahan vs versi lama:
    - OCR_HALAMAN_DEPAN & BELAKANG dikurangi dari 15 → 10
    - Tambah early-exit: jika sudah menemukan ≥1 halaman KAM dan ≥1 halaman opini
      di zona tengah, tidak perlu meneruskan iterasi.
    - Pencocokan keyword di zona tengah menggunakan regex (bukan SequenceMatcher).
    """
    # Zona depan (selalu masuk kandidat)
    kandidat = set(range(min(total_halaman, OCR_HALAMAN_DEPAN)))

    # Zona belakang (selalu masuk kandidat)
    if total_halaman > OCR_HALAMAN_DEPAN:
        kandidat.update(
            range(
                max(OCR_HALAMAN_DEPAN, total_halaman - OCR_HALAMAN_BELAKANG),
                total_halaman
            )
        )

    # Zona tengah: hanya halaman dengan teks digital yang mengandung keyword utama
    if total_halaman > OCR_HALAMAN_DEPAN + OCR_HALAMAN_BELAKANG:
        found_opini = False
        found_kam = False

        for i in range(OCR_HALAMAN_DEPAN, total_halaman - OCR_HALAMAN_BELAKANG):
            teks = pdf.pages[i].extract_text() or ""

            # Lewati halaman yang teksnya terlalu pendek (kemungkinan scan)
            if len(teks.strip()) < AMBANG_TEKS_DIGITAL:
                continue

            if punya_keyword_utama(teks):
                kandidat.add(i)
                # Tandai jenis halaman yang ditemukan untuk early-exit
                if punya_keyword_kam(teks):
                    found_kam = True
                else:
                    found_opini = True

            # Early-exit: sudah ada halaman opini + KAM di tengah, zona tengah selesai
            if found_opini and found_kam:
                break

    return kandidat


# ---------------------------------------------------------------------------
# Ekstraksi teks utama (dua-pass OCR)
# ---------------------------------------------------------------------------

def ekstrak_teks_opini(pdf):
    """
    Sisir halaman kandidat (depan/belakang + tengah ber-keyword).

    Strategi dua-pass untuk halaman scan (tidak ada teks digital):
      Pass 1 — OCR 150 DPI: cepat, hanya untuk mendeteksi apakah halaman
               mengandung keyword pelengkap/opini.
      Pass 2 — OCR 300 DPI: kualitas, hanya dijalankan pada halaman yang
               sudah terkonfirmasi di Pass 1.

    Halaman digital (punya teks ≥ AMBANG_TEKS_DIGITAL karakter) langsung
    memakai extract_text() — tanpa OCR sama sekali.

    Mengembalikan daftar dict: {hal, teks, kategori}
    kategori: "opini" (halaman induk laporan auditor) atau "kam" (hal audit utama).
    """
    total_halaman = len(pdf.pages)
    kandidat = daftar_halaman_kandidat(pdf, total_halaman)

    hasil = []
    for i in sorted(kandidat):
        halaman = pdf.pages[i]
        teks_digital = halaman.extract_text() or ""

        if len(teks_digital.strip()) >= AMBANG_TEKS_DIGITAL:
            # Halaman teks digital: langsung pakai, tidak perlu OCR sama sekali
            teks_final = teks_digital
            perlu_ocr_ekstraksi = False
        else:
            # Halaman scan — Pass 1: deteksi cepat dengan 150 DPI
            teks_deteksi = teks_halaman_ocr_deteksi(halaman)
            if not punya_keyword_pelengkap(teks_deteksi):
                # Keyword tidak ditemukan di resolusi rendah → skip halaman ini
                continue
            # Keyword ditemukan → Pass 2: ekstraksi kualitas dengan 300 DPI
            teks_final = teks_halaman_ocr_ekstraksi(halaman)
            perlu_ocr_ekstraksi = True  # noqa: F841  (dokumentasi alur)

        if punya_keyword_pelengkap(teks_final):
            kategori = "kam" if punya_keyword_kam(teks_final) else "opini"
            hasil.append({"hal": i + 1, "teks": teks_final, "kategori": kategori})

    return hasil
