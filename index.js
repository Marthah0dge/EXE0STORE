
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
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Simple in-memory storage for users and orders
// In a real app, you would use a database
const users = [];
const orders = [];

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

// PDF storage with key management
const pdfStorage = {};

// Save PDF with generated key
app.post('/save-pdf', upload.single('pdfFile'), (req, res) => {
  const { pdfKey, pdfName } = req.body;
  
  if (!pdfKey || !req.file) {
    return res.status(400).json({ error: 'Missing required data' });
  }
  
  // Store PDF information
  pdfStorage[pdfKey] = {
    name: pdfName || 'Document',
    filePath: req.file.path,
    date: new Date(),
    views: 0
  };
  
  res.status(200).json({ success: true, key: pdfKey });
});

// Retrieve PDF information
app.get('/load-pdf/:key', (req, res) => {
  const { key } = req.params;
  
  if (!pdfStorage[key]) {
    return res.status(404).json({ error: 'PDF not found' });
  }
  
  // Increment view count
  pdfStorage[key].views += 1;
  
  res.status(200).json({
    name: pdfStorage[key].name,
    date: pdfStorage[key].date,
    views: pdfStorage[key].views
  });
});

// Download PDF by key
app.get('/download-pdf/:key', (req, res) => {
  const { key } = req.params;
  
  if (!pdfStorage[key]) {
    return res.status(404).json({ error: 'PDF not found' });
  }
  
  const filePath = pdfStorage[key].filePath;
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'PDF file not found on server' });
  }
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${pdfStorage[key].name}.pdf`);
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
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

// Authentication routes
app.post('/auth/signup', (req, res) => {
  const { fullname, email, password } = req.body;
  
  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    fullname,
    email,
    password: hashPassword(password), // In a real app, you'd hash the password
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  // Return user info (without password)
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(user => user.email === email);
  
  // Check if user exists and password matches
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Return user info (without password)
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({ user: userWithoutPassword });
});

// Order processing
app.post('/process-order', (req, res) => {
  const { orderNumber, email, items, total, date } = req.body;
  
  // Create order
  const newOrder = {
    id: uuidv4(),
    orderNumber,
    email,
    items,
    total,
    date,
    status: 'pending'
  };
  
  orders.push(newOrder);
  
  // Send confirmation email
  const mailOptions = {
    from: 'exesoftware010@gmail.com',
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    text: `
      Thank you for your order with PDFForge!
      
      Order Number: ${orderNumber}
      Total: $${total.toFixed(2)}
      Date: ${new Date(date).toLocaleString()}
      
      Your order is being processed and will be ready within 24 hours.
      Our representative will contact you with access to your purchased tools.
      
      Payment Information:
      Please send the exact amount to the following Bitcoin address:
      bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
      
      Thank you for choosing PDFForge!
    `
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Order confirmation email error:', error);
    } else {
      console.log('Order confirmation email sent:', info.response);
    }
  });
  
  res.status(201).json({ 
    success: true, 
    order: newOrder 
  });
});

// Helper function to hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
