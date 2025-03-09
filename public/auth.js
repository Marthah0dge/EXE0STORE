
document.addEventListener('DOMContentLoaded', function() {
  // Authentication functionality
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loadingOverlay = document.getElementById('loading-overlay');
  
  // Login form handling
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Show loading overlay
      loadingOverlay.style.display = 'flex';
      
      // Simulate login request
      setTimeout(() => {
        // Send login data to server
        fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Login failed');
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.href = 'index.html';
        })
        .catch(error => {
          alert('Login failed: ' + error.message);
          loadingOverlay.style.display = 'none';
        });
      }, 2000); // 2 second delay for loading effect
    });
  }
  
  // Signup form handling
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Basic validation
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      // Show loading overlay
      loadingOverlay.style.display = 'flex';
      
      // Simulate signup request
      setTimeout(() => {
        // Send signup data to server
        fetch('/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullname, email, password }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Signup failed');
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.href = 'index.html';
        })
        .catch(error => {
          alert('Signup failed: ' + error.message);
          loadingOverlay.style.display = 'none';
        });
      }, 2000); // 2 second delay for loading effect
    });
  }
  
  // Check if user is logged in
  function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user !== null;
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  }
  
  // Update UI based on authentication state
  function updateAuthUI() {
    const isLoggedIn = checkAuth();
    const loginButtons = document.querySelectorAll('.login-btn');
    const logoutButtons = document.querySelectorAll('.logout-btn');
    const profileButtons = document.querySelectorAll('.profile-btn');
    
    if (isLoggedIn) {
      loginButtons.forEach(btn => btn.style.display = 'none');
      logoutButtons.forEach(btn => btn.style.display = 'block');
      profileButtons.forEach(btn => btn.style.display = 'block');
    } else {
      loginButtons.forEach(btn => btn.style.display = 'block');
      logoutButtons.forEach(btn => btn.style.display = 'none');
      profileButtons.forEach(btn => btn.style.display = 'none');
    }
  }
  
  // Check if we're on the home page and redirect if not authenticated
  function checkHomePageAuth() {
    // Check if this is the home page
    const path = window.location.pathname;
    const isHomePage = path === '/' || path === '/index.html';
    const isAuthPage = path.includes('login.html') || path.includes('signup.html');
    
    if (isHomePage && !checkAuth() && !isAuthPage) {
      window.location.href = 'login.html';
    }
  }
  
  // Run on page load
  updateAuthUI();
  checkHomePageAuth();
});
