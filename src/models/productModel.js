// src/models/productModel.js
const { pool } = require('../config/db');

class Product {
    static async getAll() {
        try {
            const [rows] = await pool.query(`
                SELECT
                    p.id,
                    p.nome,
                    p.descricao,
                    p.categoria,
                    COALESCE(AVG(f.avaliacao), 0) AS media_avaliacao,
                    COUNT(f.id) AS total_feedbacks
                FROM
                    produtos p
                LEFT JOIN
                    feedbacks f ON p.id = f.id_produto AND f.status = 'aprovado'
                GROUP BY
                    p.id, p.nome, p.descricao, p.categoria
                ORDER BY
                    p.nome ASC
            `);
            return rows;
        } catch (error) {
            console.error("Erro ao buscar todos os produtos:", error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.query(
                `
                SELECT
                    p.id,
                    p.nome,
                    p.descricao,
                    p.categoria,
                    COALESCE(AVG(f.avaliacao), 0) AS media_avaliacao,
                    COUNT(f.id) AS total_feedbacks
                FROM
                    produtos p
                LEFT JOIN
                    feedbacks f ON p.id = f.id_produto AND f.status = 'aprovado'
                WHERE
                    p.id = ?
                GROUP BY
                    p.id, p.nome, p.descricao, p.categoria
                LIMIT 1
                `,
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error("Erro ao buscar produto por ID:", error);
            throw error;
        }
    }

    static async create(nome, descricao, categoria) {
        try {
            const [result] = await pool.query(
                'INSERT INTO produtos (nome, descricao, categoria) VALUES (?, ?, ?)',
                [nome, descricao, categoria]
            );
            return { id: result.insertId, nome, descricao, categoria };
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            throw error;
        }
    }

    static async update(id, nome, descricao, categoria) {
        try {
            const [result] = await pool.query(
                'UPDATE produtos SET nome = ?, descricao = ?, categoria = ? WHERE id = ?',
                [nome, descricao, categoria, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            // Deletar feedbacks associados primeiro
            await pool.query('DELETE FROM feedbacks WHERE id_produto = ?', [id]);
            const [result] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            throw error;
        }
    }
}

module.exports = Product;