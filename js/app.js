import { apiConfig } from '../config/config.js';
import { LoaderService } from '../services/LoaderService.js';
import { PaginationService } from '../services/PaginationService.js';
import { ProductService } from '../services/ProductService.js';
import { FilterService } from '../services/FilterService.js';
import { ProductCardComponent } from '../components/ProductCardComponent.js';
import { ProductDetailModalComponent } from '../components/ProductDetailModalComponent.js';

const productService = new ProductService(apiConfig);

// Variables globales
let tinySlider;
let allProducts = []; // Cambio: almacenar todos los productos originales
let displayedProducts = []; // Nuevo: almacenar productos mostrados
let currentPage = 1;
const PRODUCTS_PER_PAGE = 50;

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
            document.querySelector('.search-filter').style.display = 'none';
            showErrorPage();
            return;
        }

        // Filtrar productos con stock > 0
        const availableProducts = products.filter(product => product.stock > 0);

        // Reiniciar la página al cargar productos
        currentPage = 1;
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

// Función para renderizar los productos con paginación acumulativa
async function renderProducts(products) {
    const container = document.getElementById('products-container');
    
    // Primera carga: reiniciar todo
    if (currentPage === 1) {
        container.innerHTML = '';
        allProducts = products;
        displayedProducts = [];
    }

    // Calcular el rango de productos para la página actual
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const productsToRender = products.slice(startIndex, endIndex);

    for (const product of productsToRender) {
        // Evitar productos duplicados
        if (!displayedProducts.some(p => p.id === product.id)) {
            const productCard = await ProductCardComponent.render(product);
            container.innerHTML += productCard;
            // Agregar el producto a los productos mostrados
            displayedProducts.push(product);
        }
    }

    // Mostrar/ocultar botón de paginación
    PaginationService.updateShowMoreButton(products, displayedProducts, loadMoreProducts);
}

function openProductDetail(productId) {
    const product = displayedProducts.find(p => p.id === productId);
    if (!product) return;

    ProductDetailModalComponent.open(product);
}

window.openProductDetail = openProductDetail;

// Función para cargar más productos
function loadMoreProducts() {
    currentPage++;
    renderProducts(allProducts);
}

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

        currentPage = 1;
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
    // Evento para el buscador
    document.getElementById('search-input').addEventListener('input', filterProducts);
    
    // Eventos para los selectores de filtro
    document.getElementById('brand-filter').addEventListener('change', filterProducts);
    document.getElementById('gender-filter').addEventListener('change', filterProducts);
    document.getElementById('sort-filter').addEventListener('change', filterProducts);
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