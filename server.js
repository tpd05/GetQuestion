const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { processQuestions } = require('./utils/questionProcessor');
const { generateWordDocument } = require('./utils/wordGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', async (req, res) => {
  try {
    const { data, options } = req.body;
    
    if (!data) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided' 
      });
    }

    // Process the questions using the utility function
    const result = await processQuestions(data, options);
    
    res.json({
      success: true,
      questions: result.questions,
      totalProcessed: result.totalProcessed,
      duplicatesRemoved: result.duplicatesRemoved
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// File upload endpoint (for backward compatibility)
app.post('/upload-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fs = require('fs');
    const data = fs.readFileSync(req.file.path, 'utf8');
    const jsonData = JSON.parse(data);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    const { count, questions } = processQuestions(jsonData);

    res.json({ count, questions });
  } catch (err) {
    res.status(500).json({ error: `Error processing file: ${err.message}` });
  }
});

// API endpoint to get processed questions
app.get('/api/questions', (req, res) => {
  res.json({ message: "Use POST /upload to process questions" });
});

// Export to Word endpoint
app.post('/export-word', async (req, res) => {
  try {
    const questions = req.body;
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "No questions data provided" });
    }

    const docxBuffer = await generateWordDocument(questions);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="questions.docx"');
    res.send(docxBuffer);
  } catch (err) {
    res.status(500).json({ error: `Error generating Word document: ${err.message}` });
  }
});

// Export to RTF endpoint (safer alternative)
// RTF export removed per request

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📁 Static files served from: ${path.join(__dirname, 'public')}`);
  console.log(`🔄 Development mode: ${process.env.NODE_ENV === 'development' ? 'enabled' : 'disabled'}`);
});
