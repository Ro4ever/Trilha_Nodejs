// public/js/api.js

// A URL base da sua API. Se você estiver rodando localmente, será esta.
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Realiza uma requisição HTTP para a API.
 * @param {string} url - O endpoint da API (ex: '/auth/login').
 * @param {string} method - O método HTTP (GET, POST, PUT, DELETE).
 * @param {object} [body=null] - O corpo da requisição para métodos POST/PUT.
 * @param {string} [token=null] - Token JWT para requisições autenticadas.
 * @returns {Promise<object>} - Uma promessa que resolve para os dados da resposta.
 */
async function apiRequest(url, method, body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        const data = await response.json();

        if (!response.ok) {
            // Se a resposta não for OK (status 4xx ou 5xx), lança um erro
            throw new Error(data.message || `Erro na requisição: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`Erro na chamada da API para ${url}:`, error);
        throw error; // Propaga o erro para quem chamou a função
    }
}

// Funções específicas para cada tipo de requisição (opcional, para organização)
const api = {
    auth: {
        register: (nome, email, senha, role = 'comum') => apiRequest('/auth/register', 'POST', { nome, email, senha, role }),
        login: (email, senha) => apiRequest('/auth/login', 'POST', { email, senha }),
    },
    products: {
        getAll: () => apiRequest('/products', 'GET'),
        getById: (id) => apiRequest(`/products/${id}`, 'GET'),
        create: (name, description, category, token) => apiRequest('/products', 'POST', { name, description, category }, token),
        update: (id, name, description, category, token) => apiRequest(`/products/${id}`, 'PUT', { name, description, category }, token),
        delete: (id, token) => apiRequest(`/products/${id}`, 'DELETE', null, token),
    },
    feedbacks: {
        add: (productId, rating, comment, token) => apiRequest(`/products/${productId}/feedback`, 'POST', { avaliacao: rating, comentario: comment }, token),
        getAllAdmin: (token, status = null) => {
            const url = status ? `/feedbacks/admin?status=${status}` : '/feedbacks/admin';
            return apiRequest(url, 'GET', null, token);
        },
        moderate: (feedbackId, status, token) => apiRequest(`/feedbacks/admin/${feedbackId}/moderate`, 'PUT', { status }, token),
        delete: (feedbackId, token) => apiRequest(`/feedbacks/admin/${feedbackId}`, 'DELETE', null, token),
    },
};