// ==========================
// Sélection des éléments du DOM
// ==========================
const form = document.querySelector('form');
const btnSubmit = document.getElementById('btn_submit');
const errorId = document.querySelector('.error-alert');

const email = document.getElementById('email');
const password = document.getElementById('password');

// ==========================
// Soumission du formulaire
// ==========================
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email.value,
            password: password.value
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
        errorId.style.display = 'flex';
        form.style.marginTop = '0';
    });
});



