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

export interface element {
  Id: number;
  zoneId: number;
  nom: string;
  valeurMin: number;
  valeurMax: number;
  typeChamp: string;
  defaultValue: string;
  previousValue: string;
  listValues: string;
  isCompteur: boolean;
  isRegulateur: boolean;
  unit: string;
  infoSup: string;
  groupement: string | null;
  CodeEquipement: string;
}
export interface Zone {
  id: number;
  zoneId: number;
  commentaire: string;
  elements: element[];
  four: number;
  modeOP: [];
  nomRondier: string;
  prenomRondier: string;
  termine: boolean;
  zone: string;
}
