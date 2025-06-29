// src/models/feedbackModel.js
const { pool } = require('../config/db');

class Feedback {
    static async create(id_usuario, id_produto, avaliacao, comentario) {
        try {
            const [result] = await pool.query(
                'INSERT INTO feedbacks (id_usuario, id_produto, avaliacao, comentario, status) VALUES (?, ?, ?, ?, ?)',
                [id_usuario, id_produto, avaliacao, comentario, 'pendente'] // Novo feedback sempre começa como 'pendente'
            );
            return { id: result.insertId, id_usuario, id_produto, avaliacao, comentario, status: 'pendente' };
        } catch (error) {
            console.error("Erro ao criar feedback:", error);
            throw error;
        }
    }

    static async getApprovedByProductId(id_produto) {
        try {
            const [rows] = await pool.query(
                `
                SELECT
                    f.id,
                    f.avaliacao,
                    f.comentario,
                    f.data_criacao,
                    u.nome AS usuario_nome
                FROM
                    feedbacks f
                JOIN
                    usuarios u ON f.id_usuario = u.id
                WHERE
                    f.id_produto = ? AND f.status = 'aprovado'
                ORDER BY
                    f.data_criacao DESC
                `,
                [id_produto]
            );
            return rows;
        } catch (error) {
            console.error("Erro ao buscar feedbacks aprovados por produto:", error);
            throw error;
        }
    }

    // Para moderação (administradores)
    static async getAllFeedbacksForAdmin(statusFilter = null) {
        try {
            let query = `
                SELECT
                    f.id,
                    f.avaliacao,
                    f.comentario,
                    f.status,
                    f.data_criacao,
                    u.nome AS usuario_nome,
                    p.nome AS produto_nome
                FROM
                    feedbacks f
                JOIN
                    usuarios u ON f.id_usuario = u.id
                JOIN
                    produtos p ON f.id_produto = p.id
            `;
            const params = [];

            if (statusFilter) {
                query += ` WHERE f.status = ?`;
                params.push(statusFilter);
            }
            query += ` ORDER BY f.data_criacao DESC`;

            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            console.error("Erro ao buscar todos os feedbacks para admin:", error);
            throw error;
        }
    }

    static async updateFeedbackStatus(id, status) {
        try {
            const [result] = await pool.query(
                'UPDATE feedbacks SET status = ? WHERE id = ?',
                [status, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao atualizar status do feedback:", error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.query('DELETE FROM feedbacks WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao deletar feedback:", error);
            throw error;
        }
    }
}

module.exports = Feedback;