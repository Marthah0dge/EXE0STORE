
document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  }
  
  // Toggle mobile menu
  mobileMenuToggle.addEventListener('click', function() {
    mainNav.classList.toggle('show');
  });
  
  themeToggleBtn.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
  
  // Save PDF functionality
  const savePdfBtn = document.getElementById('save-pdf-btn');
  const saveModal = document.getElementById('save-modal');
  const closeSaveModal = document.querySelector('.close-save-modal');
  const generateNewKeyBtn = document.getElementById('generate-new-key');
  const confirmSaveBtn = document.getElementById('confirm-save');
  const cancelSaveBtn = document.getElementById('cancel-save');
  const pdfKeyElement = document.getElementById('pdf-key');
  const copyKeyBtn = document.getElementById('copy-key');
  
  // Load PDF functionality
  const loadPdfBtn = document.getElementById('load-pdf-btn');
  const loadModal = document.getElementById('load-modal');
  const closeLoadModal = document.querySelector('.close-load-modal');
  const accessKeyInput = document.getElementById('access-key');
  const loadSavedPdfBtn = document.getElementById('load-saved-pdf');
  const cancelLoadBtn = document.getElementById('cancel-load');
  const pdfInfoSection = document.getElementById('pdf-info');
  const loadedPdfName = document.getElementById('loaded-pdf-name');
  const loadedPdfDate = document.getElementById('loaded-pdf-date');
  const loadedPdfViews = document.getElementById('loaded-pdf-views');
  
  // Buy Tools functionality
  const buyToolsBtn = document.getElementById('buy-tools-btn');
  const buyToolsModal = document.getElementById('buy-tools-modal');
  const closeBuyModal = document.querySelector('.close-buy-modal');
  const closeBuyToolsBtn = document.getElementById('close-buy-tools');
  
  // Save PDF Modal
  savePdfBtn.addEventListener('click', function() {
    if (!pdfBlobUrl) {
      alert('Please generate a PDF first before saving.');
      return;
    }
    generatePdfKey();
    saveModal.style.display = 'block';
  });
  
  closeSaveModal.addEventListener('click', function() {
    saveModal.style.display = 'none';
  });
  
  cancelSaveBtn.addEventListener('click', function() {
    saveModal.style.display = 'none';
  });
  
  generateNewKeyBtn.addEventListener('click', function() {
    generatePdfKey();
  });
  
  copyKeyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(pdfKeyElement.textContent)
      .then(() => {
        copyKeyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyKeyBtn.textContent = 'Copy';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  });
  
  confirmSaveBtn.addEventListener('click', function() {
    const pdfName = document.getElementById('pdf-name').value || 'My Document';
    const pdfKey = pdfKeyElement.textContent;
    
    if (!pdfBlobUrl || !pdfKey) {
      alert('Unable to save PDF. Please try again.');
      return;
    }
    
    savePdfWithKey(pdfKey, pdfName);
  });
  
  // Load PDF Modal
  loadPdfBtn.addEventListener('click', function() {
    loadModal.style.display = 'block';
    pdfInfoSection.classList.add('hidden');
  });
  
  closeLoadModal.addEventListener('click', function() {
    loadModal.style.display = 'none';
  });
  
  cancelLoadBtn.addEventListener('click', function() {
    loadModal.style.display = 'none';
  });
  
  loadSavedPdfBtn.addEventListener('click', function() {
    const key = accessKeyInput.value.trim();
    if (!key) {
      alert('Please enter a valid access key');
      return;
    }
    
    loadPdfWithKey(key);
  });
  
  // Buy Tools Modal
  buyToolsBtn.addEventListener('click', function() {
    buyToolsModal.style.display = 'block';
  });
  
  closeBuyModal.addEventListener('click', function() {
    buyToolsModal.style.display = 'none';
  });
  
  closeBuyToolsBtn.addEventListener('click', function() {
    buyToolsModal.style.display = 'none';
  });
  
  const buyNowButtons = document.querySelectorAll('.buy-now-btn');
  buyNowButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      alert('This feature will be available soon. Thank you for your interest!');
    });
  });
  
  // PDF Key generation and storage functions
  function generatePdfKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 12; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pdfKeyElement.textContent = key;
  }
  
  function savePdfWithKey(key, name) {
    if (!pdfBlob && pdfBlobUrl) {
      // Fetch the blob from the URL if not already available
      fetch(pdfBlobUrl)
        .then(res => res.blob())
        .then(blob => {
          pdfBlob = blob;
          completeFileSave(key, name, blob);
        });
    } else if (pdfBlob) {
      completeFileSave(key, name, pdfBlob);
    } else {
      alert('No PDF to save. Please generate a PDF first.');
    }
  }
  
  function completeFileSave(key, name, blob) {
    // Create form data to send to server
    const formData = new FormData();
    formData.append('pdfKey', key);
    formData.append('pdfName', name);
    formData.append('pdfFile', blob, name + '.pdf');
    
    // Show loading indicator
    loadingOverlay.style.display = 'flex';
    
    // Send to server
    fetch('/save-pdf', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save PDF');
      }
      return response.json();
    })
    .then(data => {
      loadingOverlay.style.display = 'none';
      saveModal.style.display = 'none';
      alert(`PDF saved successfully! Your access key is: ${key}`);
    })
    .catch(error => {
      console.error('Error:', error);
      loadingOverlay.style.display = 'none';
      alert('Failed to save PDF: ' + error.message);
    });
  }
  
  function loadPdfWithKey(key) {
    // Show loading indicator
    loadingOverlay.style.display = 'flex';
    
    // Send request to server
    fetch(`/load-pdf/${key}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('PDF not found with this key');
      }
      return response.json();
    })
    .then(data => {
      loadingOverlay.style.display = 'none';
      
      // Display PDF info
      pdfInfoSection.classList.remove('hidden');
      loadedPdfName.textContent = data.name;
      loadedPdfDate.textContent = new Date(data.date).toLocaleString();
      loadedPdfViews.textContent = data.views;
      
      // Ask if user wants to load the PDF
      const loadConfirm = confirm(`Found PDF: ${data.name}\nDo you want to load it?`);
      if (loadConfirm) {
        // Load the PDF into the preview
        fetch(`/download-pdf/${key}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to download PDF');
          }
          return response.blob();
        })
        .then(blob => {
          // Create a URL for the blob
          pdfBlobUrl = window.URL.createObjectURL(blob);
          pdfBlob = blob;
          
          // Create iframe to display the PDF
          const iframe = document.createElement('iframe');
          iframe.src = pdfBlobUrl;
          
          // Clear preview and add iframe
          pdfPreview.innerHTML = '';
          pdfPreview.appendChild(iframe);
          
          // Close the modal
          loadModal.style.display = 'none';
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      loadingOverlay.style.display = 'none';
      alert('Error: ' + error.message);
    });
  }
  
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
