import { HelperService } from "../services/HelperService.js";
import { ProductImageService } from "../services/ProductImageService.js";

export class DecantTableComponent {
  static async render(decants) {
    if (!decants || decants.length === 0) {
      return `
        <div class="decants-empty">No se encontraron decants disponibles en este momento.</div>
      `;
    }

    const rows = await Promise.all(
      decants.map(async (decant) => {
        const formattedPrice = HelperService.formatPrice(decant.price);
        const formattedVolume = decant.volume ? `${decant.volume} ml` : "-";
        const notes = Array.isArray(decant.notes) ? decant.notes : [];

        // 🔹 Obtener imagen principal usando el mismo servicio que productos
        const imageUrl = await ProductImageService.getMainProductImage(
          decant.id
        );

        return `
          <tbody class="decant-row" data-id="${decant.id}">
            <tr class="decant-row-summary">
              <td class="decant-cell code">${decant.id || "-"}</td>
              <td class="decant-cell name">${decant.name}</td>
              <td class="decant-cell volume">${formattedVolume}</td>
              <td class="decant-cell price">${formattedPrice}</td>
              <td class="decant-cell toggle"><i class="fas fa-chevron-down"></i></td>
            </tr>
            <tr class="decant-row-detail">
              <td colspan="5">
                <div class="decant-detail-content">
                  <div class="decant-detail-image">
                    <img 
                      src="${imageUrl}" 
                      alt="${decant.name}" 
                      onerror="this.src='imgs/placeholder.jpg';" 
                    />
                  </div>
                  <div class="decant-detail-info">
                    <h4>${decant.name}</h4>
                    <p class="decant-description">
                      ${decant.description || "Sin descripción"}
                    </p>
                    <div class="decant-notes">
                      <span class="decant-notes-title">Notas:</span>
                      <div class="decant-notes-list">
                        ${
                          notes.length > 0
                            ? notes
                                .map(
                                  (note) =>
                                    `<span class="decant-note">${note}</span>`
                                )
                                .join("")
                            : '<span class="decant-note">Sin información</span>'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        `;
      })
    );

    return `
      <table class="decants-table">
        <thead>
          <tr>
            <th class="code">Código</th>
            <th class="name">Perfume</th>
            <th class="volume">Volumen</th>
            <th class="price">Precio</th>
            <th class="toggle"></th>
          </tr>
        </thead>
        ${rows.join("")}
      </table>
    `;
  }

  static initRowToggle() {
    const rows = document.querySelectorAll(".decant-row");
    rows.forEach((row) => {
      const summaryRow = row.querySelector(".decant-row-summary");
      const detailRow = row.querySelector(".decant-row-detail");
      const icon = row.querySelector(".decant-row-summary .toggle i");

      summaryRow?.addEventListener("click", () => {
        const isExpanded = detailRow.classList.contains("expanded");
        document
          .querySelectorAll(".decant-row-detail.expanded")
          .forEach((detail) => detail.classList.remove("expanded"));
        document
          .querySelectorAll(".decant-row-summary.active")
          .forEach((summary) => summary.classList.remove("active"));
        document
          .querySelectorAll(".decant-row-summary .toggle i")
          .forEach((toggle) => toggle.classList.remove("rotated"));

        if (!isExpanded) {
          detailRow.classList.add("expanded");
          summaryRow.classList.add("active");
          icon?.classList.add("rotated");
        }
      });
    });
  }
}
