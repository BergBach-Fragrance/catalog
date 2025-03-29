import { HelperService } from './HelperService.js';

export class ProductService {
    constructor(apiConfig) {
        this.apiConfig = apiConfig;
        this.cachedProducts = null;
        this.defaultProductsPath = './products/default/DefaultProducts.json';

        // Si ya hay productos en el cache global, usarlos
        if (window.cachedProducts) {
            this.cachedProducts = window.cachedProducts;
        }
    }

    // Método para obtener productos desde Google Sheets o por defecto
    async fetchProducts() {
        if (this.cachedProducts) {
            return this.cachedProducts;
        }

        try {
            // Intentar obtener desde Google Sheets
            const response = await fetch(this.apiConfig.google.SheetsUrl);
            const data = await response.json();

            this.cachedProducts = data.map(product => ({
                ...product,
                price: parseFloat(product.price),
                stock: parseInt(product.stock)
            }));

            // Guardar en el caché global
            window.cachedProducts = this.cachedProducts;

            // El orden por relevancia ordena por ID de producto secuencial. La primera carga lo hace de esta manera.
            //return this.cachedProducts.sort(sortProducts('relevance'));
            return this.cachedProducts;
        } catch (error) {
            console.error('Error al obtener productos desde Google Sheets:', error);
            console.warn('Cargando productos por defecto.');

            try {
                const defaultResponse = await fetch(this.defaultProductsPath);

                if (!defaultResponse.ok) {
                    throw new Error("No se pudo cargar DefaultProducts.json");
                }

                const defaultProducts = await defaultResponse.json();

                this.cachedProducts = defaultProducts.map(product => ({
                    ...product,
                    price: HelperService.formatPrice(product.price)
                }));

                // Guardar en el caché global
                window.cachedProducts = this.cachedProducts;

                return this.cachedProducts;
            } catch (fetchError) {
                console.error('Error al cargar productos por defecto:', fetchError);
                return [];
            }
        }
    }

    async getFilteredProducts(filters) {
        const products = await this.fetchProducts();
        const sanitizedFilters = HelperService.SanitizeFilters(filters);

        return products.filter(product => {
            const matchesSearch = sanitizedFilters.searchTerm ? 
                product.name.toLowerCase().includes(sanitizedFilters.searchTerm) ||
                product.brand.toLowerCase().includes(sanitizedFilters.searchTerm)
                : true;

            const matchesBrand = sanitizedFilters.brand ? 
                product.brand === sanitizedFilters.brand
                : true;

            const matchesGender = sanitizedFilters.gender ? 
                product.gender.toLowerCase() === sanitizedFilters.gender.toLowerCase()
                : true;

            return matchesSearch && matchesBrand && matchesGender;
        }).sort(this.sortProducts(sanitizedFilters.sortBy));
    }

    // Método para ordenar productos
    sortProducts(criteria) {
        return (a, b) => {
            switch (criteria) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'relevance':
                    return a.id.localeCompare(b.id);
                default:
                    return a.id.localeCompare(b.id);
            }
        };
    }    
}