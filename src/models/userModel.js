// src/models/userModel.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create(nome, email, senha, role = 'comum') {
        try {
            const hashedPassword = await bcrypt.hash(senha, 10);
            const [result] = await pool.query(
                'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)',
                [nome, email, hashedPassword, role]
            );
            return { id: result.insertId, nome, email, role };
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await pool.query(
                'SELECT id, nome, email, senha, role FROM usuarios WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error("Erro ao buscar usuário por email:", error);
            throw error;
        }
    }
}

module.exports = User;