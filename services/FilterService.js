export class FilterService {
    static getFilters() {
        return {
            searchTerm: document.getElementById('search-input').value.toLowerCase().trim(),
            brand: document.getElementById('brand-filter').value.trim(),
            gender: document.getElementById('gender-filter').value.trim(),
            sortBy: document.getElementById('sort-filter').value.trim()
        };
    }

    static disableFilters() {
        this.#filterElements().forEach(el => el.disabled = true);
    }

    static enableFilters() {
        this.#filterElements().forEach(el => el.disabled = false);
    }

    static initSearchEvents(onSearch) {
        const searchInput = document.getElementById("search-input");
        const searchIcon = document.getElementById("search-icon");
    
        if (!searchInput || !searchIcon) return;
    
        // Enter key
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                onSearch();
            }
        });
    
        // Input event con detección de limpieza
        searchInput.addEventListener("input", () => {
            const isEmpty = !searchInput.value.trim();
    
            if (isEmpty) {
                searchIcon.classList.remove("active");
                this.resetFilters();   // <- Limpia todos los filtros
                onSearch();            // <- Aplica filtrado con valores en blanco
            } else {
                searchIcon.classList.add("active");
            }
        });
    
        // Click en el icono
        searchIcon.addEventListener("click", () => {
            if (searchIcon.classList.contains("active")) {
                onSearch();
            }
        });
    }

    static initSelectEvents(onChange) {
        ["brand-filter", "gender-filter", "sort-filter"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener("change", onChange);
        });
    }

    static #filterElements() {
        return ["search-input", "brand-filter", "gender-filter", "sort-filter"]
            .map(id => document.getElementById(id))
            .filter(el => el !== null);
    }

    static resetFilters() {
        const container = document.getElementById('filters-container'); // Asegurate de tener un contenedor padre común
    
        if (!container) return;
    
        const inputs = container.querySelectorAll('input, select, textarea');
    
        inputs.forEach(el => {
            if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
                el.value = '';
            } else if (el.tagName === 'SELECT') {
                el.selectedIndex = 0;
            } else if (el.type === 'checkbox' || el.type === 'radio') {
                el.checked = false;
            } else if (el.tagName === 'TEXTAREA') {
                el.value = '';
            }
        });
    
        // Extra: ocultar icono si existe
        const searchIcon = document.getElementById('search-icon');
        if (searchIcon) searchIcon.classList.remove('active');
    }    
}