export const storeConfig = {
    // General site configuration
    site: {
        name: "Fragancias de Oriente",
        description: "Fragrance Catalog",
        shortName: "Bergbach",
        subtitle: "Arabian and Exclusive Designer Perfumes",
        copyright: "2025 Bergbach - Fragancias de Oriente. All rights reserved.",
        title: "Fragancias de Oriente - Catalog",
        url: "https://bergbach-fragrance.github.io/catalog/",
        previewImage: "imgs/bergbach-fragrance-preliminar.jpg"
    },
    
    // Search and filter configuration
    search: {
        placeholder: "Buscar perfumes...",
        filters: {
            brands: [
                { value: "Afnan", text: "Afnan" },
                { value: "Al Haramain", text: "Al Haramain" },
                { value: "Armaf", text: "Armaf" },
                { value: "Bharara", text: "Bharara" },
                { value: "Lattafa", text: "Lattafa" },
                { value: "Maison Alhambra", text: "Maison Alhambra" },
                { value: "Rasasi", text: "Rasasi" },
                { value: "Giorgio Armani", text: "Giorgio Armani" },
                { value: "Jean Paul Gaultier", text: "Jean Paul Gaultier" },
                { value: "Valentino", text: "Valentino" },
                { value: "Xerjoff", text: "Xerjoff" }
            ],
            genders: [
                { value: "Male", text: "Masculino" },
                { value: "Female", text: "Femenino" },
                { value: "Unisex", text: "Unisex" }
            ],
            sorting: [
                { value: "relevance", text: "Ordenar por relevancia" },
                { value: "price-low", text: "Precio: Menor a Mayor" },
                { value: "price-high", text: "Precio: Mayor a Menor" },
                { value: "newest", text: "Nuevos" }
            ]
        }
    },
    
    // Footer configuration
    footer: {
        title: "Bergbach - Fragancias de Oriente",
        description: "We import the best perfumes from the Orient to offer you fragrances of exceptional quality and longevity.",
        socialLinks: [
            { platform: "facebook", url: "#" },
            { platform: "instagram", url: "#" },
            { platform: "whatsapp", url: "#" }
        ]
    }
};

export const apiConfig = {
    google: {
        SheetsUrl: "https://script.google.com/macros/s/AKfycbxwrTDlxjKkqGjgjxHdkq37tzrWfE5TXvylYrGil4qQCoWQ6zg-au0rrhbm20ErrBYk/exec"
    }
};