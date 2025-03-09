
document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  }
  
  themeToggleBtn.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
  
  // Editor Tools
  const editor = document.getElementById('editor');
  const addTextBtn = document.getElementById('add-text');
  const addHeadingBtn = document.getElementById('add-heading');
  const addImageBtn = document.getElementById('add-image');
  const clearBtn = document.getElementById('clear-btn');
  
  addTextBtn.addEventListener('click', function() {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'New paragraph text...';
    editor.appendChild(paragraph);
    focusElement(paragraph);
  });
  
  addHeadingBtn.addEventListener('click', function() {
    const heading = document.createElement('h2');
    heading.textContent = 'New Heading';
    editor.appendChild(heading);
    focusElement(heading);
  });
  
  addImageBtn.addEventListener('click', function() {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.maxWidth = '100%';
      editor.appendChild(img);
    }
  });
  
  clearBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all content?')) {
      editor.innerHTML = '<h1>Your Document Title</h1><p>Start editing your document here...</p>';
      const pdfPreview = document.getElementById('pdf-preview');
      pdfPreview.innerHTML = '<p>PDF preview will appear here</p>';
    }
  });
  
  function focusElement(element) {
    // Create a range and selection
    const range = document.createRange();
    const selection = window.getSelection();
    
    // Set the range to encompass the element's content
    range.selectNodeContents(element);
    
    // Clear current selection and add the new range
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Focus the editor
    editor.focus();
  }
  
  // HTML Upload and Paste
  const htmlUpload = document.getElementById('html-upload');
  const pasteHtmlBtn = document.getElementById('paste-html');
  
  htmlUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const htmlContent = event.target.result;
        processHtmlContent(htmlContent);
      };
      reader.readAsText(file);
    }
  });
  
  pasteHtmlBtn.addEventListener('click', function() {
    const pastedHtml = prompt('Paste your HTML code here:');
    if (pastedHtml) {
      processHtmlContent(pastedHtml);
    }
  });
  
  function processHtmlContent(htmlContent) {
    try {
      // Create a temporary element to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Extract the body content if present
      const bodyContent = tempDiv.querySelector('body') ? 
                          tempDiv.querySelector('body').innerHTML : 
                          tempDiv.innerHTML;
      
      // Update the editor
      editor.innerHTML = bodyContent;
      
      // Show success message
      showToast('HTML content loaded successfully!');
    } catch (error) {
      console.error('Error parsing HTML:', error);
      alert('Failed to parse HTML content. Please check your HTML syntax.');
    }
  }
  
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.padding = '10px 20px';
    toast.style.background = 'var(--success)';
    toast.style.color = 'white';
    toast.style.borderRadius = 'var(--border-radius)';
    toast.style.zIndex = '1000';
    toast.style.boxShadow = 'var(--shadow)';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  }
  
  // Company Logo Search with Clearbit API
  const companyNameInput = document.getElementById('company-name');
  const searchCompanyBtn = document.getElementById('search-company');
  const logoPreview = document.getElementById('logo-preview');
  
  searchCompanyBtn.addEventListener('click', searchCompanyLogo);
  companyNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchCompanyLogo();
    }
  });
  
  function searchCompanyLogo() {
    const companyName = companyNameInput.value.trim();
    if (!companyName) return;
    
    const logoUrl = `https://logo.clearbit.com/${encodeURIComponent(companyName)}`;
    
    // Create image element
    const img = document.createElement('img');
    img.onerror = function() {
      logoPreview.innerHTML = '<p style="color: var(--text-secondary);">Logo not found</p>';
    };
    
    img.onload = function() {
      logoPreview.innerHTML = '';
      logoPreview.appendChild(img);
      
      // Add the logo to the editor if requested
      const addToDoc = confirm('Do you want to add this logo to your document?');
      if (addToDoc) {
        const imgForDoc = document.createElement('img');
        imgForDoc.src = logoUrl;
        imgForDoc.style.maxWidth = '200px';
        imgForDoc.style.margin = '1rem 0';
        editor.appendChild(imgForDoc);
      }
    };
    
    img.src = logoUrl;
  }
  
  // Preview PDF functionality
  const previewBtn = document.getElementById('preview-btn');
  const pdfPreview = document.getElementById('pdf-preview');
  
  previewBtn.addEventListener('click', function() {
    const htmlContent = editor.innerHTML;
    
    // Show loading message in preview
    pdfPreview.innerHTML = '<div class="spinner"></div><p>Generating preview...</p>';
    
    // Format HTML with inline styles for PDF
    const styledHTML = createStyledHTML(htmlContent);
    
    // Send the HTML to the server for PDF conversion
    fetch('/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ htmlContent: styledHTML }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to generate PDF preview');
      }
      return response.blob();
    })
    .then(blob => {
      // Create an object URL for the PDF
      const url = window.URL.createObjectURL(blob);
      
      // Create iframe to display the PDF
      const iframe = document.createElement('iframe');
      iframe.src = url;
      
      // Clear preview and add iframe
      pdfPreview.innerHTML = '';
      pdfPreview.appendChild(iframe);
    })
    .catch(error => {
      console.error('Error:', error);
      pdfPreview.innerHTML = `<p style="color: red;">Failed to generate preview: ${error.message}</p>`;
    });
  });
  
  // Convert to PDF functionality
  const convertBtn = document.getElementById('convert-btn');
  const loadingOverlay = document.getElementById('loading-overlay');
  const donationModal = document.getElementById('donation-modal');
  const downloadPdfBtn = document.getElementById('download-pdf');
  let pdfBlobUrl = null;
  
  convertBtn.addEventListener('click', function() {
    // Show loading overlay
    loadingOverlay.style.display = 'flex';
    
    // Get the HTML content
    const htmlContent = editor.innerHTML;
    
    // Create styled HTML for PDF
    const styledHTML = createStyledHTML(htmlContent);
    
    // Simulate 6 seconds loading time
    setTimeout(() => {
      // Send the HTML to the server for PDF conversion
      fetch('/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent: styledHTML }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to generate PDF');
        }
        return response.blob();
      })
      .then(blob => {
        // Create a URL for the blob
        pdfBlobUrl = window.URL.createObjectURL(blob);
        
        // Hide loading overlay
        loadingOverlay.style.display = 'none';
        
        // Show donation modal
        donationModal.style.display = 'block';
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to generate PDF: ' + error.message);
        loadingOverlay.style.display = 'none';
      });
    }, 6000); // 6 seconds delay
  });
  
  function createStyledHTML(htmlContent) {
    // Add styles to preserve links and formatting in PDF
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            color: #333; 
            margin: 0;
            padding: 20px;
          }
          h1 { color: #4e54c8; margin-bottom: 20px; }
          h2 { color: #5930b5; margin-top: 25px; margin-bottom: 15px; }
          p { margin-bottom: 15px; line-height: 1.5; }
          a { color: #4e54c8; text-decoration: underline; }
          img { max-width: 100%; margin: 15px 0; }
          table { border-collapse: collapse; width: 100%; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          ul, ol { margin-bottom: 15px; padding-left: 20px; }
          li { margin-bottom: 5px; }
          @page { margin: 1cm; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  }
  
  // Donation Modal Functionality
  const closeModalBtns = document.querySelectorAll('.close-modal, #close-modal');
  const copyAddressBtn = document.getElementById('copy-address');
  const walletAddress = document.querySelector('.wallet-address');
  const sendEmailBtn = document.getElementById('send-email-btn');
  const emailModal = document.getElementById('email-modal');
  const closeEmailModalBtn = document.querySelector('.close-email-modal');
  const cancelEmailBtn = document.getElementById('cancel-email');
  const emailForm = document.getElementById('email-form');
  const generatePasswordBtn = document.getElementById('generate-password');
  const pdfPasswordInput = document.getElementById('pdf-password');
  let pdfBlob = null;
  
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      donationModal.style.display = 'none';
    });
  });
  
  copyAddressBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(walletAddress.textContent)
      .then(() => {
        copyAddressBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyAddressBtn.textContent = 'Copy Address';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy address: ' + err.message);
      });
  });
  
  downloadPdfBtn.addEventListener('click', function() {
    if (pdfBlobUrl) {
      const a = document.createElement('a');
      a.href = pdfBlobUrl;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(pdfBlobUrl);
      }, 100);
      
      // Close modal after download starts
      donationModal.style.display = 'none';
    }
  });
  
  // Email Modal Functionality
  sendEmailBtn.addEventListener('click', function() {
    donationModal.style.display = 'none';
    emailModal.style.display = 'block';
    
    // Store the PDF blob for sending
    if (pdfBlobUrl) {
      fetch(pdfBlobUrl)
        .then(res => res.blob())
        .then(blob => {
          pdfBlob = blob;
        });
    }
  });
  
  closeEmailModalBtn.addEventListener('click', function() {
    emailModal.style.display = 'none';
  });
  
  cancelEmailBtn.addEventListener('click', function() {
    emailModal.style.display = 'none';
  });
  
  // Generate random password
  generatePasswordBtn.addEventListener('click', function() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pdfPasswordInput.value = password;
  });
  
  // Submit email form
  emailForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!pdfBlob) {
      alert('PDF file not found. Please try generating the PDF again.');
      return;
    }
    
    const recipientEmail = document.getElementById('recipient-email').value;
    const fromName = document.getElementById('from-name').value;
    const subject = document.getElementById('email-subject').value;
    const message = document.getElementById('email-message').value;
    const password = document.getElementById('pdf-password').value;
    const scheduleDate = document.getElementById('schedule-date').value;
    
    const formData = new FormData();
    formData.append('recipientEmail', recipientEmail);
    formData.append('fromName', fromName);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('password', password);
    if (scheduleDate) {
      formData.append('scheduledDate', scheduleDate);
    }
    
    // Add the PDF as an attachment
    formData.append('pdfAttachment', pdfBlob, 'document.pdf');
    
    // Show loading indicator
    loadingOverlay.style.display = 'flex';
    
    // Send the email
    fetch('/send-email', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      return response.json();
    })
    .then(data => {
      loadingOverlay.style.display = 'none';
      emailModal.style.display = 'none';
      alert(data.scheduledDate ? 
        `Email scheduled to be sent on ${new Date(data.scheduledDate).toLocaleString()}` : 
        'Email sent successfully!');
      emailForm.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      loadingOverlay.style.display = 'none';
      alert('Failed to send email: ' + error.message);
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === donationModal) {
      donationModal.style.display = 'none';
    }
  });
  
  // Add subtle animations for UI elements
  const buttons = document.querySelectorAll('.tool-btn, .action-btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});
