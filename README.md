# KAM-TRIDETECT

> **Professional Audit Intelligence Platform**  
> Deteksi Indikasi Risiko *Triple Earnings Management* (TEM) Berbasis OCR & NLP Bahasa Indonesia  
> Standar Acuan: **Standar Audit (SA) 701** — Hal Audit Utama (Key Audit Matters / KAM)

---

## 📌 Ringkasan Proyek

**KAM-TRIDETECT** adalah platform kecerdasan audit berbasis web yang dirancang untuk membantu auditor, komite audit, dan analis pasar modal mendeteksi indikasi risiko **Triple Earnings Management (TEM)** pada laporan keuangan tahunan emiten publik di Bursa Efek Indonesia (BEI).

Sistem mengekstraksi bagian naratif **Laporan Auditor Independen** (khususnya seksi **Hal Audit Utama / Key Audit Matters**) dari berkas PDF laporan keuangan menggunakan pendekatan hibrida (*Smart Digital Extraction + Tesseract OCR*), kemudian memproses teks bahasa Indonesia menggunakan *Natural Language Processing (NLP)* untuk mengukur frekuensi risiko pada **9 dimensi manipulasi laba** dan menyajikan skor risiko 0–100 secara terstruktur.


---

## 🚀 Fitur Utama

- **Dashboard KPI & Analitik Ringkas (Overview)**: Memantau total dokumen teranalisis, distribusi tingkat risiko (Tinggi, Sedang, Rendah), dan 5 dokumen audit terbaru.
- **Analisis Dokumen Interaktif (New Analysis)**: Area *drag-and-drop* berkas PDF dengan pemantau progres 4 tahap secara *real-time* dan visualisasi skor risiko 9 dimensi.
- **Arsip & Riwayat Audit (History)**: Daftar seluruh riwayat analisis dengan fitur pencarian instan, modal inspeksi detail transkrip opini, dan penghapusan data.
- **Two-Pass OCR & Regex Optimizer**: Pemindaian cepat 150 DPI untuk deteksi kata kunci dan 300 DPI untuk ekstraksi akurat, dipercepat dengan *compiled regular expressions*.
- **Sistem Notifikasi Kustom**: Dialog konfirmasi tindakan berbasis promise (*ConfirmModal*) dan notifikasi mengambang (*Toast Notification*) tanpa bergantung pada dialog bawaan browser.
- **Komparasi Emiten (Planned Feature)**: Kerangka kerja perbandingan profil risiko antar emiten terdaftar.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | React 19, Vite 8, React Icons (Feather Icons), CSS Modules (Design Tokens & Font Poppins) |
| **Backend API** | Node.js 18+, Express 5, Multer, MySQL2 Connection Pool, Axios |
| **NLP & OCR Engine** | Python 3.10+, FastAPI, Uvicorn, pdfplumber, Tesseract OCR 5.x (`lang="ind"`), Sastrawi, NLTK |
| **Database** | MySQL 8.0+ / MariaDB |

---

## 📋 Prasyarat Sistem

Sebelum menjalankan sistem, pastikan perangkat Anda telah terpasang:
1. **Node.js** (versi 18.x atau lebih baru) & **npm**
2. **Python** (versi 3.10 s/d 3.14) & `pip`
3. **MySQL Server** (dapat menggunakan Laragon, XAMPP, atau MySQL Community Server)
4. **Tesseract-OCR** untuk Windows:
   - Unduh dari repositori resmi UB-Mannheim.
   - Pastikan opsi **Indonesian language pack (`ind`)** dicentang saat instalasi.
   - Lokasi instalasi standar: `C:\Program Files\Tesseract-OCR\tesseract.exe`.

---

## ⚡ Panduan Memulai Cepat (Quick Start)

Jalankan ketiga layanan pada **3 terminal terpisah**:

### 1. Siapkan Basis Data MySQL
Jalankan perintah SQL berikut di MySQL Client / phpMyAdmin:
```sql
CREATE DATABASE IF NOT EXISTS kam_tridetect;
USE kam_tridetect;

CREATE TABLE IF NOT EXISTS dokumen_audit (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nama_file      VARCHAR(255) NOT NULL,
    status_proses  ENUM('success','error') NOT NULL DEFAULT 'success',
    skor_total     FLOAT NULL,
    tingkat_risiko VARCHAR(20) NULL,
    detail_skor    JSON NULL,
    teks_opini     LONGTEXT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Jalankan Python NLP Engine (Port 8000)
```powershell
cd nlp-engine
python -m venv env
.\env\Scripts\activate
pip install -r requirements.txt
python main.py
```
> Layanan berjalan pada `http://127.0.0.1:8000`.

### 3. Jalankan Backend Node.js (Port 5000)
Pastikan berkas `backend/.env` telah terkonfigurasi:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=kam_tridetect
PORT=5000
```
Lalu jalankan:
```powershell
cd backend
npm install
npm run dev
```
> Layanan berjalan pada `http://localhost:5000`.

### 4. Jalankan Frontend React (Port 5173)
```powershell
cd frontend
npm install
npm run dev
```
> Buka browser dan akses **`http://localhost:5173`**.

---

## 📁 Struktur Direktori Proyek

```
kam-tridetect/
├── backend/                  # REST API server (Node.js & Express)
│   ├── config/               # Konfigurasi multer & storage
│   ├── controllers/          # Controller per domain (analysis, document, stats)
│   ├── routes/               # Modular Express router
│   ├── services/             # Background job orchestrator (jobService.js)
│   ├── db.js                 # Database connection pool
│   └── server.js             # Entrypoint server Express
│
├── frontend/                 # Web client (React 19 & Vite 8)
│   ├── public/               # Asset statis (logo.png, favicon)
│   └── src/
│       ├── components/       # Komponen antarmuka & per-component styling (.css)
│       ├── context/          # NotificationContext (Toast & ConfirmModal)
│       ├── constants/        # Metadata dimensi & konfigurasi UI
│       └── App.jsx           # Root layout & navigasi aplikasi
│
├── nlp-engine/               # Mesin ekstraksi OCR & NLP (Python & FastAPI)
│   ├── cari_opini.py         # Smart candidate filtering & two-pass OCR
│   ├── nlp_processor.py      # Sastrawi stemmer & formula skoring risiko
│   ├── main.py               # API endpoint FastAPI
│   └── requirements.txt      # Dependensi pustaka Python
│
├── dokumentasi.md            # Dokumentasi komprehensif teori, metodologi, & API
└── README.md                 # Berkas petunjuk utama proyek ini
```

---

## 📄 Lisensi & Referensi

Platform ini dikembangkan untuk tujuan riset akademik, audit forensik, dan tata kelola emiten berbasis *Design Science Research* (DSR).

- **Dokumentasi Mendalam**: Lihat **[dokumentasi.md](dokumentasi.md)**
- **Standar Terkait**: Standar Audit 701 (SA 701), Standar Audit 240 (SA 240), PSAK 71, 72, 73, dan kerangka *Earnings Management*.
