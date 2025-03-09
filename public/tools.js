
document.addEventListener('DOMContentLoaded', function() {
  // Tool categories
  const toolsData = {
    bank: [
      { id: 'bank-1', name: 'Citizen Page', price: 30, category: 'bank', description: 'Complete access to Citizen financial services page' },
      { id: 'bank-2', name: 'Bank of America Page', price: 100, category: 'bank', description: 'Complete access to Bank of America banking services page' },
      { id: 'bank-3', name: 'Chase Page', price: 85, category: 'bank', description: 'Complete access to Chase banking services page' },
      { id: 'bank-4', name: 'Wells Fargo Page', price: 80, category: 'bank', description: 'Complete access to Wells Fargo banking services page' },
      { id: 'bank-5', name: 'Citibank Page', price: 75, category: 'bank', description: 'Complete access to Citibank banking services page' },
      { id: 'bank-6', name: 'TD Bank Page', price: 70, category: 'bank', description: 'Complete access to TD Bank banking services page' },
      { id: 'bank-7', name: 'Capital One Page', price: 65, category: 'bank', description: 'Complete access to Capital One banking services page' },
      { id: 'bank-8', name: 'RBC Page', price: 90, category: 'bank', description: 'Complete access to Royal Bank of Canada services page' },
      { id: 'bank-9', name: 'Barclays Page', price: 95, category: 'bank', description: 'Complete access to Barclays banking services page' },
      { id: 'bank-10', name: 'HSBC Page', price: 100, category: 'bank', description: 'Complete access to HSBC banking services page' }
    ],
    email: [
      { id: 'email-1', name: 'Gmail Page', price: 150, category: 'email', description: 'Complete access to Gmail email services page' },
      { id: 'email-2', name: 'Office365 Page', price: 120, category: 'email', description: 'Complete access to Office365 email services page' },
      { id: 'email-3', name: 'Yahoo Page', price: 100, category: 'email', description: 'Complete access to Yahoo email services page' },
      { id: 'email-4', name: 'AOL Page', price: 80, category: 'email', description: 'Complete access to AOL email services page' },
      { id: 'email-5', name: 'AT&T Page', price: 90, category: 'email', description: 'Complete access to AT&T email services page' },
      { id: 'email-6', name: 'Outlook Page', price: 110, category: 'email', description: 'Complete access to Outlook email services page' },
      { id: 'email-7', name: 'ProtonMail Page', price: 140, category: 'email', description: 'Complete access to ProtonMail email services page' },
      { id: 'email-8', name: 'Zoho Page', price: 95, category: 'email', description: 'Complete access to Zoho email services page' },
      { id: 'email-9', name: 'iCloud Page', price: 130, category: 'email', description: 'Complete access to iCloud email services page' },
      { id: 'email-10', name: 'GMX Page', price: 85, category: 'email', description: 'Complete access to GMX email services page' }
    ],
    shopping: [
      { id: 'shop-1', name: 'Amazon Page', price: 50, category: 'shopping', description: 'Complete access to Amazon shopping page' },
      { id: 'shop-2', name: 'eBay Page', price: 45, category: 'shopping', description: 'Complete access to eBay shopping page' },
      { id: 'shop-3', name: 'Walmart Page', price: 40, category: 'shopping', description: 'Complete access to Walmart shopping page' },
      { id: 'shop-4', name: 'Buy.com Page', price: 35, category: 'shopping', description: 'Complete access to Buy.com shopping page' },
      { id: 'shop-5', name: 'Western Union Page', price: 50, category: 'shopping', description: 'Complete access to Western Union page' },
      { id: 'shop-6', name: 'Netflix Page', price: 30, category: 'shopping', description: 'Complete access to Netflix page' },
      { id: 'shop-7', name: 'Prime Page', price: 40, category: 'shopping', description: 'Complete access to Amazon Prime page' },
      { id: 'shop-8', name: 'Best Buy Page', price: 35, category: 'shopping', description: 'Complete access to Best Buy shopping page' },
      { id: 'shop-9', name: 'Target Page', price: 30, category: 'shopping', description: 'Complete access to Target shopping page' },
      { id: 'shop-10', name: 'Etsy Page', price: 35, category: 'shopping', description: 'Complete access to Etsy shopping page' }
    ],
    smtp: [
      { id: 'smtp-1', name: 'AWS SMTP', price: 800, category: 'smtp', description: '60k sending limit, 24hr limit rotate restore' },
      { id: 'smtp-2', name: 'Office 365 SMTP', price: 45, category: 'smtp', description: 'Reliable Office 365 SMTP service' },
      { id: 'smtp-3', name: 'Google Admin SMTP', price: 25, category: 'smtp', description: 'Google Admin SMTP service' },
      { id: 'smtp-4', name: 'Gmail SMTP', price: 15, category: 'smtp', description: 'Gmail SMTP service' },
      { id: 'smtp-5', name: 'Yahoo SMTP', price: 23, category: 'smtp', description: 'Yahoo SMTP service' },
      { id: 'smtp-6', name: 'iCloud SMTP', price: 35, category: 'smtp', description: 'iCloud SMTP service' },
      { id: 'smtp-7', name: 'Zoho SMTP', price: 30, category: 'smtp', description: 'Zoho SMTP service' },
      { id: 'smtp-8', name: 'GoDaddy SMTP', price: 40, category: 'smtp', description: 'GoDaddy SMTP service' },
      { id: 'smtp-9', name: 'Mailgun SMTP', price: 60, category: 'smtp', description: 'Mailgun SMTP service' },
      { id: 'smtp-10', name: 'SendGrid SMTP', price: 50, category: 'smtp', description: 'SendGrid SMTP service' }
    ],
    invoice: [
      { id: 'invoice-1', name: 'Edu Office Invoice', price: 70, category: 'invoice', description: 'Educational Office invoice attachment' },
      { id: 'invoice-2', name: 'Google Drive Invoice', price: 50, category: 'invoice', description: 'Google Drive invoice attachment' },
      { id: 'invoice-3', name: 'OneDrive Invoice', price: 50, category: 'invoice', description: 'OneDrive invoice attachment' },
      { id: 'invoice-4', name: 'Adobe Invoice', price: 80, category: 'invoice', description: 'Adobe invoice attachment' },
      { id: 'invoice-5', name: 'Microsoft Invoice', price: 90, category: 'invoice', description: 'Microsoft invoice attachment' },
      { id: 'invoice-6', name: 'Dropbox Invoice', price: 60, category: 'invoice', description: 'Dropbox invoice attachment' },
      { id: 'invoice-7', name: 'Amazon AWS Invoice', price: 120, category: 'invoice', description: 'Amazon AWS invoice attachment' },
      { id: 'invoice-8', name: 'Zoom Invoice', price: 65, category: 'invoice', description: 'Zoom invoice attachment' },
      { id: 'invoice-9', name: 'Slack Invoice', price: 70, category: 'invoice', description: 'Slack invoice attachment' },
      { id: 'invoice-10', name: 'Shopify Invoice', price: 85, category: 'invoice', description: 'Shopify invoice attachment' }
    ],
    utilities: [
      { id: 'utility-1', name: 'Email Verifier', price: 25, category: 'utilities', description: 'Verify email addresses in bulk' },
      { id: 'utility-2', name: 'Email Extractor', price: 30, category: 'utilities', description: 'Extract email addresses from websites' },
      { id: 'utility-3', name: 'Mail Merger', price: 35, category: 'utilities', description: 'Create personalized email campaigns' },
      { id: 'utility-4', name: 'Email Template Builder', price: 40, category: 'utilities', description: 'Create professional email templates' },
      { id: 'utility-5', name: 'Email Tracker', price: 20, category: 'utilities', description: 'Track email opens and clicks' }
    ]
  };
  
  // Flatten tools array for searching
  let allTools = [];
  Object.values(toolsData).forEach(category => {
    allTools = [...allTools, ...category];
  });
  
  // Get DOM elements
  const toolsContainer = document.getElementById('tools-container');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('tools-search');
  const loadingOverlay = document.getElementById('loading-overlay');
  
  // Free Sender modal elements
  const freeSenderBtn = document.getElementById('free-sender-btn');
  const agreementModal = document.getElementById('agreement-modal');
  const closeAgreementModal = document.querySelector('.close-agreement-modal');
  const acceptAgreementCheckbox = document.getElementById('accept-agreement');
  const agreementNextBtn = document.getElementById('agreement-next-btn');
  
  // SMTP Test elements
  const testSmtpBtn = document.getElementById('test-smtp-btn');
  const smtpTestResults = document.getElementById('smtp-test-results');
  const smtpStatus = document.getElementById('smtp-status');
  const smtpDetails = document.getElementById('smtp-details');
  
  // Function to render tools based on filter
  function renderTools(filter = 'all', searchTerm = '') {
    toolsContainer.innerHTML = '';
    
    let filteredTools = [];
    
    // Apply category filter
    if (filter === 'all') {
      filteredTools = allTools;
    } else {
      filteredTools = toolsData[filter] || [];
    }
    
    // Apply search filter if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredTools = filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(term) || 
        tool.description.toLowerCase().includes(term)
      );
    }
    
    // Show empty message if no tools found
    if (filteredTools.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-tools-message';
      emptyMessage.textContent = 'No tools found matching your criteria.';
      toolsContainer.appendChild(emptyMessage);
      return;
    }
    
    // Render each tool
    filteredTools.forEach(tool => {
      const toolCard = document.createElement('div');
      toolCard.className = 'tool-card';
      toolCard.setAttribute('data-category', tool.category);
      
      toolCard.innerHTML = `
        <div class="tool-header">
          <h3>${tool.name}</h3>
          <p class="tool-price">$${tool.price.toFixed(2)}</p>
        </div>
        <div class="tool-body">
          <p>${tool.description}</p>
          <ul>
            <li>Professional templates</li>
            <li>Secure access</li>
            <li>24/7 support</li>
          </ul>
          <button class="buy-tool-btn" data-id="${tool.id}" data-name="${tool.name}" data-price="${tool.price}">Add to Cart</button>
        </div>
      `;
      
      toolsContainer.appendChild(toolCard);
    });
    
    // Add event listeners to the buy buttons
    const buyButtons = document.querySelectorAll('.buy-tool-btn');
    buyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const toolId = this.getAttribute('data-id');
        const toolName = this.getAttribute('data-name');
        const toolPrice = parseFloat(this.getAttribute('data-price'));
        
        addToCart(toolId, toolName, toolPrice);
      });
    });
  }
  
  // Function to add item to cart
  function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    cart.push({
      id,
      name,
      price
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Show success message
    showToast(`Added ${name} to cart!`);
  }
  
  // Update cart badge
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartBadge = document.getElementById('cart-badge');
    
    if (cartBadge) {
      const itemCount = cart.length;
      cartBadge.textContent = itemCount;
      cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
    }
  }
  
  // Function to show toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }, 10);
  }
  
  // Filter buttons functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Apply filter
      const filter = this.getAttribute('data-filter');
      renderTools(filter, searchInput.value);
    });
  });
  
  // Search functionality
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    renderTools(activeFilter, searchTerm);
  });
  
  // Free Sender modal functionality
  if (freeSenderBtn) {
    freeSenderBtn.addEventListener('click', function() {
      agreementModal.style.display = 'block';
    });
  }
  
  if (closeAgreementModal) {
    closeAgreementModal.addEventListener('click', function() {
      agreementModal.style.display = 'none';
    });
  }
  
  if (acceptAgreementCheckbox) {
    acceptAgreementCheckbox.addEventListener('change', function() {
      agreementNextBtn.disabled = !this.checked;
    });
  }
  
  if (agreementNextBtn) {
    agreementNextBtn.addEventListener('click', function() {
      agreementModal.style.display = 'none';
      window.open('https://exe-sender.onrender.com/', '_blank');
    });
  }
  
  // SMTP Test functionality
  if (testSmtpBtn) {
    testSmtpBtn.addEventListener('click', function() {
      // Get form values
      const host = document.getElementById('smtp-host').value;
      const port = document.getElementById('smtp-port').value;
      const username = document.getElementById('smtp-username').value;
      const password = document.getElementById('smtp-password').value;
      const security = document.querySelector('input[name="smtp-security"]:checked').value;
      
      // Validate form
      if (!host || !port || !username || !password) {
        alert('Please fill in all SMTP fields');
        return;
      }
      
      // Show loading
      loadingOverlay.style.display = 'flex';
      loadingOverlay.querySelector('p').textContent = 'Testing SMTP connection...';
      
      // Send SMTP test request to server
      fetch('/test-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host,
          port,
          username,
          password,
          security
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to test SMTP connection');
        }
        return response.json();
      })
      .then(data => {
        loadingOverlay.style.display = 'none';
        
        // Display results
        smtpTestResults.style.display = 'block';
        
        if (data.success) {
          smtpStatus.innerHTML = '<div class="success-message">Connection successful!</div>';
          smtpDetails.innerHTML = `
            <div class="smtp-details-item">
              <strong>Daily Sending Limit:</strong> ${data.dailyLimit || 'Unknown'}
            </div>
            <div class="smtp-details-item">
              <strong>Remaining Daily Limit:</strong> ${data.remainingLimit || 'Unknown'}
            </div>
            <div class="smtp-details-item">
              <strong>Connection Details:</strong> ${data.details || 'No additional details available'}
            </div>
          `;
        } else {
          smtpStatus.innerHTML = '<div class="error-message">Connection failed!</div>';
          smtpDetails.innerHTML = `
            <div class="smtp-details-item">
              <strong>Error:</strong> ${data.error || 'Unknown error'}
            </div>
          `;
        }
      })
      .catch(error => {
        loadingOverlay.style.display = 'none';
        
        // Display error
        smtpTestResults.style.display = 'block';
        smtpStatus.innerHTML = '<div class="error-message">Connection failed!</div>';
        smtpDetails.innerHTML = `
          <div class="smtp-details-item">
            <strong>Error:</strong> ${error.message}
          </div>
        `;
      });
    });
  }
  
  // Initialize
  loadingOverlay.style.display = 'flex';
  
  // Simulate loading
  setTimeout(() => {
    loadingOverlay.style.display = 'none';
    renderTools();
    updateCartBadge();
  }, 1500);
  
  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === agreementModal) {
      agreementModal.style.display = 'none';
    }
  });
});
