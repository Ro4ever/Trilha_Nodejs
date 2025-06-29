// src/controllers/productController.js
const Product = require('../models/productModel');
const Feedback = require('../models/feedbackModel'); 

class ProductController {
    static async getAllProducts(req, res) {
        try {
            const products = await Product.getAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar produtos.', error: error.message });
        }
    }

    static async getProductById(req, res) {
        const { id } = req.params;
        try {
            const product = await Product.getById(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            // Buscar feedbacks aprovados para este produto
            const feedbacks = await Feedback.getApprovedByProductId(id);
            res.status(200).json({ ...product, feedbacks });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar produto.', error: error.message });
        }
    }

    static async createProduct(req, res) {
        const { nome, descricao, categoria } = req.body;
        if (!nome || !descricao || !categoria) {
            return res.status(400).json({ message: 'Nome, descrição e categoria são obrigatórios.' });
        }
        try {
            const newProduct = await Product.create(nome, descricao, categoria);
            res.status(201).json({ message: 'Produto cadastrado com sucesso!', product: newProduct });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao cadastrar produto.', error: error.message });
        }
    }

    static async updateProduct(req, res) {
        const { id } = req.params;
        const { nome, descricao, categoria } = req.body;
        if (!nome || !descricao || !categoria) {
            return res.status(400).json({ message: 'Nome, descrição e categoria são obrigatórios.' });
        }
        try {
            const updated = await Product.update(id, nome, descricao, categoria);
            if (!updated) {
                return res.status(404).json({ message: 'Produto não encontrado para atualização.' });
            }
            res.status(200).json({ message: 'Produto atualizado com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar produto.', error: error.message });
        }
    }

    static async deleteProduct(req, res) {
        const { id } = req.params;
        try {
            const deleted = await Product.delete(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Produto não encontrado para exclusão.' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar produto.', error: error.message });
        }
    }
}

module.exports = ProductController;