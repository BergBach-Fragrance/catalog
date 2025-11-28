export class DecantService {
  static DECANT_MARGIN = 0;

  constructor(apiConfig) {
    this.apiConfig = apiConfig;
    this.cachedDecants = window.cachedDecants || null;
    this.cachedVersion = window.cachedDecantsVersion || null;
  }

  async fetchDecants() {
    try {
      const response = await fetch(
        `${this.apiConfig.google.SheetsUrl}?t=${Date.now()}`
      );
      const data = await response.json();
      const decants = Array.isArray(data.decants) ? data.decants : [];

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