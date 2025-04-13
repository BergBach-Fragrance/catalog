export class UIService {

    // TODO: Tratar de traer el render de app.js aqui.
    static renderProducts(products) {
        const container = document.getElementById('products-container');
        container.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerText = product.name; // o usar plantilla HTML
            container.appendChild(productCard);
        });
    }

    static renderError(message) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    static clearError() {
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent = '';
        errorContainer.style.display = 'none';
    }
}
