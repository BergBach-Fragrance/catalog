const defaultProducts = [
    {
        id: "P001",
        brand: "Lattafa",
        name: "Raghba",
        gender: "Masculino",
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
        brand: "Armaf",
        name: "Asad",
        gender: "Masculino",
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
        brand: "Rasasi",
        name: "Qasamat Morhaf",
        gender: "Unisex",
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
        brand: "Swiss Arabian",
        name: "Shaghaf Oud",
        gender: "Femenino",
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
        brand: "Lattafa",
        name: "Khamrah",
        gender: "Unisex",
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
        brand: "Armaf",
        name: "Club de Nuit Intense",
        gender: "Masculino",
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

async function fetchDataFromGoogleSheets() {
    const sheetUrl = "https://script.google.com/macros/s/AKfycbxwrTDlxjKkqGjgjxHdkq37tzrWfE5TXvylYrGil4qQCoWQ6zg-au0rrhbm20ErrBYk/exec";
    
    try {
        const response = await fetch(sheetUrl);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Si la respuesta está vacía o no tiene productos, usar los hardcodeados
        if (!data || data.length === 0) {
            console.warn("No se encontraron productos en la hoja de cálculo. Usando datos hardcodeados.");
            return defaultProducts;
        }

        return data;
    } catch (error) {
        console.error("Error al obtener datos de Google Sheets:", error);
        return defaultProducts;
    }
}
