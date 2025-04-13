export class PaginationService {
    
    static updateShowMoreButton(products, displayedProducts, loadMoreCallback) {
        const container = document.getElementById('products-container');
        const existingShowMoreBtn = document.getElementById('show-more-btn');

        // Remover botón si existe
        if (existingShowMoreBtn) {
            existingShowMoreBtn.remove();
        }

        // Crear botón si hay más productos
        if (displayedProducts.length < products.length) {
            const showMoreBtn = document.createElement('button');
            showMoreBtn.id = 'show-more-btn';
            showMoreBtn.className = 'show-more-button';
            showMoreBtn.textContent = 'Mostrar más';
            showMoreBtn.onclick = loadMoreCallback;
            container.insertAdjacentElement('afterend', showMoreBtn);
        }
    }
}