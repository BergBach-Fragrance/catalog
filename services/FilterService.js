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
        ['search-input', 'brand-filter', 'gender-filter', 'sort-filter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = true;
        });
    }

    static enableFilters() {
        ['search-input', 'brand-filter', 'gender-filter', 'sort-filter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = false;
        });
    }
}