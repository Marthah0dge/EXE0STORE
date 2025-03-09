
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure storage for PDF files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'exesoftware010@gmail.com',
    pass: 'lmgz etkx gude udar',
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// HTML to PDF conversion endpoint
app.post('/convert', (req, res) => {
  const htmlContent = req.body.htmlContent;
  
  if (!htmlContent) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  const options = {
    format: 'A4',
    border: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    },
    base: `file://${__dirname}/`,
    renderDelay: 1000,
    "httpHeaders": {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    },
    "timeout": 30000
  };

  // Generate a random password for the PDF
  const password = crypto.randomBytes(4).toString('hex');

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  pdf.create(htmlContent, options).toBuffer((err, buffer) => {
    if (err) {
      console.error('PDF generation error:', err);
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }
    
    // Save the PDF to a file
    const pdfPath = path.join(uploadsDir, `document-${Date.now()}.pdf`);
    fs.writeFileSync(pdfPath, buffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
    res.send(buffer);
  });
});

// Send PDF via email
app.post('/send-email', upload.single('pdfAttachment'), (req, res) => {
  const { fromName, subject, message, recipientEmail, password, scheduledDate } = req.body;
  
  if (!recipientEmail) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'PDF attachment is required' });
  }
  
  const pdfPath = req.file.path;
  const fileName = req.file.filename;

  // Prepare email content
  let emailSubject = subject || 'PDF Document';
  let emailText = '';
  
  // Add sender name if provided
  if (fromName) {
    emailText += `From: ${fromName}\n\n`;
  }
  
  // Add message if provided
  if (message) {
    emailText += `${message}\n\n`;
  }
  
  // Add password information if provided
  if (password) {
    emailText += `The attached PDF is password protected.\nPassword: ${password}\n\n`;
  }
  
  emailText += 'This email was sent via PDFForge.';

  // Prepare email options
  const mailOptions = {
    from: 'tuttyger@gmail.com',
    to: recipientEmail,
    subject: emailSubject,
    text: emailText,
    attachments: [
      {
        filename: fileName,
        path: pdfPath
      }
    ]
  };

  // Handle scheduled sending
  if (scheduledDate) {
    const scheduledTime = new Date(scheduledDate).getTime() - new Date().getTime();
    
    if (scheduledTime > 0) {
      setTimeout(() => {
        sendEmail(mailOptions, res);
      }, scheduledTime);
      
      return res.status(200).json({ 
        message: 'Email scheduled successfully',
        scheduledDate: scheduledDate
      });
    }
  }

  // Send immediately if no schedule or scheduled time has passed
  sendEmail(mailOptions, res);
});

function sendEmail(mailOptions, res) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending error:', error);
      if (res) {
        return res.status(500).json({ error: 'Failed to send email' });
      }
    } else {
      console.log('Email sent:', info.response);
      if (res) {
        return res.status(200).json({ message: 'Email sent successfully' });
      }
    }
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
