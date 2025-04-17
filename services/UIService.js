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

    static initCarousel() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;

        if (window.tinySliderInstance) {
            window.tinySliderInstance.destroy();
        }

        window.tinySliderInstance = tns({
            container: '.carousel-container',
            items: 1,
            slideBy: 1,
            autoplay: false,
            controls: true,
            nav: true,
            navPosition: 'bottom',
            swipeAngle: 15,
            touch: true,
            mouseDrag: true,
            speed: 400,
            controlsText: ['‹', '›'],
            responsive: {
                0: { edgePadding: 20 }
            }
        });
    }
}
