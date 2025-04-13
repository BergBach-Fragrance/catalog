import { ProductImageService } from '../services/ProductImageService.js';
import { HelperService } from '../services/HelperService.js';

export class ProductCardComponent {

    static async render(product) {
        const imageUrl = await ProductImageService.getMainProductImage(product.id);
        const formattedPrice = HelperService.formatPrice(product.price);

        return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}" onerror="this.src='imgs/placeholder.jpg';">
                <div class="product-badge">${product.gender}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-brand">${product.brand} | ${product.volume}</p>
                <div class="product-notes">
                    ${product.notes.slice(0, 3).map(note => `<span class="note">${note}</span>`).join('')}
                    ${product.notes.length > 3 ? `<span class="note">+${product.notes.length - 3}</span>` : ''}
                </div>
                <div class="product-bottom">
                    <p class="product-price">${formattedPrice}</p>
                    <button class="view-details" onclick="openProductDetail('${product.id}')">Ver detalles</button>
                </div>
            </div>
        </div>
        `;
    }
}
