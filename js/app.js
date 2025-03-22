// Variables globales
let tinySlider;
let currentProducts = [];

async function loadProducts() {
    const products = await fetchDataFromGoogleSheets();
    renderProducts(products);
}

// Función para renderizar los productos
function renderProducts(products) {
    const container = document.getElementById('products-container');
    currentProducts = products;
    
    if (products.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron productos que coincidan con tu búsqueda.</div>';
        return;
    }
    
    let html = '';
    
    products.forEach(product => {
        const imageUrl = product.mainImage && product.mainImage.trim() !== "" 
            ? product.mainImage 
            : "assets/images/placeholder.jpg";

        html += `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}" onerror="this.onerror=null; this.src='assets/images/placeholder.jpg';">
                <div class="product-badge">${product.gender}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-brand">${product.brand}</p>
                <div class="product-notes">
                    ${product.notes.slice(0, 3).map(note => `<span class="note">${note}</span>`).join('')}
                    ${product.notes.length > 3 ? '<span class="note">+' + (product.notes.length - 3) + '</span>' : ''}
                </div>
                <div class="product-bottom">
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <button class="view-details" onclick="openProductDetail('${product.id}')">Ver detalles</button>
                </div>
            </div>
        </div>
        `;
    });
    
    container.innerHTML = html;
}

// Función para abrir el modal de detalle de producto con carrusel
function openProductDetail(productId) {
    const product = currentProducts.find(p => p.id === productId);
    const modal = document.getElementById('product-detail-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!product) return;
    
    // Preparar las imágenes para el carrusel
    const allImages = [product.mainImage, ...product.images];
    let carouselItems = '';
    
    allImages.forEach(image => {
        carouselItems += `
        <div class="carousel-item">
            <img src="${image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
        </div>
        `;
    });
    
    let html = `
        <div class="product-carousel">
            <div class="carousel-container">
                ${carouselItems}
            </div>
        </div>
        <div class="product-detail-info">
            <h2 class="product-detail-name">${product.name}</h2>
            <p class="product-detail-brand">${product.brand} | ${product.type}</p>
            <p class="product-detail-price">${formatPrice(product.price)}</p>
            <p class="product-detail-description">${product.description}</p>
            
            <div class="notes-section">
                <h4 class="notes-title">Notas aromáticas:</h4>
                <div class="notes-list">
                    ${product.notes.map(note => `<span class="note-item">${note}</span>`).join('')}
                </div>
            </div>
            
            ${product.hasVideo ? `
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

// Función para filtrar productos
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const brandFilter = document.getElementById('brand-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    
    let filtered = defaultProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                              product.brand.toLowerCase().includes(searchTerm) ||
                              product.notes.some(note => note.toLowerCase().includes(searchTerm));
        const matchesBrand = brandFilter === '' || product.brand === brandFilter;
        const matchesType = typeFilter === '' || product.type === typeFilter;
        
        return matchesSearch && matchesBrand && matchesType;
    });
    
    // Ordenar productos
    switch(sortFilter) {
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            // En este caso, asumimos que el orden original es por "más reciente"
            // Si tuvieras un campo fecha, ordenarías por ese campo
            break;
    }

    renderProducts(filtered);
}

// Cerrar modal si se hace clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('product-detail-modal');
    if (event.target === modal) {
        closeModal();
    }
};

// Simulación de carga de datos desde API
setTimeout(() => {
    loadProducts();
}, 1000);