import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { product } from "../../models/products.model";
import { idUsineService } from "./idUsine.service";
import { environment } from "src/environments/environment";

@Injectable()
export class productsService {
  private _nom: string;
  private _code: string;
  private _unit: string;
  private _tag: string;

  httpClient: HttpClient;
  private headerDict = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  private ip = environment.apiUrl;
  //private ip = "localhost";
  private idUsine: number | undefined;

  constructor(
    private http: HttpClient,
    private idUsineService: idUsineService,
  ) {
    this.httpClient = http;
    this._nom = "";
    this._code = "";
    this._unit = "";
    this._tag = "";
    //@ts-ignore
    this.idUsine = this.idUsineService.getIdUsine();
  }

  //récupérer le dernier code
  getLastCode(Code: string, idUsine: number) {
    const requete =
      "https://" +
      this.ip +
      "/productLastCode?Code=" +
      Code +
      "&idUsine=" +
      idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  //création du produit
  createProduct(typeId: number, idUsine: number) {
    //ici on passe par une variable car on a un systeme de boucle qui rencode  chaque fois la variable
    const encodedNom = encodeURIComponent(this.nom);
    const requete =
      "https://" +
      this.ip +
      "/Product?Name=" +
      encodedNom +
      "&Code=" +
      this._code +
      "&typeId=" +
      typeId +
      "&Unit=" +
      this._unit +
      "&idUsine=" +
      idUsine +
      "&TAG=" +
      this._tag;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer les compteurs
  getCompteurs(Code: string, name: string) {
    const requete =
      "https://" +
      this.ip +
      "/Compteurs?Code=" +
      Code +
      "&name=" +
      name +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les qse
  getQse() {
    const requete = "https://" + this.ip + "/qse?idUsine=" + this.idUsine;
    // console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les compteurs pour les arrêts
  getCompteursArrets(Code: string) {
    const requete =
      "https://" +
      this.ip +
      "/CompteursArrets?Code=" +
      Code +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les valeurs de compteur
  getValueCompteurs(Date: string, Code: string) {
    const requete =
      "https://" +
      this.ip +
      "/Compteurs/" +
      Code +
      "/" +
      Date +
      "?idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  //insérer une valeur de compteur
  createMeasure(Date: string, Value: number, Code: string) {
    const requete =
      "https://" +
      this.ip +
      "/SaisieMensuelle?Date=" +
      Date +
      "&Value=" +
      Value +
      "&Code=" +
      Code +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer les analyses
  getAnalyses(Code: string) {
    const requete =
      "https://" +
      this.ip +
      "/Analyses?Code=" +
      Code +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les dépassements 1/2 heures
  getDep() {
    const requete = "https://" + this.ip + "/AnalysesDep/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les sortants
  getSortants(Code: string) {
    const requete =
      "https://" +
      this.ip +
      "/Sortants?Code=" +
      Code +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les livraison de réactifs
  getReactifs() {
    const requete = "https://" + this.ip + "/reactifs?idUsine=" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les sortants
  getSortantsAndCorrespondance(Code: string) {
    const requete =
      "https://" +
      this.ip +
      "/getSortantsAndCorrespondance?Code=" +
      Code +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les sortants
  getReactifsAndCorrespondance() {
    const requete =
      "https://" +
      this.ip +
      "/getReactifsAndCorrespondance?idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les consommables & autres
  getConsos() {
    const requete = "https://" + this.ip + "/Consos/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les produits pour le PCI
  getPCI() {
    const requete = "https://" + this.ip + "/pci/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les containers
  getProductEntrant() {
    const requete = "https://" + this.ip + "/productsEntrants/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les valeurs d'analyses, de sortants, de consommables
  getValueProducts(Date: string, Id: number) {
    const requete = "https://" + this.ip + "/ValuesProducts/" + Id + "/" + Date;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  //récupérer les produits par catégories => pour admin uniquement
  getAllProductsByType(typeId: number, name: string) {
    const requete =
      "https://" +
      this.ip +
      "/Products/" +
      typeId +
      "?Name=" +
      name +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer un produit
  getOneProduct(id: number) {
    const requete =
      "https://" +
      this.ip +
      "/getOneProduct/" +
      id +
      "?idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product>(requete, requestOptions);
  }

  //récupérer les produits d'une usine
  getAllProducts() {
    const requete =
      "https://" + this.ip + "/AllProducts?idUsine=" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //récupérer les produits par catégories => pour admin uniquement
  getAllProductsAndElementRondier(typeId: number, name: string) {
    const requete =
      "https://" +
      this.ip +
      "/ProductsAndElementRondier/" +
      typeId +
      "?Name=" +
      name +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //créer un formulaire
  createFormulaire(nom: string) {
    nom = encodeURIComponent(nom);
    const requete =
      "https://" +
      this.ip +
      "/createFormulaire?nom=" +
      nom +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le nom d'un formulaire
  updateFormulaire(nom: string, idFormulaire: number) {
    nom = encodeURIComponent(nom);
    const requete =
      "https://" +
      this.ip +
      "/updateFormulaire?nom=" +
      nom +
      "&idFormulaire=" +
      idFormulaire;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //créer les produits d'un formulaire
  createFormulaireAffectation(
    alias: string,
    idFormulaire: number,
    idProduit: number,
  ) {
    alias = encodeURIComponent(alias);
    const requete =
      "https://" +
      this.ip +
      "/createFormulaireAffectation?alias=" +
      alias +
      "&idFormulaire=" +
      idFormulaire +
      "&idProduit=" +
      idProduit;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer les formulaires d'une usine
  getFormulaires() {
    const requete =
      "https://" + this.ip + "/getFormulaires?idUsine=" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any[]>(requete, requestOptions);
  }

  //récupérer un formulaire d'une usine
  getOneFormulaire(idFormulaire: number) {
    const requete =
      "https://" + this.ip + "/getOneFormulaire?idFormulaire=" + idFormulaire;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any[]>(requete, requestOptions);
  }

  //Récupérer les produits d'un formulaire
  getProductsFormulaire(idFormulaire: number) {
    const requete =
      "https://" +
      this.ip +
      "/getProduitsFormulaire?idFormulaire=" +
      idFormulaire;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any[]>(requete, requestOptions);
  }

  //Supprimer les produits d'un formulaire
  deleteProductFormulaire(idFormulaire: number) {
    const requete =
      "https://" +
      this.ip +
      "/deleteProduitFormulaire?idFormulaire=" +
      idFormulaire;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  //Supprimer un formulaire
  deleteFormulaire(idFormulaire: number) {
    const requete =
      "https://" + this.ip + "/deleteFormulaire?idFormulaire=" + idFormulaire;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  //mettre à jour le enabled d'un produit
  setEnabled(Id: number, enabled: number) {
    const requete =
      "https://" + this.ip + "/productEnabled/" + Id + "/" + enabled;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour l'unité d'un produit
  setUnit(unit: string, Id: number) {
    const requete =
      "https://" + this.ip + "/productUnit/" + Id + "?Unit=" + unit;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le type d'un produit
  setType(type: number, Id: number) {
    const requete = "https://" + this.ip + "/productType/" + Id + "/" + type;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  updateTypeRecup(id: number, typeRecupEMonitoring: string) {
    const requete =
      "https://" +
      this.ip +
      "/updateRecupEMonitoring?id=" +
      id +
      "&typeRecup=" +
      typeRecupEMonitoring;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }
  /*
   ** Partie IMAGINDATA
   */

  //récupération produits sans TAG
  getProductsWithoutTAG() {
    const requete = "https://" + this.ip + "/ProductWithoutTag/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<product[]>(requete, requestOptions);
  }

  //mettre à jour le TAG ou le code GMAO d'un produit
  //?TAG=SJSJJS ou ?CodeEquipement=xxxx
  setElement(Code: string, productId: number, type: string) {
    const requete =
      "https://" +
      this.ip +
      "/product" +
      type +
      "/" +
      productId +
      "?" +
      type +
      "=" +
      Code;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //Mettre à jour le coefficient d'un produit
  updateCoeff(coeff: string, id: number) {
    const requete =
      "https://" + this.ip + "/productUpdateCoeff/" + id + "?coeff=" + coeff;
    // console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //Mettre à jour le coefficient d'un produit
  updateProductName(newName: string, lastName: string) {
    newName = encodeURIComponent(newName);
    lastName = encodeURIComponent(lastName);

    const requete =
      "https://" +
      this.ip +
      "/updateProductName?newName=" +
      newName +
      "&lastName=" +
      lastName;
    // console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }
  /*
   ** FIN Partie IMAGINDATA
   */

  //GETTER & SETTER
  get nom(): string {
    return this._nom;
  }

  set nom(value: string) {
    this._nom = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  get unit(): string {
    return this._unit;
  }

  set unit(value: string) {
    this._unit = value;
  }

  get tag(): string {
    return this._tag;
  }

  set tag(tag: string) {
    this._tag = tag;
  }
}
