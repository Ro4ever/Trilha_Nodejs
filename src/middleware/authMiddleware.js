// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

class AuthMiddleware {
    static verifyToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
        }

        const token = authHeader.split(' ')[1]; // Espera "Bearer TOKEN"
        if (!token) {
            return res.status(401).json({ message: 'Token de autenticação inválido.' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded; 
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Token de autenticação inválido ou expirado.' });
        }
    }

    static isAdmin(req, res, next) {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
        }
    }
}

module.exports = AuthMiddleware;