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

  // Handle logout
  function handleLogout() {
    // Keep cart but remove user
    localStorage.removeItem('user');
    updateAuthUI();
    
    // Show loading spinner for all pages
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="spinner"></div>
      <p>Logging out...</p>
    `;
    document.body.appendChild(loadingOverlay);

    // Redirect after 5 seconds
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 5000);
  }

  // Logout functionality
  document.addEventListener('click', function(e) {
    // Use event delegation to handle logout button clicks
    if (e.target && e.target.classList.contains('logout-btn')) {
      handleLogout();
    }
  });

  // Update UI based on authentication state
  function updateAuthUI() {
    const isLoggedIn = checkAuth();
    const loginButtons = document.querySelectorAll('.login-btn');
    const signupButtons = document.querySelectorAll('.signup-btn');
    const logoutButtons = document.querySelectorAll('.logout-btn');

    if (isLoggedIn) {
      // Hide login and signup buttons
      loginButtons.forEach(btn => btn.style.display = 'none');
      signupButtons.forEach(btn => btn.style.display = 'none');

      // Show logout button
      logoutButtons.forEach(btn => btn.style.display = 'block');
    } else {
      // Show login and signup buttons
      loginButtons.forEach(btn => btn.style.display = 'block');
      signupButtons.forEach(btn => btn.style.display = 'block');

      // Hide logout button
      logoutButtons.forEach(btn => btn.style.display = 'none');
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