// Authentication Handling for AiGRI

document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('admin-login-form');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            
            // Simple validation
            if (!email || !password) {
                showAlert('Please enter both email and password', 'danger');
                return;
            }
            
            // Simulate API call (replace with actual API call in production)
            simulateLogin(email, password)
                .then(response => {
                    if (response.success) {
                        // Store token in localStorage (insecure for production - use HttpOnly cookies instead)
                        localStorage.setItem('aigri_token', response.token);
                        localStorage.setItem('aigri_user', JSON.stringify(response.user));
                        
                        // Redirect to dashboard
                        window.location.href = 'admin/dashboard.html';
                    } else {
                        showAlert(response.message, 'danger');
                    }
                })
                .catch(error => {
                    showAlert('An error occurred during login. Please try again.', 'danger');
                    console.error('Login error:', error);
                });
        });
    }
});

function simulateLogin(email, password) {
    // This is a mock function - replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock validation
            if (email === 'admin@lgu.gov.ph' && password === 'password123') {
                resolve({
                    success: true,
                    token: 'mock_jwt_token_12345',
                    user: {
                        id: 1,
                        name: 'Municipal Agriculture Officer',
                        email: 'admin@lgu.gov.ph',
                        role: 'admin',
                        municipality: 'Sample Municipality'
                    },
                    message: 'Login successful'
                });
            } else {
                resolve({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
        }, 1000);
    });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const form = document.querySelector('form');
    if (form) {
        // Remove any existing alerts
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        form.prepend(alertDiv);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('aigri_token');
    const user = localStorage.getItem('aigri_user');
    
    if (!token || !user) {
        // Redirect to login if not authenticated
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = '../login.html';
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('aigri_token');
    localStorage.removeItem('aigri_user');
    window.location.href = '../login.html';
}