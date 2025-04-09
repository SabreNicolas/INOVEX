export interface RepriseRonde {
    Id: number;
    date: Date | string;
    quart: number;
    termine: boolean;
}

export interface NameValuePair {
  value: string;
  modeRegulateur: string; // "activé" ou "désactivé"
  elementId: number;
  rondeId: number; // Ajout de rondeId
}

export interface ResultatsFormulaires {
  values: { nameValuePairs: NameValuePair }[];
}