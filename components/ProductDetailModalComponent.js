import { ProductImageService } from "../services/ProductImageService.js";
import { HelperService } from "../services/HelperService.js";
import { UIService } from "../services/UIService.js";

export class ProductDetailModalComponent {
    
  static async open(product) {
    const modal = document.getElementById("product-detail-modal");
    const modalContent = document.getElementById("modal-content");

    try {
      const images = await ProductImageService.getAvailableProductImages(
        product.id
      );

      const carouselItems = images
        .map(
          (imageUrl) => `
                <div class="carousel-item">
                    <img src="${imageUrl}" alt="${product.name}" onerror="this.onerror=null; this.src='imgs/placeholder.jpg';">
                </div>
            `
        )
        .join("");

      const html = `
                <div class="product-carousel">
                    <div class="carousel-container">
                        ${carouselItems}
                    </div>
                </div>
                <div class="product-detail-info">
                    <h2 class="product-detail-name">${product.name}</h2>
                    <p class="product-detail-brand">${product.brand} | ${
        product.gender
      } | ${product.volume}</p>
                    <p class="product-detail-price">${HelperService.formatPrice(
                      product.price
                    )}</p>
                    <p class="product-detail-description">${
                      product.description
                    }</p>
                    
                    <div class="notes-section">
                        <h4 class="notes-title">Notas aromáticas:</h4>
                        <div class="notes-list">
                            ${
                              product.notes && Array.isArray(product.notes)
                                ? product.notes
                                    .map(
                                      (note) =>
                                        `<span class="note-item">${note}</span>`
                                    )
                                    .join("")
                                : '<span class="note-item">Sin información de notas</span>'
                            }
                        </div>
                    </div>

                    ${
                      product.hasVideo && product.videoUrl?.trim()
                        ? `
                    <div class="product-video">
                        <h4 class="notes-title">Video del producto:</h4>
                        <video controls>
                            <source src="${product.videoUrl}" type="video/mp4">
                            Tu navegador no soporta la reproducción de videos.
                        </video>
                    </div>
                    `
                        : ""
                    }
                </div>
            `;

            modalContent.innerHTML = html;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            await ProductImageService.waitForImagesToLoad('.carousel-container');
            UIService.initCarousel();
    } catch (error) {
      console.error("Error loading product images:", error);
      modalContent.innerHTML = `
                <div class="product-carousel">
                    <div class="carousel-container">
                        <div class="carousel-item">
                            <img src="imgs/placeholder.jpg" alt="Imagen no disponible">
                        </div>
                    </div>
                </div>
            `;
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  }
}
