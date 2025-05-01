import { apiConfig } from '../config/config.js';
import { LoaderService } from '../services/LoaderService.js';
import { ProductService } from '../services/ProductService.js';
import { FilterService } from '../services/FilterService.js';
import { UIService } from '../services/UIService.js';
import { ProductCardComponent } from '../components/ProductCardComponent.js';
import { ProductDetailModalComponent } from '../components/ProductDetailModalComponent.js';

const productService = new ProductService(apiConfig);

// Variables globales
let tinySlider;
let displayedProducts = []; // Nuevo: almacenar productos mostrados

// Inicializar todo cuando la página se carga
window.onload = function() {
    // Inicializar eventos de filtros
    initEvents();

    // Inicializar animación del loader
    LoaderService.initLoader();

    // Mostrar el loader mientras se cargan los productos
    LoaderService.showLoader();

    // Cargar productos
    loadProducts().then(() => {
        // Ocultar loader cuando termine la carga
        LoaderService.hideLoader();
    });
};

// Función para cargar los productos
async function loadProducts() {
    try {
        LoaderService.showLoader();
        FilterService.disableFilters();
        
        // Obtener los productos desde Google Sheets
        const products = await productService.fetchProducts();
        
        if (products.length === 0) {
            document.querySelector('.filters-container').style.display = 'none';
            showErrorPage();
            return;
        }

        // Filtrar productos con stock > 0
        const availableProducts = products.filter(product => product.stock > 0);

        displayedProducts = [];        

        // Renderizar los productos disponibles
        renderProducts(availableProducts);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        showErrorPage();
    } finally {
        LoaderService.hideLoader();
        FilterService.enableFilters();
    }
}

// Función para renderizar los productos
async function renderProducts(products, reset = true) {
    const container = document.getElementById('products-container');

    if (reset) {
        // Limpia el contenedor
        container.innerHTML = '';
        displayedProducts = [];
    }

    for (const product of products) {
        // Evitar productos duplicados
        if (!displayedProducts.some(p => p.id === product.id)) {
            const productCard = await ProductCardComponent.render(product);
            container.innerHTML += productCard;
            // Agregar el producto a los productos mostrados
            displayedProducts.push(product);
        }
    }
}

function openProductDetail(productId) {
    const product = displayedProducts.find(p => p.id === productId);
    if (!product) return;

    ProductDetailModalComponent.open(product);
}

window.openProductDetail = openProductDetail;

// Función para cerrar el modal
function closeModal() {
    document.getElementById('product-detail-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Destruir el carrusel al cerrar el modal
    if (tinySlider) {
        tinySlider.destroy();
        tinySlider = null;
    }
}

window.closeModal = closeModal;

async function filterProducts() {
    try {
        LoaderService.showLoader();
        FilterService.disableFilters();

        const filters = FilterService.getFilters();
        const filteredProducts = await productService.getFilteredProducts(filters);

        if (!Array.isArray(filteredProducts)) {
            console.error('filteredProducts no es un array:', filteredProducts);
            UIService.renderError('Los productos filtrados no tienen el formato correcto.');
            return;
        }

        displayedProducts = [];
        renderProducts(filteredProducts);

    } catch (error) {
        console.error('Error al filtrar los productos:', error);
        UIService.renderError('Hubo un problema al cargar los productos. Intenta nuevamente.');
    } finally {
        FilterService.enableFilters();
        LoaderService.hideLoader();
    }
}

// Inicializar los eventos de filtrado
function initEvents() {
    FilterService.initSearchEvents(filterProducts);
    FilterService.initSelectEvents(filterProducts);
}

// Cerrar modal si se hace clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('product-detail-modal');
    if (event.target === modal) {
        closeModal();
    }
};

function showErrorPage() {
    const container = document.getElementById('products-container');
    container.innerHTML = `
        <div class="error-page">
            <img src="imgs/error-icon.svg" alt="Error" class="error-icon">
            <h2>¡Uy! No pudimos cargar los productos</h2>
            <p>Estamos teniendo problemas para conectarnos al catálogo. Intenta recargar la página o vuelve más tarde.</p>
            <button onclick="location.reload()">Reintentar</button>
        </div>
    `;
}