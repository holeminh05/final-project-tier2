const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// MongoDB Connection (Host is 'db' because of Docker Compose networking)
mongoose.connect('mongodb://db:27017/finalProjectDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send(`
        <h1>Hello from Tier 2 Final Project - live DEMO!</h1>
        <p>Server is running on Docker.</p>
        <p>Version: 1.0.0</p>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="myFile">
            <button type="submit">Upload File</button>
        </form>
    `);
});

app.post('/upload', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.send(`File ${req.file.filename} uploaded successfully!`);
});

// Health Check for Monitoring
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});