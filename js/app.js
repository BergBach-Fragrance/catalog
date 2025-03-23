// Variables globales
let tinySlider;
let currentProducts = [];

// Inicializar todo cuando la página se carga
window.onload = function() {
    // Inicializar eventos de filtrado
    initEvents();
    
    // Cargar productos
    loadProducts();
};

// Función para cargar los productos
async function loadProducts() {
    // Mostrar la barra de progreso al inicio de la carga
    showProgressBar();  
    // Deshabilitar filtros mientras se carga
    disableFilters();

    try {
        // Mostrar el mensaje de carga
        document.querySelector('.loading').style.display = 'block';
        
        // Obtener los productos desde Google Sheets
        const products = await fetchDataFromGoogleSheets();
        
        // Filtrar productos con stock > 0
        const availableProducts = products.filter(product => product.stock > 0);
        
        // Renderizar los productos disponibles
        renderProducts(availableProducts);

        // Ocultar la barra de progreso y el mensaje de carga después de cargar los productos
        document.querySelector('.progress-container').style.display = 'none';
        document.querySelector('.loading').style.display = 'none';
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        // Si hay un error, ocultar la barra de progreso y el mensaje de carga
        document.querySelector('.progress-container').style.display = 'none';
        document.querySelector('.loading').style.display = 'none';
    } finally {
        enableFilters();
    }
}

// Función para mostrar y actualizar la barra de progreso
function showProgressBar() {
    const progressBarContainer = document.querySelector('.progress-container');
    progressBarContainer.style.display = 'block'; // Mostrar la barra

    let progress = 0;
    const progressBar = document.querySelector('.progress-bar');

    const interval = setInterval(() => {
        if (progress < 100) {
            progress += 1;  // Aumentar el progreso
            progressBar.style.width = progress + '%';  // Actualizar el ancho de la barra
        } else {
            clearInterval(interval);  // Detener la animación cuando llegue al 100%
        }
    }, 100);  // Aumenta el progreso cada 100 ms
}

// Función para bloquear los filtros
function disableFilters() {
    document.getElementById('search-input').disabled = true;
    document.getElementById('brand-filter').disabled = true;
    document.getElementById('type-filter').disabled = true;
    document.getElementById('sort-filter').disabled = true;
}

// Función para desbloquear los filtros
function enableFilters() {
    document.getElementById('search-input').disabled = false;
    document.getElementById('brand-filter').disabled = false;
    document.getElementById('type-filter').disabled = false;
    document.getElementById('sort-filter').disabled = false;
}

// Función para renderizar los productos con paginación
async function renderProducts(products) {
    const container = document.getElementById('products-container');
    currentProducts = products;

    if (currentProducts.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron productos disponibles.</div>';
        return;
    }

    let html = '';

    for (const product of currentProducts) {
        const imageUrl = await getProductImage(product.id);

        html += `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}" onerror="this.onerror=null; this.src='imgs/placeholder.jpg';">
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
    }

    container.innerHTML = html;
}

// Función para obtener la imagen principal de un producto basado en su ID
function getProductImage(productId) {
    const mainImagePath = `products/images/${productId}/${productId}-image-0-main.jpg`;

    return new Promise((resolve) => {
        const img = new Image();
        img.src = mainImagePath;
        
        img.onload = () => resolve(mainImagePath); // Si la imagen existe, devolver la ruta
        img.onerror = () => resolve("imgs/placeholder.jpg"); // Si no, devolver placeholder
        
        // Agregar un manejo adicional de errores en la carga de la imagen
        try {
            img.src = mainImagePath;
        } catch (e) {
            console.error(`Error loading image for product ${productId}: ${e}`);
            resolve("imgs/placeholder.jpg");
        }
    });
}

// Función para abrir el modal de detalle de producto con carrusel
function openProductDetail(productId) {
    const product = currentProducts.find(p => p.id === productId);
    const modal = document.getElementById('product-detail-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!product) return;
    
    // Preparar las imágenes para el carrusel
    let carouselItems = '';
    
    // Primero verificamos la imagen principal
    const mainImageUrl = product.mainImage && product.mainImage.trim() !== "" 
        ? product.mainImage 
        : "imgs/placeholder.jpg";
    
    carouselItems += `
    <div class="carousel-item">
        <img src="${mainImageUrl}" alt="${product.name}" onerror="this.onerror=null; this.src='imgs/placeholder.jpg';">
    </div>
    `;
    
    // Luego añadimos las imágenes adicionales, verificando cada una
    if (product.images && Array.isArray(product.images)) {
        product.images.forEach(image => {
            if (image && image.trim() !== "") {
                carouselItems += `
                <div class="carousel-item">
                    <img src="${image}" alt="${product.name}" onerror="this.onerror=null; this.src='imgs/placeholder.jpg';">
                </div>
                `;
            }
        });
    }
    
    let html = `
        <div class="product-carousel">
            <div class="carousel-container">
                ${carouselItems}
            </div>
        </div>
        <div class="product-detail-info">
            <h2 class="product-detail-name">${product.name}</h2>
            <p class="product-detail-brand">${product.brand} | ${product.gender}</p>
            <p class="product-detail-price">${formatPrice(product.price)}</p>
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
    
    let filtered = currentProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                              product.brand.toLowerCase().includes(searchTerm) ||
                              (product.notes && Array.isArray(product.notes) && 
                              product.notes.some(note => note.toLowerCase().includes(searchTerm)));
        const matchesBrand = brandFilter === '' || product.brand === brandFilter;
        const matchesType = typeFilter === '' || product.gender === typeFilter;
        
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

// Inicializar los eventos de filtrado
function initEvents() {
    // Evento para el buscador
    document.getElementById('search-input').addEventListener('input', filterProducts);
    
    // Eventos para los selectores de filtro
    document.getElementById('brand-filter').addEventListener('change', filterProducts);
    document.getElementById('type-filter').addEventListener('change', filterProducts);
    document.getElementById('sort-filter').addEventListener('change', filterProducts);
}

// Cerrar modal si se hace clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('product-detail-modal');
    if (event.target === modal) {
        closeModal();
    }
};