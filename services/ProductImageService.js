export class ProductImageService {
  static placeholderPath = "./imgs/placeholder.jpg";

  // Retorna una promesa con la imagen principal si existe, o el placeholder
  static getMainProductImage(productId) {
    const mainImagePath = `./products/images/${productId}/${productId}-image-0-main.jpg`;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(mainImagePath);
      img.onerror = () => resolve(this.placeholderPath);
      img.src = mainImagePath;
    });
  }

  // Genera una lista de imágenes válidas (máximo maxImages), incluyendo la principal primero
  static async getAvailableProductImages(productId, maxImages = 5) {
    const images = [];

    const mainImage = await this.getMainProductImage(productId);
    if (mainImage !== this.placeholderPath) {
      images.push(mainImage);
    }

    const imageChecks = [];

    for (let i = 1; i < maxImages; i++) {
      const path = `./products/images/${productId}/${productId}-image-${i}.jpg`;

      const check = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(path);
        img.onerror = () => resolve(null);
        img.src = path;
      });

      imageChecks.push(check);
    }

    const resolved = await Promise.all(imageChecks);
    const valid = resolved.filter((img) => img !== null);

    return images.length > 0 || valid.length > 0
      ? [...images, ...valid]
      : [this.placeholderPath];
  }

  static async waitForImagesToLoad(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return Promise.resolve();

    const images = container.querySelectorAll("img");
    const promises = [];

    images.forEach((img) => {
      if (img.complete && img.naturalHeight !== 0) return;
      promises.push(
        new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        })
      );
    });

    return Promise.all(promises);
  }
}
