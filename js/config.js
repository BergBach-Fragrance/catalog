// config.js - Configuración de la tienda
const tiendaConfig = {
    // Configuración general del sitio
    sitio: {
        nombre: "Fragancias de Oriente",
        descripcion: "Catálogo de Perfumes",
        nombreCorto: "Bergbach",
        subtitulo: "Perfumes Árabes y Diseñador Exclusivos",
        copyright: "2025 Bergbach - Fragancias de Oriente. Todos los derechos reservados."
    },
    
    // Configuración de búsqueda y filtros
    busqueda: {
        placeholder: "Buscar perfumes...",
        filtros: {
            marcas: [
                { valor: "Lattafa", texto: "Lattafa" },
                { valor: "Armaf", texto: "Armaf" },
                { valor: "Rasasi", texto: "Rasasi" },
                { valor: "Swiss Arabian", texto: "Swiss Arabian" }
            ],
            generos: [
                { valor: "Masculino", texto: "Masculino" },
                { valor: "Femenino", texto: "Femenino" },
                { valor: "Unisex", texto: "Unisex" }
            ],
            ordenamiento: [
                { valor: "name", texto: "Ordenar por relevantes" },
                { valor: "price-low", texto: "Precio: menor a mayor" },
                { valor: "price-high", texto: "Precio: mayor a menor" },
                { valor: "newest", texto: "Más recientes" }
            ]
        }
    },
    
    // Configuración del footer
    footer: {
        titulo: "Bergbach - Fragancias de Oriente",
        descripcion: "Importamos los mejores perfumes de oriente para ofrecerte fragancias de calidad y duración excepcional.",
        socialLinks: [
            { plataforma: "facebook", url: "#" },
            { plataforma: "instagram", url: "#" },
            { plataforma: "whatsapp", url: "#" }
        ]
    }
};