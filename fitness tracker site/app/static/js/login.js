document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('loginPassword');

    togglePassword.addEventListener('click', function () {
        // Toggle the password visibility
        const type = passwordField.type === 'password' ? 'text' : 'password';
        passwordField.type = type;

        // Toggle the eye icon (show open or closed)
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
});

function loginUser() {
    const identifier = document.getElementById('loginIdentifier').value.trim(); // Username or Email
    const password = document.getElementById('loginPassword').value.trim();

    if (!identifier || !password) {
        alert('Username/Email and password are required!');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
    })
    .then(response => response.json().then(data => ({ status: response.ok, message: data })))
    .then(({ status, message }) => {
        if (status) {
            document.cookie = `identifier=${identifier}; path=/`; // Set cookie for logged-in user
            alert(message.message);
            window.location.href = '/user-actions'; // Redirect to user actions page
        } else {
            alert(`Error: ${message.message}`);
        }
    })
    .catch(error => {
        alert('An error occurred during login. Please try again.');
        console.error(error);
    });
}
