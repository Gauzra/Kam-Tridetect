# nlp-engine/nlp_processor.py
import re

import nltk

try:
    from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
    from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
    from nltk.tokenize import word_tokenize
except ImportError:
    # Fallback agar modul tetap bisa diimpor tanpa Sastrawi/NLTK terpasang
    StopWordRemoverFactory = None
    StemmerFactory = None
    word_tokenize = None

# Download data pendukung NLTK (hanya perlu sekali)
if word_tokenize is not None:
    for resource in ('tokenizers/punkt', 'tokenizers/punkt_tab'):
        try:
            nltk.data.find(resource)
        except LookupError:
            nltk.download(resource.split('/')[-1])


class IndonesianNLP:
    """
    Preprocessing teks Bahasa Indonesia (cleaning, stopword, stemming) ditambah
    skoring risiko Triple Earnings Management berdasarkan frekuensi kata kunci
    risiko yang muncul pada bagian Hal Audit Utama (KAM).
    """

    def __init__(self):
        if StopWordRemoverFactory is not None:
            stopword_factory = StopWordRemoverFactory()
            self.stopword_remover = stopword_factory.create_stop_word_remover()
            stemmer_factory = StemmerFactory()
            self.stemmer = stemmer_factory.create_stemmer()
        else:
            self.stopword_remover = None
            self.stemmer = None

    # ------------------------------------------------------------------ #
    # 1. Preprocessing dasar
    # ------------------------------------------------------------------ #
    def clean_text(self, text):
        """Case folding + hapus karakter non-alfabet, pertahankan spasi."""
        if not text:
            return ""

        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def ekstrak_bagian_kam(self, raw_text):
        """
        Ambil hanya bagian Hal Audit Utama (KAM) dari teks hasil ekstraksi.
        Mengembalikan string yang memuat KAM (atau seluruh teks bila tidak terlihat).
        """
        if not raw_text:
            return ""

        teks = raw_text
        # Penanda mulai KAM (Bahasa Indonesia / Inggris, kuat publikasi KAM)
        pola_mulai = re.compile(
            r'(hal audit utama yang teridentifikasi|'
            r'the key audit matters identified|'
            r'hal audit utama yang teridentifikasi dalam audit kami|'
            r'kami menguraikan hal audit utama)',
            re.IGNORECASE,
        )
        cocok = pola_mulai.search(teks)
        if cocok:
            return teks[cocok.start():]
        return teks

    # ------------------------------------------------------------------ #
    # 2. Kata kunci risiko Triple Earnings Management
    # ------------------------------------------------------------------ #
    # Setiap dimensi memuat frasa/kata penanda risiko. Kata disimpan dalam bentuk
    # "stem" (akar kata) agar cocok dengan hasil stemming Sastrawi.
    KATA_KUNCI_RISIKO = {
        "pengakuan_pendapatan": [
            "pendapatan", "pengakuan", "kontrak", "percentage", "persentase",
            "penyelesaian", "revenue", "recognition", "estimasi",
        ],
        "aset_taklancar_dan_investasi": [
            "aset", "investasi", "impairment", "penurunan", "nilai", "goodwill",
            "ekuitas", "asset", "properti", "inventaris",
        ],
        "piutang_dan_kas": [
            "piutang", "kas", "bank", "receivable", "putang", "kas dan setara",
        ],
        "persediaan_dan_biaya": [
            "persediaan", "biaya", "inventory", "stok", "beban", "cost",
        ],
        "utang_dan_liabilitas": [
            "utang", "liabilitas", "pinjam", "hutang", "liability", "obligasi",
            "sewa", "lease",
        ],
        "going_concern": [
            "going", "concern", "kelangsungan", "usaha", "likuidit", "likuidasi",
        ],
        "estimasi_dan_pertimbangan": [
            "estimasi", "pertimbangan", "judgement", "asumsi", "ketidakpastian",
            "uncertainty", "kemungkinan",
        ],
        "kecurangan": [
            "kecurangan", "fraud", "manipulasi", "penyelewengan", "salah saji",
        ],
        "pajak": [
            "pajak", "tax", "pajak tangguhan", "deferred",
        ],
    }

    def hitung_frekuensi_kata_risiko(self, stemmed_text):
        """Hitung jumlah kemunculan tiap kata kunci risiko pada teks yang sudah distem."""
        # Token set untuk akses cepat
        token = stemmed_text.lower().split()

        hasil_dimensi = {}
        total_kemunculan = 0
        for dimensi, kata_list in self.KATA_KUNCI_RISIKO.items():
            jumlah = 0
            for kata in kata_list:
                # Kata kunci bisa berupa frasa multi-kata; cek substring dalam stemmed_text
                if len(kata.split()) > 1:
                    jumlah += stemmed_text.lower().count(kata)
                else:
                    jumlah += token.count(kata)
            hasil_dimensi[dimensi] = jumlah
            total_kemunculan += jumlah

        return hasil_dimensi, total_kemunculan

    # ------------------------------------------------------------------ #
    # 3. Skoring
    # ------------------------------------------------------------------ #
    @staticmethod
    def hitung_skor(total_kemunculan, jumlah_kata):
        """
        Normalisasi skor 0-100 berdasarkan kepadatan kata risiko.
        jumlah_kata = banyak kata pada bagian KAM.
        """
        if jumlah_kata <= 0:
            return 0.0
        # 2 kata risiko per 100 kata => skor penuh (heuristik). Jumlah kata kunci
        # berbeda per dokumen; gunakan pembagi yang relatif agar antar-emiten sebanding.
        rasio = total_kemunculan / jumlah_kata * 100
        skor = min(100.0, rasio * 10.0)
        return round(skor, 2)

    @staticmethod
    def tingkat_risiko(skor):
        """Peta skor ke label risiko."""
        if skor >= 60:
            return "TINGGI"
        if skor >= 30:
            return "SEDANG"
        return "RENDAH"

    # ------------------------------------------------------------------ #
    # 4. Pipeline utama
    # ------------------------------------------------------------------ #
    def process_document(self, raw_text):
        """Pipeline utama: preprocessing + skoring risiko Triple EM."""
        if not raw_text or raw_text in ("Gagal", "error", "not_found"):
            return {
                "status": "error",
                "message": "Tidak ada teks untuk diproses"
            }

        # Fokus skoring pada bagian KAM
        teks_kam = self.ekstrak_bagian_kam(raw_text)

        # 1. Cleaning & lowercasing
        cleaned_text = self.clean_text(teks_kam)

        # 2. Hapus stopwords
        if self.stopword_remover is not None:
            text_no_stopwords = self.stopword_remover.remove(cleaned_text)
        else:
            text_no_stopwords = cleaned_text

        # 3. Tokenisasi + stemming
        if word_tokenize is not None:
            tokens = word_tokenize(text_no_stopwords)
        else:
            tokens = text_no_stopwords.split()

        if self.stemmer is not None:
            stemmed_tokens = [self.stemmer.stem(t) for t in tokens]
        else:
            stemmed_tokens = tokens

        final_text = ' '.join(stemmed_tokens)

        # 4. Skoring risiko
        frekuensi, total_kemunculan = self.hitung_frekuensi_kata_risiko(final_text)
        jumlah_kata = len(stemmed_tokens)
        skor = self.hitung_skor(total_kemunculan, jumlah_kata)
        tingkat = self.tingkat_risiko(skor)

        word_count_raw = len(raw_text.split())
        reduction = (
            f"{((word_count_raw - jumlah_kata) / word_count_raw * 100):.2f}%"
            if word_count_raw else "0.00%"
        )

        return {
            "status": "success",
            "data": {
                "raw_text": raw_text,
                "cleaned_text": cleaned_text,
                "final_stemmed_text": final_text,
                "stats": {
                    "raw_word_count": word_count_raw,
                    "processed_word_count": jumlah_kata,
                    "reduction_rate": reduction,
                },
                "skor_risiko": {
                    "skor": skor,
                    "tingkat": tingkat,
                    "total_kemunculan_kata_risiko": total_kemunculan,
                    "frekuensi_per_dimensi": frekuensi,
                },
            },
        }


if __name__ == "__main__":
    nlp = IndonesianNLP()
    teks_uji = (
        "Hal Audit Utama: Pengakuan pendapatan dari kontrak konstruksi. "
        "Kami berfokus pada piutang dan persediaan serta estimasi atas going concern "
        "perusahaan. Terdapat risiko kecurangan dan salah saji material."
    )
    hasil = nlp.process_document(teks_uji)
    import json
    print(json.dumps(hasil, indent=2))