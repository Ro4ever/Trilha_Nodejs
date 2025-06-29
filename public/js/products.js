// public/js/products.js

document.addEventListener('DOMContentLoaded', async () => {
    // Carrega os produtos na página inicial (index.html)
    if (document.getElementById('product-list')) {
        await loadProducts();
    }

    // Carrega detalhes do produto na página de detalhes (product_detail.html)
    if (document.getElementById('product-detail-container')) {
        await loadProductDetail();
    }

    // Configura o formulário de feedback
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }
});

async function loadProducts() {
    const productListDiv = document.getElementById('product-list');
    if (!productListDiv) return;

    try {
        const products = await api.products.getAll();
        productListDiv.innerHTML = ''; // Limpa antes de adicionar

        if (products.length === 0) {
            productListDiv.innerHTML = '<p>Nenhum produto cadastrado ainda.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h3>${product.nome}</h3>
                <p>Categoria: ${product.categoria}</p>
                <p>${product.descricao.substring(0, 100)}...</p>
                <p class="rating">Avaliação Média: ${product.media_avaliacao ? product.media_avaliacao.toFixed(1) : 'N/A'} (${product.total_feedbacks} avaliações)</p>
                <a href="product_detail.html?id=${product.id}" class="button">Ver Detalhes</a>
            `;
            productListDiv.appendChild(productCard);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        productListDiv.innerHTML = '<p class="message error">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}

async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productDetailContainer = document.getElementById('product-detail-container');
    const feedbacksList = document.getElementById('feedbacks-list');
    const feedbackFormSection = document.getElementById('feedback-form-section');

    if (!productId || !productDetailContainer || !feedbacksList) return;

    const token = auth.getToken();
    if (!token) {
        // Se não houver token, esconde o formulário de feedback
        if (feedbackFormSection) feedbackFormSection.style.display = 'none';
        document.getElementById('feedback-message').textContent = 'Faça login para deixar um feedback.';
    } else {
        if (feedbackFormSection) feedbackFormSection.style.display = 'block';
    }


    try {
        const product = await api.products.getById(productId);
        if (!product) {
            productDetailContainer.innerHTML = '<p class="message error">Produto não encontrado.</p>';
            return;
        }

        productDetailContainer.innerHTML = `
            <h2>${product.nome}</h2>
            <p><strong>Categoria:</strong> ${product.categoria}</p>
            <p><strong>Descrição:</strong> ${product.descricao}</p>
            <p class="rating"><strong>Avaliação Média:</strong> ${product.media_avaliacao ? product.media_avaliacao.toFixed(1) : 'N/A'} (${product.total_feedbacks} avaliações)</p>
        `;

        feedbacksList.innerHTML = ''; // Limpa antes de adicionar feedbacks

        if (product.feedbacks && product.feedbacks.length > 0) {
            product.feedbacks.forEach(feedback => {
                const feedbackItem = document.createElement('li');
                feedbackItem.className = 'feedback-item';
                feedbackItem.innerHTML = `
                    <p class="user">${feedback.usuario_nome}</p>
                    <p class="rating">Avaliação: ${feedback.avaliacao} estrelas</p>
                    <p>${feedback.comentario || '<i>Nenhum comentário.</i>'}</p>
                    <p class="date">Data: ${new Date(feedback.data_criacao).toLocaleDateString('pt-BR')}</p>
                `;
                feedbacksList.appendChild(feedbackItem);
            });
        } else {
            feedbacksList.innerHTML = '<p>Nenhum feedback aprovado para este produto ainda.</p>';
        }

    } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        productDetailContainer.innerHTML = '<p class="message error">Erro ao carregar detalhes do produto. Tente novamente mais tarde.</p>';
    }
}

async function handleFeedbackSubmit(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const token = auth.getToken();

    if (!token) {
        auth.showMessage('feedback-message', 'Você precisa estar logado para enviar feedback.', 'error');
        return;
    }
    if (!productId) {
        auth.showMessage('feedback-message', 'Produto inválido.', 'error');
        return;
    }

    const rating = document.getElementById('feedback-rating').value;
    const comment = document.getElementById('feedback-comment').value;

    if (!rating && !comment) {
        auth.showMessage('feedback-message', 'Por favor, forneça uma avaliação ou um comentário.', 'error');
        return;
    }

    try {
        await api.feedbacks.add(productId, parseInt(rating), comment, token);
        auth.showMessage('feedback-message', 'Feedback enviado com sucesso! Aguardando moderação.', 'success');
        // Limpa o formulário
        document.getElementById('feedback-rating').value = '';
        document.getElementById('feedback-comment').value = '';
        // Recarrega os feedbacks após o envio (para ver o novo feedback como pendente se a lógica do backend permitir, ou apenas para limpar a lista)
        // Por simplicidade, não vamos recarregar agora, pois o novo feedback estará pendente no backend.
    } catch (error) {
        auth.showMessage('feedback-message', error.message || 'Erro ao enviar feedback.', 'error');
    }
}