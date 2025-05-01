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

        // Icon enable/disable
        searchInput.addEventListener("input", () => {
            searchIcon.classList.toggle("active", !!searchInput.value.trim());
        });

        // Click on icon
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
}