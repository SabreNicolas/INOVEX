export interface element{
    Id : number;
    zoneId : number;
    nom : string;
    valeurMin : number;
    valeurMax : number;
    typeChamp : number;
    unit : string;
    defaultValue : number;
    isRegulateur : number;
    listValues : string;
    isCompteur : number;
    ordre : number;
    groupement : string;
    idGroupement : number;
    CodeEquipement : string;
    infoSup : string;
    valeur?: string;
}