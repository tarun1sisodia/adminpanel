import * as supabaseService from './supabase.js';

document.addEventListener('DOMContentLoaded', initRegister);

function initRegister() {
    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error');
    const showLoginLink = document.getElementById('show-login-link');

    // Set up event listeners
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
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

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const registerError = document.getElementById('register-error');
    
    try {
        registerError.classList.add('hidden');
        
        // Validate passwords match
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        // Register the user
        const userData = {
            name: name,
            role: 'admin' // Set as admin for this admin panel
        };
        
        await supabaseService.signUp(email, password, userData);
        
        // Show success message and redirect to login
        alert('Registration successful! Please login with your credentials.');
        window.location.href = 'login.html';
    } catch (error) {
        registerError.textContent = error.message || 'Failed to register';
        registerError.classList.remove('hidden');
    }
}