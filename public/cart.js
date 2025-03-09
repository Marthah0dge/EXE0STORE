
document.addEventListener('DOMContentLoaded', function() {
  // Cart functionality
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let toolsData = []; // Will store the tools data
  
  // Update cart badge
  function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
      const itemCount = cart.length;
      cartBadge.textContent = itemCount;
      cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
    }
  }
  
  // Calculate cart total
  function calculateTotal() {
    return cart.reduce((total, item) => {
      // Ensure price is treated as a number
      const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      return total + itemPrice;
    }, 0);
  }
  
  // Render cart items
  function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
      cartTotalElement.textContent = '$0.00';
      return;
    }
    
    // Clear current items
    cartItemsContainer.innerHTML = '';
    
    // Add each cart item
    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-item" data-index="${index}">×</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total
    const total = calculateTotal();
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    
    // Add remove item handlers
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        removeFromCart(index);
      });
    });
  }
  
  // Add to cart
  function addToCart(toolId) {
    const tool = toolsData.find(t => t.id === toolId);
    if (tool) {
      cart.push({
        id: tool.id,
        name: tool.name,
        price: tool.price
      });
      
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      
      // Show success message
      showToast(`Added ${tool.name} to cart!`);
    }
  }
  
  // Remove from cart
  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  }
  
  // Clear cart
  function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  }
  
  // Process checkout
  function processCheckout() {
    const email = document.getElementById('checkout-email').value;
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';
    
    // Simulate processing
    setTimeout(() => {
      // Generate order number
      const orderNumber = 'ORD-' + Date.now().toString().slice(-8);
      
      // Prepare order data
      const orderData = {
        orderNumber,
        email,
        items: cart,
        total: calculateTotal(),
        date: new Date().toISOString()
      };
      
      // Send to server
      fetch('/process-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to process order');
        }
        return response.json();
      })
      .then(data => {
        loadingOverlay.style.display = 'none';
        
        // Show success modal
        showOrderSuccessModal(orderNumber, email);
        
        // Clear cart
        clearCart();
      })
      .catch(error => {
        loadingOverlay.style.display = 'none';
        alert('Error processing order: ' + error.message);
      });
    }, 3000);
  }
  
  // Show order success modal
  function showOrderSuccessModal(orderNumber, email) {
    const thankYouModal = document.getElementById('thank-you-modal');
    const orderNumberEl = document.getElementById('order-number');
    const customerEmailEl = document.getElementById('customer-email');
    
    if (thankYouModal && orderNumberEl && customerEmailEl) {
      orderNumberEl.textContent = orderNumber;
      customerEmailEl.textContent = email;
      thankYouModal.style.display = 'block';
    }
  }
  
  // Load tools data
  function loadToolsData() {
    // This would typically be loaded from the server
    toolsData = [
      { id: 1, name: 'Email Campaign Manager', price: 19.99, description: 'Send to 2000+ email providers' },
      { id: 2, name: 'SMS Campaign Sender', price: 24.99, description: 'Bulk SMS sending' },
      { id: 3, name: 'Cookie Tracking Suite', price: 14.99, description: 'Browser cookies management' },
      { id: 4, name: 'Social Media Manager', price: 29.99, description: 'Schedule and analyze social posts' },
      { id: 5, name: 'SEO Optimization Tool', price: 34.99, description: 'Improve your search ranking' },
      { id: 6, name: 'Analytics Dashboard', price: 24.99, description: 'Track and visualize website metrics' },
      { id: 7, name: 'Landing Page Builder', price: 19.99, description: 'Create high-converting pages' },
      { id: 8, name: 'A/B Testing Platform', price: 29.99, description: 'Optimize conversions with data' },
      { id: 9, name: 'Email Template Builder', price: 14.99, description: 'Design professional emails' },
      { id: 10, name: 'Marketing Automation', price: 39.99, description: 'Automate your marketing workflows' }
    ];
    
    // Render tools if we're on the tools page
    const toolsContainer = document.getElementById('tools-container');
    if (toolsContainer) {
      renderTools(toolsContainer);
    }
  }
  
  // Render tools
  function renderTools(container) {
    toolsData.forEach(tool => {
      const toolCard = document.createElement('div');
      toolCard.className = 'tool-card';
      toolCard.innerHTML = `
        <div class="tool-header">
          <h3>${tool.name}</h3>
          <p class="tool-price">$${tool.price.toFixed(2)}</p>
        </div>
        <div class="tool-body">
          <p>${tool.description}</p>
          <ul>
            <li>Professional templates</li>
            <li>Analytics dashboard</li>
            <li>24/7 support</li>
          </ul>
          <button class="buy-tool-btn" data-id="${tool.id}">Add to Cart</button>
        </div>
      `;
      container.appendChild(toolCard);
    });
    
    // Add event listeners
    const buyButtons = document.querySelectorAll('.buy-tool-btn');
    buyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const toolId = parseInt(this.getAttribute('data-id'));
        addToCart(toolId);
      });
    });
  }
  
  // Toast notification
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
  
  // Initialize
  loadToolsData();
  updateCartBadge();
  
  // Cart page initialization
  if (document.getElementById('cart-page')) {
    renderCart();
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', processCheckout);
    }
    
    // Send email button
    const sendConfirmationBtn = document.getElementById('send-confirmation');
    if (sendConfirmationBtn) {
      sendConfirmationBtn.addEventListener('click', function() {
        const email = document.getElementById('checkout-email').value;
        
        if (!email) {
          alert('Please enter your email address');
          return;
        }
        
        // Show loading
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.style.display = 'flex';
        loadingOverlay.querySelector('p').textContent = 'Sending email...';
        
        // Simulate sending email
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
          showToast('Confirmation email sent!');
        }, 2000);
      });
    }
    
    // Copy Bitcoin address
    const copyBtcBtn = document.getElementById('copy-btc-address');
    if (copyBtcBtn) {
      copyBtcBtn.addEventListener('click', function() {
        const btcAddress = document.getElementById('btc-address').textContent;
        navigator.clipboard.writeText(btcAddress)
          .then(() => {
            this.textContent = 'Copied!';
            setTimeout(() => {
              this.textContent = 'Copy';
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy:', err);
          });
      });
    }
  }
  
  // Thank you modal close
  const closeThankYouModal = document.querySelector('.close-thank-you-modal');
  if (closeThankYouModal) {
    closeThankYouModal.addEventListener('click', function() {
      document.getElementById('thank-you-modal').style.display = 'none';
    });
  }
});
