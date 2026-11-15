import os
import shutil
import time
from fastapi import FastAPI, UploadFile, File
import pdfplumber
from cari_opini import ekstrak_teks_opini
from nlp_processor import IndonesianNLP

app = FastAPI(title="KAM-TRIDETECT NLP Engine")

# Instance tunggal processor (Sastrawi/NLTK diinisialisasi sekali saat startup)
nlp_processor = IndonesianNLP()


@app.get("/")
def baca_root():
    return {"message": "Selamat datang di KAM-TRIDETECT NLP Engine!"}


@app.post("/ekstrak-dan-proses")
async def ekstrak_opini(file: UploadFile = File(...)):
    t_start = time.perf_counter()
    print(f"\n{'='*60}")
    print(f"[NLP] Menerima file baru: {file.filename}")

    # 1. Simpan file PDF yang diunggah ke penyimpanan sementara
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    teks_opini_ditemukan = ""

    try:
        # 2. Proses PDF: depan + belakang + deteksi teks digital di tengah
        with pdfplumber.open(temp_file_path) as pdf:
            total_halaman = len(pdf.pages)
            print(f"[NLP] Total halaman: {total_halaman}")
            print(f"[NLP] Menyisir halaman kandidat (depan/belakang + teks digital)...")

            t_ekst = time.perf_counter()
            daftar = ekstrak_teks_opini(pdf)
            dur_ekst = time.perf_counter() - t_ekst

            print(f"[NLP] Ekstraksi selesai dalam {dur_ekst:.1f}s — "
                  f"{len(daftar)} halaman terdeteksi: "
                  f"{[(item['hal'], item['kategori']) for item in daftar]}")

            teks_opini_ditemukan = "\n".join(
                f"\n--- HALAMAN {item['hal']} ({item['kategori'].upper()}) ---\n{item['teks']}"
                for item in daftar
            )

        # 3. Hapus file sementara agar hard-disk server tidak penuh
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

        # 4. Kembalikan respons dalam format JSON ke Node.js / Frontend
        if teks_opini_ditemukan:
            # 4a. Jalankan scoring risiko Triple EM pada teks opini
            print("[NLP] Menjalankan NLP scoring (Sastrawi + stemming)...")
            t_nlp = time.perf_counter()
            hasil_nlp = nlp_processor.process_document(teks_opini_ditemukan)
            dur_nlp = time.perf_counter() - t_nlp

            skor_risiko = (
                hasil_nlp.get("data", {}).get("skor_risiko")
                if hasil_nlp.get("status") == "success"
                else None
            )

            dur_total = time.perf_counter() - t_start
            print(f"[NLP] Scoring selesai dalam {dur_nlp:.1f}s")
            print(f"[NLP] ✅ TOTAL WAKTU PEMROSESAN: {dur_total:.1f}s")
            print(f"{'='*60}\n")

            return {
                "status": "success",
                "emiten_file": file.filename,
                "data": teks_opini_ditemukan,
                "skor_risiko": skor_risiko,
                "durasi_detik": round(dur_total, 1),
            }
        else:
            dur_total = time.perf_counter() - t_start
            print(f"[NLP] ⚠️  Keyword opini tidak ditemukan. Durasi: {dur_total:.1f}s")
            print(f"{'='*60}\n")
            return {
                "status": "not_found",
                "emiten_file": file.filename,
                "message": "Kata kunci opini tidak ditemukan pada halaman depan/belakang maupun teks digital.",
                "durasi_detik": round(dur_total, 1),
            }

    except Exception as e:
        # Pastikan file sementara dihapus meskipun terjadi error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        dur_total = time.perf_counter() - t_start
        print(f"[NLP] ❌ ERROR setelah {dur_total:.1f}s: {e}")
        print(f"{'='*60}\n")
        return {"status": "error", "message": str(e), "durasi_detik": round(dur_total, 1)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
