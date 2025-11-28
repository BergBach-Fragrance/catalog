import { HelperService } from "./HelperService.js";

export class DecantService {
  static DECANT_MARGIN = 0;

  constructor(apiConfig) {
    this.apiConfig = apiConfig;
    this.cachedDecants = window.cachedDecants || null;
    this.cachedVersion = window.cachedDecantsVersion || null;
  }

  async fetchDecants() {
    try {
      const url = new URL(this.apiConfig.google.SheetsUrl);
      url.searchParams.set("t", Date.now());

      const sheetName = this.apiConfig.google.sheets?.decants;
      if (sheetName) {
        url.searchParams.set("sheet", sheetName);
      }

      const response = await fetch(url.toString());
      const data = await response.json();
      const decants = Array.isArray(data.decants)
        ? data.decants
        : Array.isArray(data.products)
        ? data.products
        : [];

      if (this.cachedDecants && this.cachedVersion === data.version) {
        return this.cachedDecants;
      }

      this.cachedDecants = decants.map((decant) => ({
        ...decant,
        price: Number(decant.price) + DecantService.DECANT_MARGIN,
        volume: decant.volume || decant.ml || "",
        notes: HelperService.SanitizeNotes(decant.notes),
      }));

      this.cachedVersion = data.version;
      window.cachedDecants = this.cachedDecants;
      window.cachedDecantsVersion = this.cachedVersion;

      return this.cachedDecants;
    } catch (error) {
      console.error("Error al obtener decants desde Google Sheets:", error);
      return [];
    }
  }
}
