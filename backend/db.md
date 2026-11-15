CREATE DATABASE IF NOT EXISTS db_kam_tridetect;

USE db_kam_tridetect;

CREATE TABLE IF NOT EXISTS dokumen_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_file VARCHAR(255) NOT NULL,
    status_proses VARCHAR(50) DEFAULT 'Selesai',
    teks_opini TEXT,
    tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);