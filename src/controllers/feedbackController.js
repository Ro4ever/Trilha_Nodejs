// src/controllers/feedbackController.js
const Feedback = require('../models/feedbackModel');

class FeedbackController {
    static async addFeedbackToProduct(req, res) {
        const { id: productId } = req.params;
        const { avaliacao, comentario } = req.body;
        const userId = req.user.id; // Vem do token JWT

        if (!avaliacao && !comentario) {
            return res.status(400).json({ message: 'Avaliação ou comentário é obrigatório.' });
        }
        if (avaliacao && (avaliacao < 1 || avaliacao > 5)) {
            return res.status(400).json({ message: 'A avaliação deve ser entre 1 e 5.' });
        }

        try {
            const newFeedback = await Feedback.create(userId, productId, avaliacao, comentario);
            res.status(201).json({ message: 'Feedback enviado com sucesso! Aguardando moderação.', feedback: newFeedback });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao enviar feedback.', error: error.message });
        }
    }

    // Ações de Moderação (Apenas para Administradores)
    static async getAllFeedbacks(req, res) {
        const { status } = req.query; // Pode filtrar por ?status=pendente, aprovado, rejeitado
        try {
            const feedbacks = await Feedback.getAllFeedbacksForAdmin(status);
            res.status(200).json(feedbacks);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar feedbacks para moderação.', error: error.message });
        }
    }

    static async moderateFeedback(req, res) {
        const { id } = req.params;
        const { status } = req.body; // status: 'aprovado' ou 'rejeitado'

        if (!['aprovado', 'rejeitado'].includes(status)) {
            return res.status(400).json({ message: 'Status de moderação inválido. Use "aprovado" ou "rejeitado".' });
        }

        try {
            const updated = await Feedback.updateFeedbackStatus(id, status);
            if (!updated) {
                return res.status(404).json({ message: 'Feedback não encontrado para moderação.' });
            }
            res.status(200).json({ message: 'Feedback atualizado com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao moderar feedback.', error: error.message });
        }
    }

    static async deleteFeedback(req, res) {
        const { id } = req.params;
        try {
            const deleted = await Feedback.delete(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Feedback não encontrado para exclusão.' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar feedback.', error: error.message });
        }
    }
}

module.exports = FeedbackController;