import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { dechetsCollecteurs } from "src/models/dechetsCollecteurs.model";
import { valueHodja } from "src/models/valueHodja.model";
import { moralEntity } from "../../models/moralEntity.model";
import { idUsineService } from "./idUsine.service";
import { environment } from "src/environments/environment";

@Injectable()
export class moralEntitiesService {
  private _nom: string;
  private _adress: string;
  private _code: string;
  private _unitPrice: number;
  private _numCAP: string;
  private _codeDechet: string;
  private _nomClient: string;
  private _prenomClient: string;
  private _mailClient: string;
  private _MR: moralEntity | undefined;

  httpClient: HttpClient;
  private headerDict = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  private portAPIHodja = 3101;
  private ip = environment.apiUrl;
  //private ip = "localhost";
  private idUsine: number | undefined;

  constructor(
    private http: HttpClient,
    private idUsineService: idUsineService,
  ) {
    this.httpClient = http;
    this._nom = "";
    this._adress = "";
    this._code = "";
    this._unitPrice = 0.0;
    this._numCAP = "";
    this._codeDechet = "";
    this._nomClient = "";
    this._prenomClient = "";
    this._mailClient = "";
    this.idUsine = this.idUsineService.getIdUsine();
  }

  //création de client
  createMoralEntity() {
    const requete =
      "https://" +
      this.ip +
      "/moralEntitie?Name=" +
      this._nom +
      "&Address=" +
      this._adress +
      "&Code=" +
      this._code +
      "&UnitPrice=" +
      this._unitPrice +
      "&numCAP=" +
      this.numCAP +
      "&codeDechet=" +
      this.codeDechet +
      "&nomClient=" +
      this.nomClient +
      "&prenomClient=" +
      this.prenomClient +
      "&mailClient=" +
      this.mailClient +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer le dernier code
  getLastCode(Code: string) {
    const requete =
      "https://" +
      this.ip +
      "/moralEntitieLastCode?Code=" +
      Code +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  //récupérer les clients avec Enabled à 1 (pour la saisie)
  getMoralEntities(Code: string) {
    const requete =
      "https://" +
      this.ip +
      "/moralEntities?Code=" +
      Code +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<moralEntity[]>(requete, requestOptions);
  }

  //récupérer les clients avec Enabled à 1 (pour la saisie)
  getMoralEntitiesAndCorrespondance(debCode: string) {
    const requete =
      "https://" +
      this.ip +
      "/getMoralEntitiesAndCorrespondance?idUsine=" +
      this.idUsine +
      "&Code=" +
      debCode;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<moralEntity[]>(requete, requestOptions);
  }

  //crée une nouvelle correspondance pour lecture csv
  createImport_tonnage(
    ProducerId: number,
    ProductId: number,
    nomImport: string,
    productImport: string,
  ) {
    nomImport = encodeURIComponent(nomImport);
    productImport = encodeURIComponent(productImport);
    const requete =
      "https://" +
      this.ip +
      "/import_tonnage?ProducerId=" +
      ProducerId +
      "&ProductId=" +
      ProductId +
      "&nomImport=" +
      nomImport +
      "&productImport=" +
      productImport +
      "&idUsine=" +
      this.idUsine;
    // console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //crée une nouvelle correspondance pour lecture csv
  createImport_tonnageSortant(ProductId: number, productImport: string) {
    productImport = encodeURIComponent(productImport);
    const requete =
      "https://" +
      this.ip +
      "/import_tonnageSortant?ProductId=" +
      ProductId +
      "&productImport=" +
      productImport +
      "&idUsine=" +
      this.idUsine;
    // console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //crée une nouvelle correspondance pour lecture csv
  createImport_tonnageReactif(ProductId: number, productImport: string) {
    productImport = encodeURIComponent(productImport);
    const requete =
      "https://" +
      this.ip +
      "/import_tonnageReactif?ProductId=" +
      ProductId +
      "&productImport=" +
      productImport +
      "&idUsine=" +
      this.idUsine;
    // console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //delete correspondance
  deleteCorrespondance(id: number) {
    const requete = "https://" + this.ip + "/deleteCorrespondance/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  //delete correspondance
  deleteMesuresEntrantsEntreDeuxDates(dateDeb: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      "/deleteMesuresEntrantsEntreDeuxDates?idUsine=" +
      this.idUsine +
      "&dateDeb=" +
      dateDeb +
      "&dateFin=" +
      dateFin;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  //delete correspondance
  deleteMesuresSortantsEntreDeuxDates(
    dateDeb: string,
    dateFin: string,
    name: string,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/deleteMesuresSortantsEntreDeuxDates?idUsine=" +
      this.idUsine +
      "&dateDeb=" +
      dateDeb +
      "&dateFin=" +
      dateFin +
      "&name=" +
      name;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  //delete mesure ractifs entre deux dates
  deleteMesuresReactifsEntreDeuxDates(
    dateDeb: string,
    dateFin: string,
    name: string,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/deleteMesuresReactifsEntreDeuxDates?idUsine=" +
      this.idUsine +
      "&dateDeb=" +
      dateDeb +
      "&dateFin=" +
      dateFin +
      "&name=" +
      name;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  //delete correspondance
  deleteCorrespondanceReactif(id: number) {
    const requete = "https://" + this.ip + "/deleteCorrespondanceReactif/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }
  //mettre à jour une correspondance
  updateCorrespondance(
    ProducerId: number,
    nomImport: string,
    productImport: string,
  ) {
    nomImport = encodeURIComponent(nomImport);
    productImport = encodeURIComponent(productImport);
    const requete =
      "https://" +
      this.ip +
      "/updateCorrespondance?ProducerId=" +
      ProducerId +
      "&nomImport=" +
      nomImport +
      "&productImport=" +
      productImport;
    // console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le nom dans le logiciel de pesée d'une correspondance de sortant
  updateNomImportCorrespondanceSortant(
    ProductId: number,
    productImport: string,
  ) {
    productImport = encodeURIComponent(productImport);
    const requete =
      "https://" +
      this.ip +
      "/updateNomImportCorrespondanceSortant?ProductId=" +
      ProductId +
      "&productImport=" +
      productImport;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le produit cap exploitation d'une correspondance de sortant
  updateProductImportCorrespondanceSortant(
    idCorrespondance: number,
    ProductId: number,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/updateProductImportCorrespondanceSortant?ProductId=" +
      ProductId +
      "&idCorrespondance=" +
      idCorrespondance;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le produit cap exploitation d'une correspondance de réactif
  updateProductImportCorrespondanceReactif(
    idCorrespondance: number,
    ProductId: number,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/updateProductImportCorrespondanceReactif?ProductId=" +
      ProductId +
      "&idCorrespondance=" +
      idCorrespondance;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le nom dans le logiciel de pesée d'une correspondance de reactif
  updateNomImportCorrespondanceReactif(
    ProductId: number,
    productImport: string,
  ) {
    productImport = encodeURIComponent(productImport);
    const requete =
      "https://" +
      this.ip +
      "/updateNomImportCorrespondanceReactif?ProductId=" +
      ProductId +
      "&productImport=" +
      productImport;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer les clients
  getMoralEntitiesAll(Code: string) {
    const requete =
      "https://" +
      this.ip +
      "/moralEntitiesAll?Code=" +
      Code +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
    return this.http.get<moralEntity[]>(requete, requestOptions);
  }

  //récupérer 1 client
  getOneMoralEntity(Id: number) {
    const requete = "https://" + this.ip + "/moralEntitie/" + Id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<moralEntity>(requete, requestOptions);
  }

  //récupérer 1 correspondance
  getOneCorrespondance(Id: number) {
    const requete = "https://" + this.ip + "/correspondance/" + Id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<moralEntity>(requete, requestOptions);
  }

  //récupérer les correspondances d'une usine
  getCorrespondance() {
    const requete = "https://" + this.ip + "/getCorrespondance/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<moralEntity>(requete, requestOptions);
  }

  //récupérer les correspondances d'une usine
  getCorrespondanceSortants() {
    const requete =
      "https://" + this.ip + "/getCorrespondanceSortants/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<moralEntity>(requete, requestOptions);
  }

  //récupérer les correspondances d'une usine
  getCorrespondancesReactifs() {
    const requete =
      "https://" + this.ip + "/getCorrespondanceReactifs/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<moralEntity>(requete, requestOptions);
  }

  //mettre à jour le code d'un client
  setCode(Code: string | null, Id: number) {
    const requete =
      "https://" + this.ip + "/moralEntitieCode/" + Id + "?Code=" + Code;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le prix d'un client
  setPrix(prix: string, Id: number) {
    const requete =
      "https://" +
      this.ip +
      "/moralEntitieUnitPrice/" +
      Id +
      "?UnitPrice=" +
      prix;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le num de CAP d'un client
  setCAP(cap: string, Id: number) {
    const requete =
      "https://" + this.ip + "/moralEntitieCAP/" + Id + "?cap=" + cap;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le nom d'un client
  setName(name: string, Id: number) {
    const requete =
      "https://" + this.ip + "/moralEntitieName/" + Id + "?Name=" + name;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //mettre à jour le enabled d'un client
  setEnabled(Id: number, Enabled: number) {
    const requete =
      "https://" + this.ip + "/moralEntitieEnabled/" + Id + "/" + Enabled;
    //console.log(requete);
    // console.log(this.headerDict);
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
    return this.http.put<any>(requete, null, requestOptions);
  }

  //update de client
  updateMoralEntity(Id: number) {
    const requete =
      "https://" +
      this.ip +
      "/moralEntitieAll/" +
      Id +
      "?Name=" +
      this._nom +
      "&Address=" +
      this._adress +
      "&Code=" +
      this._code +
      "&UnitPrice=" +
      this._unitPrice +
      "&numCAP=" +
      this.numCAP +
      "&codeDechet=" +
      this.codeDechet +
      "&nomClient=" +
      this.nomClient +
      "&prenomClient=" +
      this.prenomClient +
      "&mailClient=" +
      this.mailClient;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //insérer une mesure
  createMeasure(
    EntryDate: string,
    Value: number,
    ProductId: number,
    ProducerId: number,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/Measure?EntryDate=" +
      EntryDate +
      "&Value=" +
      Value +
      "&ProductId=" +
      ProductId +
      "&ProducerId=" +
      ProducerId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupérer les tonnages ou valeurs qse
  getEntry(EntryDate: string, ProductId: number, ProducerId: number) {
    const requete =
      "https://" +
      this.ip +
      "/Entrant/" +
      ProductId +
      "/" +
      ProducerId +
      "/" +
      EntryDate;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  //récupérer la somme des tonnages
  getTotal(EntryDate: string, dechet: string) {
    const requete =
      "https://" +
      this.ip +
      "/TotalMeasures/" +
      dechet +
      "/" +
      EntryDate +
      "/" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  //** PARTIE Products mais est directement lié aux MR donc se trouve ici */
  //récupérer les types de déchets et collecteurs
  GetTypeDéchets() {
    const requete =
      "https://" + this.ip + "/DechetsCollecteurs/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<dechetsCollecteurs[]>(requete, requestOptions);
  }

  //Récupération type d'import des pesées
  GetImportTonnage() {
    const requete = "https://" + this.ip + "/typeImport/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<string>(requete, requestOptions);
  }

  /*
   ** Partie HODJA
   */

  //récupération HODJA
  recupHodjaEntrants(dateDeb: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      ":" +
      this.portAPIHodja +
      "/entrantsOuSortants?dateDeb=" +
      dateDeb +
      "&dateFin=" +
      dateFin +
      "&sortant=0";
    // console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<valueHodja[]>(requete, requestOptions);
  }

  //récupération HODJA
  recupHodjaSortants(dateDeb: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      ":" +
      this.portAPIHodja +
      "/entrantsOuSortants?dateDeb=" +
      dateDeb +
      "&dateFin=" +
      dateFin +
      "&sortant=1";
    // console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<valueHodja[]>(requete, requestOptions);
  }

  /*
   ** FIN Partie HODJA
   */

  //insérer une mesure
  registreDNDTS(data: any) {
    const requete = "https://" + this.ip + "/registreDNDTS";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, { data }, requestOptions);
  }

  //Répérer les mesures du registre pour les sortants
  getRegistreDNDTSEntrants(dateDeb: any, dateFin: any) {
    dateDeb = encodeURIComponent(dateDeb);
    dateFin = encodeURIComponent(dateFin);
    const requete =
      "https://" +
      this.ip +
      "/getRegistreDNDTSEntrants?idUsine=" +
      this.idUsine +
      "&dateDeb=" +
      dateDeb +
      "&dateFin=" +
      dateFin;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  //Répérer les mesures du registre pour les sortants
  getRegistreDNDTSSortants(dateDeb: any, dateFin: any) {
    dateDeb = encodeURIComponent(dateDeb);
    dateFin = encodeURIComponent(dateFin);
    const requete =
      "https://" +
      this.ip +
      "/getRegistreDNDTSSortants?idUsine=" +
      this.idUsine +
      "&dateDeb=" +
      dateDeb +
      "&dateFin=" +
      dateFin;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  //GETTER & SETTER
  get nom(): string {
    return this._nom;
  }

  set nom(value: string) {
    this._nom = value;
  }

  get adress(): string {
    return this._adress;
  }

  set adress(value: string) {
    this._adress = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  set unitPrice(value: number) {
    this._unitPrice = value;
  }

  get numCAP(): string {
    return this._numCAP;
  }

  set numCAP(value: string) {
    this._numCAP = value;
  }

  get codeDechet(): string {
    return this._codeDechet;
  }

  set codeDechet(value: string) {
    this._codeDechet = value;
  }

  get nomClient(): string {
    return this._nomClient;
  }

  set nomClient(value: string) {
    this._nomClient = value;
  }

  get prenomClient(): string {
    return this._prenomClient;
  }

  set prenomClient(value: string) {
    this._prenomClient = value;
  }

  get mailClient(): string {
    return this._mailClient;
  }

  set mailClient(value: string) {
    this._mailClient = value;
  }

  get MR(): moralEntity {
    return this._MR as moralEntity;
  }

  set MR(value: moralEntity) {
    this._MR = value;
  }
}
