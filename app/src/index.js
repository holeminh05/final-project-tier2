const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// === CONFIGURATION ===
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://db:27017/final-project';

// === EJS SETUP ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === STATIC FILES ===
app.use(express.static(path.join(__dirname, 'public')));

// === MIDDLEWARE ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === FILE UPLOAD CONFIG ===
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// === DATABASE CONNECTION ===
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// === ROUTES ===

// Home page - renders our beautiful UI
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Final Project - Tier 2',
    version: '2.0.0'
  });
});

// Health check for Prometheus
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  res.json({ 
    success: true, 
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

// List uploaded files
app.get('/uploads', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read uploads' });
    res.json(files.filter(f => !f.startsWith('.')));
  });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// === START SERVER ===
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
