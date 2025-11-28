export class HelperService {
  static SanitizeFilters(filters) {
    const sanitizedFilters = {};

    if (filters.searchTerm) {
      sanitizedFilters.searchTerm = filters.searchTerm.trim().toLowerCase();
    }

    if (filters.brand) {
      sanitizedFilters.brand = filters.brand.trim();
    }

    if (filters.gender) {
      // Normalizar género
      const normalizedGender = filters.gender.toLowerCase();
      sanitizedFilters.gender =
        normalizedGender === "male"
          ? "Hombre"
          : normalizedGender === "female"
          ? "Mujer"
          : filters.gender;
    }

    sanitizedFilters.sortBy = filters.sortBy
      ? filters.sortBy.trim()
      : "relevance";

    return sanitizedFilters;
  }

  // Función para formatear precio en ARS
  static formatPrice(price) {
    const adjustedPrice = price;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(adjustedPrice);
  }

  static SanitizeNotes(notes) {
    if (!notes) return [];

    if (Array.isArray(notes)) {
      return notes.filter(Boolean);
    }

    if (typeof notes === "string") {
      return notes
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean);
    }

    return [];
  }
}
