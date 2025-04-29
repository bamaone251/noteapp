const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let messages = [];

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// POST message with image upload
app.post('/api/messages', upload.single('image'), (req, res) => {
  const { username, text } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const message = {
    id: Date.now(),
    username,
    text,
    image,
    timestamp: new Date().toLocaleString()
  };

  messages.push(message);
  res.status(201).json(message);
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const index = messages.findIndex(m => m.id === parseInt(id));
  if (index !== -1) {
    const removed = messages.splice(index, 1);
    res.json(removed[0]);
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
