
// DOM element selection

const form = document.querySelector('form');
const btnSubmit = document.getElementById('btn_submit');
const errorId = document.querySelector('.error-alert');
const errorTitle = document.querySelector('.error-alert strong');
const errorText = document.querySelector('.error-alert p');

const email = document.getElementById('email');
const password = document.getElementById('password');

function showLoginError(title, message) {
    if (errorTitle) errorTitle.textContent = title;
    if (errorText) errorText.textContent = message;
    if (errorId) errorId.style.display = 'flex';
    if (form) form.style.marginTop = '0';
}

function hideLoginError() {
    if (errorId) errorId.style.display = 'none';
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPassword(value) {
    const trimmed = value.trim();
    return trimmed.length >= 6 &&
        /[A-Z]/.test(trimmed) &&
        /[0-9]/.test(trimmed);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideLoginError();

    const emailValue = email.value.trim();
    const passwordValue = password.value;

    if (!isValidEmail(emailValue)) {
        showLoginError('E-mail invalide', 'Veuillez saisir une adresse e-mail valide.');
        return;
    }

    if (!isValidPassword(passwordValue)) {
        showLoginError('Mot de passe invalide', 'Le mot de passe doit contenir au moins 10 caractères, une majuscule, un chiffre et un caractère spécial.');
        return;
    }

    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: emailValue,
            password: passwordValue
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur de connexion");
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        window.location.href = "index.html";
    })
    .catch(error => {
        showLoginError('Erreur de connexion', 'Veuillez vérifier vos identifiants.');
    });
});



