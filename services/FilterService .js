export class FilterService {
    
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