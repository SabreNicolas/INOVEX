export interface depassement {
  id: number;
  choixDepassements: string;
  choixDepassementsProduits: string;
  ligne: string;
  date_heure_debut: string;
  date_heure_fin: string;
  causes: string;
  concentration: string;
  idUsine: number | undefined;
}

export interface choixDepassement {
  id: number;
  nom: string;
}

export interface choixDepassementProduit {
  id: number;
  nom: string;
}

export interface depassementProduit {
  id: number;
  idChoixDepassements: number;
  idChoixDepassementsProduits: number;
}
export interface nbLignesUsine {
  data: { nbLigne: number }[];
}
