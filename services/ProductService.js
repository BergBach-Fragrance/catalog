import { HelperService } from './HelperService.js';

export class ProductService {
    constructor(apiConfig) {
        this.apiConfig = apiConfig;
        this.cachedProducts = null;

        // Si ya hay productos en el cache global, usarlos
        if (window.cachedProducts) {
            this.cachedProducts = window.cachedProducts;
        }
    }

    // Método para obtener productos desde Google Sheets o por defecto
    async fetchProducts() {
        const cachedVersion = window.cachedProductsVersion;
    
        try {
            const response = await fetch(`${this.apiConfig.google.SheetsUrl}?t=${Date.now()}`);
            const data = await response.json();
    
            const newVersion = data.version;
            const products = data.products;
    
            if (this.cachedProducts && cachedVersion === newVersion) {
                return this.cachedProducts;
            }
    
            this.cachedProducts = products
                .map(product => ({
                    ...product,
                    price: parseFloat(product.price),
                    stock: parseInt(product.stock)
                }))
                .filter(product => product.stock > 0);
    
            window.cachedProducts = this.cachedProducts;
            window.cachedProductsVersion = newVersion;
    
            return this.cachedProducts;
    
        } catch (error) {
            console.error('Error al obtener productos desde Google Sheets:', error);
            return [];
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