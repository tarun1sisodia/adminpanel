import * as supabaseService from './supabase.js';

document.addEventListener('DOMContentLoaded', initLogin);

function initLogin() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const showRegisterLink = document.getElementById('show-register-link');

    // Set up event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }

    // Check if user is already logged in
    checkAuthStatus();
}

async function checkAuthStatus() {
    try {
        const session = await supabaseService.getCurrentSession();
        
        if (session) {
            // User is logged in, redirect to dashboard
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error checking authentication status:', error);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('login-error');
    
    try {
        loginError.classList.add('hidden');
        const data = await supabaseService.signIn(email, password);
        
        // Check if user is an admin
        const userData = await supabaseService.getUserProfile(data.user.id);
        
        if (userData.role !== 'admin') {
            loginError.textContent = 'Access denied. Only admin users can access this panel.';
            loginError.classList.remove('hidden');
            await supabaseService.signOut();
            return;
        }
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    } catch (error) {
        loginError.textContent = error.message || 'Failed to login';
        loginError.classList.remove('hidden');
    }
}