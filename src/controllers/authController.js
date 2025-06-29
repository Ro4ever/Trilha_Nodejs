// src/controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
    static async register(req, res) {
        const { nome, email, senha, role } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
        }

        try {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'Email já cadastrado.' });
            }

            const newUser = await User.create(nome, email, senha, role);
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: { id: newUser.id, nome: newUser.nome, email: newUser.email, role: newUser.role } });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
        }
    }

    static async login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        try {
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '1h' } // Token expira em 1 hora
            );

            res.status(200).json({ message: 'Login realizado com sucesso!', token, user: { id: user.id, nome: user.nome, email: user.email, role: user.role } });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao fazer login.', error: error.message });
        }
    }
}

module.exports = AuthController;