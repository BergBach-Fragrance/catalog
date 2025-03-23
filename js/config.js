// config.js - Store Configuration
const storeConfig = {
    // General site configuration
    site: {
        name: "Fragancias de Oriente",
        description: "Fragrance Catalog",
        shortName: "Bergbach",
        subtitle: "Arabian and Exclusive Designer Perfumes",
        copyright: "2025 Bergbach - Fragancias de Oriente. All rights reserved.",
        title: "Fragancias de Oriente - Catalog",
        url: "https://bergbach-fragrance.github.io/catalog/",
        previewImage: "imgs/bergbach-fragrance-preliminar.jpg", // Add the URL of your preview image here
    },
    
    // Search and filter configuration
    search: {
        placeholder: "Search perfumes...",
        filters: {
            brands: [
                { value: "Lattafa", text: "Lattafa" },
                { value: "Armaf", text: "Armaf" },
                { value: "Rasasi", text: "Rasasi" },
                { value: "Swiss Arabian", text: "Swiss Arabian" }
            ],
            genders: [
                { value: "Masculine", text: "Masculine" },
                { value: "Feminine", text: "Feminine" },
                { value: "Unisex", text: "Unisex" }
            ],
            sorting: [
                { value: "name", text: "Sort by relevance" },
                { value: "price-low", text: "Price: Low to High" },
                { value: "price-high", text: "Price: High to Low" },
                { value: "newest", text: "Newest" }
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