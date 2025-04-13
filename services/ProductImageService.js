export class ProductImageService {
    
    static getMainProductImage(productId) {
        return new Promise((resolve) => {
            const mainImagePath = `./products/images/${productId}/${productId}-image-0-main.jpg`;
            const placeholderPath = './imgs/placeholder.jpg';

            const img = new Image();
            img.onload = () => resolve(mainImagePath);
            img.onerror = () => resolve(placeholderPath);
            img.src = mainImagePath;
        });
    }
}