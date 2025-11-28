import { HelperService } from "./HelperService.js";

export class ProductService {
  static PRODUCT_MARGIN = 42000;

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
      const url = new URL(this.apiConfig.google.SheetsUrl);
      url.searchParams.set("t", Date.now());

      const sheetName = this.apiConfig.google.sheets?.perfumes;
      if (sheetName) {
        url.searchParams.set("sheet", sheetName);
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      const newVersion = data.version;
            const products = Array.isArray(data.products)
        ? data.products
        : Array.isArray(data.decants)
        ? data.decants
        : [];


      if (this.cachedProducts && cachedVersion === newVersion) {
        return this.cachedProducts;
      }

      this.cachedProducts = products.map((product) => ({
        ...product,
        price: Number(product.price) + ProductService.PRODUCT_MARGIN,
        stock: parseInt(product.stock) || 0,
      }));

      console.log(
        "Productos totales:",
        this.cachedProducts.length,
        " | Sin stock:",
        this.cachedProducts.filter((p) => p.stock <= 0).length
      );

      window.cachedProducts = this.cachedProducts;
      window.cachedProductsVersion = newVersion;

      return this.cachedProducts;
    } catch (error) {
      console.error("Error al obtener productos desde Google Sheets:", error);
      return [];
    }
  }

  async getFilteredProducts(filters) {
    const products = await this.fetchProducts();
    const sanitizedFilters = HelperService.SanitizeFilters(filters);

    return products
      .filter((product) => {
        const matchesSearch = sanitizedFilters.searchTerm
          ? product.name.toLowerCase().includes(sanitizedFilters.searchTerm) ||
            product.brand.toLowerCase().includes(sanitizedFilters.searchTerm)
          : true;

        const matchesBrand = sanitizedFilters.brand
          ? product.brand === sanitizedFilters.brand
          : true;

        const matchesGender = sanitizedFilters.gender
          ? product.gender.toLowerCase() ===
            sanitizedFilters.gender.toLowerCase()
          : true;

        return matchesSearch && matchesBrand && matchesGender;
      })
      .sort(this.sortProducts(sanitizedFilters.sortBy));
  }

  sortProducts(criteria) {
    return (a, b) => {
      // 1️⃣ Siempre: productos con stock primero
      const aInStock = a.stock > 0 ? 1 : 0;
      const bInStock = b.stock > 0 ? 1 : 0;

      if (aInStock !== bInStock) {
        // bInStock - aInStock => 1 antes que 0
        return bInStock - aInStock;
      }

      // 2️⃣ Dentro de cada grupo (con stock / sin stock), aplicar criterio elegido
      switch (criteria) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "relevance":
          return a.id.localeCompare(b.id);
        default:
          return a.id.localeCompare(b.id);
      }
    };
  }
}