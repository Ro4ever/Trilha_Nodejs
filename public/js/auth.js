// public/js/auth.js

// Funções auxiliares para localStorage
function setToken(token) {
    localStorage.setItem('jwtToken', token);
}

function getToken() {
    return localStorage.getItem('jwtToken');
}

function setUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function clearAuthData() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
}

// Função para exibir mensagens na UI
function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000); // Esconde a mensagem após 5 segundos
    }
}

// Redirecionamento após login/logout
function redirectToHome() {
    window.location.href = '/';
}

function redirectToLogin() {
    clearAuthData(); // Limpa dados ao redirecionar para login
    window.location.href = '/login.html';
}

// Exporta as funções para serem usadas em outras páginas
window.auth = {
    setToken,
    getToken,
    setUser,
    getUser,
    clearAuthData,
    showMessage,
    redirectToHome,
    redirectToLogin
};