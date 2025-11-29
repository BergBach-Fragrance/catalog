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
      const sheetName = this.apiConfig.google.sheets?.decants;
      const data = await this.fetchSheetData(sheetName);
      const decants = this.pickCollection(data, sheetName);

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

  pickCollection(data, sheetName) {
    if (!data || typeof data !== "object") return [];

    const candidateKeys = ["decants", "products", sheetName, "items"].filter(
      Boolean
    );

    for (const key of candidateKeys) {
      if (Array.isArray(data[key])) return data[key];
    }

    return [];
  }

  async fetchSheetData(sheetName) {
    const baseUrl = new URL(this.apiConfig.google.SheetsUrl);
    baseUrl.searchParams.set("t", Date.now());

    const attempts = [
      { param: "sheet", value: sheetName },
      { param: "sheetName", value: sheetName },
      { param: null, value: null },
    ];

    for (const attempt of attempts) {
      try {
        const url = new URL(baseUrl);
        if (attempt.param && attempt.value) {
          url.searchParams.set(attempt.param, attempt.value);
        }

        const response = await fetch(url.toString());
        if (!response.ok) continue;

        const data = await response.json();
        const collection = this.pickCollection(data, sheetName);

        if (collection.length > 0) {
          return data;
        }
      } catch (error) {
        console.error("Error al obtener datos de Google Sheets:", error);
      }
    }

    return {};
  }
}
