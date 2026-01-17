// ===== Configuration =====
const API_BASE = '/api/admin';

// ===== Session Management =====
function setSession(adminName) {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('adminName', adminName);
}

function getSession() {
    return {
        isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true',
        adminName: sessionStorage.getItem('adminName')
    };
}

function clearSession() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('adminName');
}

// ===== Authentication Check =====
function checkAuth() {
    const session = getSession();
    const currentPage = window.location.pathname;

    if (currentPage.includes('dashboard.html') && !session.isLoggedIn) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }

    // Update admin name display
    if (session.isLoggedIn && document.getElementById('adminName')) {
        document.getElementById('adminName').textContent = `Welcome, ${session.adminName}`;
    }
}

// ===== Login Form Handler =====
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            // Disable button during request
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Signing in...</span>';

            try {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (result.success) {
                    setSession(result.adminName);
                    window.location.href = 'dashboard.html';
                } else {
                    errorMessage.textContent = result.message || 'Invalid credentials';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = 'Connection error. Please try again.';
                errorMessage.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Sign In</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>';
            }
        });
    }

    // Logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            clearSession();
            window.location.href = 'login.html';
        });
    }
});

// ===== Load Dashboard Statistics =====
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE}/getDashboardStats()`);
        const data = await response.json();

        // Update the statistics cards with animation
        animateNumber('totalStudents', data.totalStudents);
        animateNumber('totalCourses', data.totalCourses);
        animateNumber('totalRegistrations', data.totalRegistrations);
        animateNumber('pendingRegistrations', data.pendingRegistrations);

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Show fallback values
        document.getElementById('totalStudents').textContent = '-';
        document.getElementById('totalCourses').textContent = '-';
        document.getElementById('totalRegistrations').textContent = '-';
        document.getElementById('pendingRegistrations').textContent = '-';
    }
}

// ===== Animate Number Counter =====
function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000; // 1 second
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
