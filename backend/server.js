const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KAM-TRIDETECT Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes under /api
app.use('/api', apiRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'not_found',
    message: `Rute '${req.method} ${req.originalUrl}' tidak ditemukan pada server API.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[UNHANDLED SERVER ERROR]:', err.stack || err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Terjadi kesalahan internal pada server.',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`KAM-TRIDETECT API Server Active`);
  console.log(`Running on: http://localhost:${PORT}`);
  console.log(`=========================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `[ERROR] Port ${PORT} sedang digunakan oleh aplikasi lain! Silakan tutup aplikasi lain di port ${PORT} atau ubah PORT di .env.`
    );
  } else {
    console.error('[ERROR] Server failure:', err.message);
  }
});

module.exports = app;


module.exports = app;