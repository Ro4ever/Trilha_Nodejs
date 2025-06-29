// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Importe o módulo 'path'
const { testConnection } = require('src/config/db');
require('dotenv').config();


// Importar rotas
const authRoutes = require('src/routes/authRoutes');
const productRoutes = require('src/routes/productRoutes');
const feedbackRoutes = require('src/routes/feedbackRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares essenciais
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- SERVIR ARQUIVOS ESTÁTICOS DO FRONTEND ---
app.use(express.static(path.join(__dirname, '..', 'public')));

// Testar conexão com o banco de dados ao iniciar
testConnection();

// Conectar as rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/feedbacks', feedbackRoutes);

// Rota para a página inicial do frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse o frontend em: http://localhost:${PORT}`);
});