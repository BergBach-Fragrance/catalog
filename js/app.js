import { apiConfig } from '../config/config.js';
import { HelperService } from '../services/HelperService.js';
import { LoaderService } from '../services/LoaderService.js';
import { PaginationService } from '../services/PaginationService.js';
import { ProductService } from '../services/ProductService.js';
import { FilterService } from '../services/FilterService.js';
import { ProductCardComponent } from '../components/ProductCardComponent.js';

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
        LoaderService.showProgressBar();
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

function getMainProductImage(productId) {
    return new Promise((resolve) => {
        const mainImagePath = `./products/images/${productId}/${productId}-image-0-main.jpg`;
        const placeholderPath = './imgs/placeholder.jpg';

        const img = new Image();

        // Manejar la carga exitosa
        img.onload = () => resolve(mainImagePath);

        // Manejar el error sin que se registre en la consola
        img.onerror = () => resolve(placeholderPath);

        // Asignar la ruta de la imagen
        img.src = mainImagePath;
    });
}

// Función para abrir el modal de detalle de producto con carrusel
function openProductDetail(productId) {
    const product = displayedProducts.find(p => p.id === productId);
    const modal = document.getElementById('product-detail-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!product) return;
    
    // Function to generate image URLs for the carousel
    function generateCarouselImages(productId, maxImages = 5) {
        const images = [];
        
        // Check main image first (using your existing function)
        const mainImageCheck = getMainProductImage(productId)
            .then(mainImagePath => {
                // If main image is found, add it to the start of the array
                if (mainImagePath !== './imgs/placeholder.jpg') {
                    images.push(mainImagePath);
                }
                
                // Then try to load additional images
                for (let i = 1; i < maxImages; i++) {
                    const imagePath = `./products/images/${productId}/${productId}-image-${i}.jpg`;
                    
                    // Create a promise to check if each image exists
                    const imagePromise = new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve(imagePath);
                        img.onerror = () => resolve(null);
                        img.src = imagePath;
                    });
                    
                    images.push(imagePromise);
                }
                
                // Wait for all image promises to resolve
                return Promise.all(images);
            });
        
        return mainImageCheck;
    }
    
    // Generate carousel images
    generateCarouselImages(productId)
        .then(resolvedImages => {
            // Filter out null images
            const validImages = resolvedImages.filter(img => img !== null);
            
            // Prepare carousel HTML
            let carouselItems = validImages.map(imageUrl => `
                <div class="carousel-item">
                    <img src="${imageUrl}" alt="${product.name}" onerror="this.onerror=null; this.src='imgs/placeholder.jpg';">
                </div>
            `).join('');
            
            // Fallback to placeholder if no images found
            if (validImages.length === 0) {
                carouselItems = `
                <div class="carousel-item">
                    <img src="imgs/placeholder.jpg" alt="${product.name}">
                </div>
                `;
            }
            
            // Rest of the modal content remains the same
            let html = `
                <div class="product-carousel">
                    <div class="carousel-container">
                        ${carouselItems}
                    </div>
                </div>
                <div class="product-detail-info">
                    <h2 class="product-detail-name">${product.name}</h2>
                    <p class="product-detail-brand">${product.brand} | ${product.gender} | ${product.volume}</p>
                    <p class="product-detail-price">${HelperService.formatPrice(product.price)}</p>
                    <p class="product-detail-description">${product.description}</p>
                    
                    <div class="notes-section">
                        <h4 class="notes-title">Notas aromáticas:</h4>
                        <div class="notes-list">
                            ${product.notes && Array.isArray(product.notes) ? 
                              product.notes.map(note => `<span class="note-item">${note}</span>`).join('') : 
                              '<span class="note-item">Sin información de notas</span>'}
                        </div>
                    </div>
                    
                    ${product.hasVideo && product.videoUrl && product.videoUrl.trim() !== "" ? `
                    <div class="product-video">
                        <h4 class="notes-title">Video del producto:</h4>
                        <video controls>
                            <source src="${product.videoUrl}" type="video/mp4">
                            Tu navegador no soporta la reproducción de videos.
                        </video>
                    </div>
                    ` : ''}
                </div>
            `;
            
            modalContent.innerHTML = html;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Inicializar el carrusel
            initCarousel();
        })
        .catch(error => {
            console.error('Error loading product images:', error);
            // Fallback to placeholder if any error occurs
            modalContent.innerHTML = `
                <div class="product-carousel">
                    <div class="carousel-container">
                        <div class="carousel-item">
                            <img src="imgs/placeholder.jpg" alt="Imagen no disponible">
                        </div>
                    </div>
                </div>
            `;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
}

window.openProductDetail = openProductDetail;

// Función para cargar más productos
function loadMoreProducts() {
    currentPage++;
    renderProducts(allProducts);
}

// Función para inicializar el carrusel con TinySlider
function initCarousel() {
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
        controlsText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ],
        responsive: {
            0: { edgePadding: 20 }
        }
    });
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