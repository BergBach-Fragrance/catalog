// Estructura de datos para los productos
const productsData = [
    {
        id: "P001",
        name: "Raghba",
        brand: "Lattafa",
        type: "Masculino",
        price: 12500,
        description: "Una fragancia intensa y duradera con notas de vainilla, madera de agar y ámbar. Ideal para ocasiones nocturnas.",
        notes: ["Vainilla", "Oud", "Ámbar", "Madera", "Almizcle"],
        mainImage: "products/images/P001/P001-main.jpg",
        images: [
            "products/images/P001/P001-image-1.jpg",
            "products/images/P001/P001-image-2.jpg",
            "products/images/P001/P001-image-3.jpg"
        ],
        hasVideo: true,
        videoUrl: "products/videos/P001-video.mp4"
    },
    {
        id: "P002",
        name: "Asad",
        brand: "Armaf",
        type: "Masculino",
        price: 15000,
        description: "Una fragancia poderosa y masculina con notas de cuero, madera y especias. Perfecta para el hombre decidido.",
        notes: ["Cuero", "Madera", "Cardamomo", "Pimienta", "Cedro"],
        mainImage: "products/images/P002/P002-main.jpg",
        images: [
            "products/images/P002/P002-image-1.jpg",
            "products/images/P002/P002-image-2.jpg"
        ],
        hasVideo: false
    },
    {
        id: "P003",
        name: "Qasamat Morhaf",
        brand: "Rasasi",
        type: "Unisex",
        price: 18500,
        description: "Una fragancia unisex sofisticada con notas florales, amaderadas y ámbar. Elegante y versátil.",
        notes: ["Jazmín", "Rosa", "Ámbar", "Sándalo", "Pachulí"],
        mainImage: "products/images/P003/P003-main.jpg",
        images: [
            "products/images/P003/P003-image-1.jpg",
            "products/images/P003/P003-image-2.jpg",
            "products/images/P003/P003-image-3.jpg",
            "products/images/P003/P003-image-4.jpg"
        ],
        hasVideo: true,
        videoUrl: "products/videos/P003-video.mp4"
    },
    {
        id: "P004",
        name: "Shaghaf Oud",
        brand: "Swiss Arabian",
        type: "Femenino",
        price: 14000,
        description: "Una fragancia femenina seductora con notas de oud, rosas y vainilla. Irresistiblemente cautivadora.",
        notes: ["Oud", "Rosa", "Vainilla", "Azafrán", "Almizcle"],
        mainImage: "products/images/P004/P004-main.jpg",
        images: [
            "products/images/P004/P004-image-1.jpg",
            "products/images/P004/P004-image-2.jpg"
        ],
        hasVideo: false
    },
    {
        id: "P005",
        name: "Khamrah",
        brand: "Lattafa",
        type: "Unisex",
        price: 16500,
        description: "Una fragancia unisex opulenta con notas de vainilla, oud y especias. Rica y duradera.",
        notes: ["Vainilla", "Oud", "Especias", "Frutos Rojos", "Tabaco"],
        mainImage: "products/images/P005/P005-main.jpg",
        images: [
            "products/images/P005/P005-image-1.jpg",
            "products/images/P005/P005-image-2.jpg",
            "products/images/P005/P005-image-3.jpg"
        ],
        hasVideo: true,
        videoUrl: "products/videos/P005-video.mp4"
    },
    {
        id: "P006",
        name: "Club de Nuit Intense",
        brand: "Armaf",
        type: "Masculino",
        price: 13500,
        description: "Una fragancia fresca y duradera con notas cítricas, madera y ámbar. Perfecta para el día a día.",
        notes: ["Limón", "Piña", "Manzana", "Madera", "Ámbar"],
        mainImage: "products/images/P006/P006-main.jpg",
        images: [
            "products/images/P006/P006-image-1.jpg",
            "products/images/P006/P006-image-2.jpg"
        ],
        hasVideo: false
    }
];

// Función para formatear precio en ARS
function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
}

// Función para conectar con Google Sheets (a implementar en el futuro)
async function fetchDataFromGoogleSheets() {
    // Esta función se implementará más tarde
    // Aquí se haría la conexión con la API de Google Sheets
    console.log("Conectando con Google Sheets...");
    return productsData; // Por ahora devuelve los datos estáticos
}
