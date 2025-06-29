// public/js/admin.js

document.addEventListener('DOMContentLoaded', async () => {
    // Redireciona para login se não for admin
    const user = auth.getUser();
    if (!user || user.role !== 'admin') {
        alert('Acesso negado. Você precisa ser um administrador para acessar esta página.');
        auth.redirectToHome();
        return;
    }

    if (document.getElementById('admin-feedbacks-table')) {
        await loadFeedbacksForAdmin();
    }
});

async function loadFeedbacksForAdmin() {
    const feedbackTableBody = document.getElementById('admin-feedbacks-body');
    if (!feedbackTableBody) return;

    const token = auth.getToken();
    if (!token) {
        auth.showMessage('admin-message', 'Token de autenticação não encontrado. Faça login novamente.', 'error');
        auth.redirectToLogin();
        return;
    }

    try {
        const feedbacks = await api.feedbacks.getAllAdmin(token);
        feedbackTableBody.innerHTML = '';

        if (feedbacks.length === 0) {
            feedbackTableBody.innerHTML = '<tr><td colspan="7">Nenhum feedback para moderar.</td></tr>';
            return;
        }

        feedbacks.forEach(feedback => {
            const row = feedbackTableBody.insertRow();
            row.innerHTML = `
                <td>${feedback.id}</td>
                <td>${feedback.produto_nome}</td>
                <td>${feedback.usuario_nome}</td>
                <td>${feedback.avaliacao || 'N/A'}</td>
                <td>${feedback.comentario || 'Sem comentário'}</td>
                <td>${feedback.status}</td>
                <td class="action-buttons">
                    ${feedback.status === 'pendente' ? `<button class="approve" onclick="moderateFeedback(${feedback.id}, 'aprovado')">Aprovar</button>` : ''}
                    ${feedback.status === 'pendente' ? `<button class="reject" onclick="moderateFeedback(${feedback.id}, 'rejeitado')">Rejeitar</button>` : ''}
                    <button class="delete" onclick="deleteFeedback(${feedback.id})">Excluir</button>
                </td>
            `;
        });

    } catch (error) {
        console.error('Erro ao carregar feedbacks para admin:', error);
        auth.showMessage('admin-message', error.message || 'Erro ao carregar feedbacks para moderação.', 'error');
    }
}

async function moderateFeedback(feedbackId, status) {
    const token = auth.getToken();
    if (!token) {
        auth.showMessage('admin-message', 'Você não está autenticado.', 'error');
        auth.redirectToLogin();
        return;
    }

    if (!confirm(`Tem certeza que deseja ${status === 'aprovado' ? 'APROVAR' : 'REJEITAR'} este feedback?`)) {
        return;
    }

    try {
        await api.feedbacks.moderate(feedbackId, status, token);
        auth.showMessage('admin-message', `Feedback ${status} com sucesso!`, 'success');
        await loadFeedbacksForAdmin(); // Recarrega a lista
    } catch (error) {
        auth.showMessage('admin-message', error.message || 'Erro ao moderar feedback.', 'error');
    }
}

async function deleteFeedback(feedbackId) {
    const token = auth.getToken();
    if (!token) {
        auth.showMessage('admin-message', 'Você não está autenticado.', 'error');
        auth.redirectToLogin();
        return;
    }

    if (!confirm('Tem certeza que deseja EXCLUIR este feedback? Esta ação é irreversível.')) {
        return;
    }

    try {
        await api.feedbacks.delete(feedbackId, token);
        auth.showMessage('admin-message', 'Feedback excluído com sucesso!', 'success');
        await loadFeedbacksForAdmin(); // Recarrega a lista
    } catch (error) {
        auth.showMessage('admin-message', error.message || 'Erro ao excluir feedback.', 'error');
    }
}