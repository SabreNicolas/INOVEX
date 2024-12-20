import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { zone } from "../../models/zone.model";
import { badge } from "../../models/badge.model";
import { badgeAffect } from "../../models/badgeAffect.model";
import { user } from "../../models/user.model";
import { element } from "../../models/element.model";
import { permisFeu } from "../../models/permisFeu.model";
import { modeOP } from "../../models/modeOP.models";
import { ronde } from "../../models/ronde.models";
import { mesureRonde } from "../../models/mesureRonde.model";
import { consigne } from "../../models/consigne.model";
import { anomalie } from "../../models/anomalie.model";
import { elementsOfZone } from "../../models/elementsOfZone.model";
import { permisFeuValidation } from "../../models/permisfeu-validation.model";
import { idUsineService } from "./idUsine.service";
import { environment } from "src/environments/environment";

@Injectable()
export class rondierService {
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
  private idUser: number;

  constructor(
    private http: HttpClient,
    private idUsineService: idUsineService,
  ) {
    this.httpClient = http;
    this.idUsine = this.idUsineService.getIdUsine();
    this.idUser = this.idUsineService.getIdUser();
  }

  /*
    BADGE
    */

  //création du badge
  createBadge(uid: string) {
    const requete =
      "https://" + this.ip + "/Badge?uid=" + uid + "&idUsine=" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //récupération du dernier Id inséré
  lastIdBadge() {
    const requete = "https://" + this.ip + "/BadgeLastId";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<number>(requete, requestOptions);
  }

  //liste des badges non affectés
  listBadgeNonAffect() {
    const requete = "https://" + this.ip + "/BadgesLibre/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<badge[]>(requete, requestOptions);
  }

  //liste des badges affectés à une zone
  listBadgeZone() {
    const requete = "https://" + this.ip + "/BadgesZone/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<badgeAffect[]>(requete, requestOptions);
  }

  //liste des badges affectés à un user
  listBadgeUser() {
    const requete = "https://" + this.ip + "/BadgesUser/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<badgeAffect[]>(requete, requestOptions);
  }

  //Mis à jour de l'état d'activation du badge
  updateEnabled(id: number, enabled: number) {
    const requete =
      "https://" + this.ip + "/BadgeEnabled/" + id + "/" + enabled;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //Update affectation
  updateAffect(id: number, idAffect: number, typeAffect: string) {
    const requete =
      "https://" +
      this.ip +
      "/BadgeAffectation/" +
      id +
      "/" +
      typeAffect +
      "/" +
      idAffect;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //Update affectation => rendre le badge libre
  updateAffectLibre(id: number) {
    const requete = "https://" + this.ip + "/BadgeDeleteAffectation/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  deleteBadge(id: number) {
    const requete = "https://" + this.ip + "/deleteBadge/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }
  /*
    FIN BADGE
     */

  /*
    ZONE DE CONTROLE
     */

  //création de la zone de controle
  createZone(nom: string, commentaire: string, four: number) {
    nom = encodeURIComponent(nom);
    const requete =
      "https://" +
      this.ip +
      "/zone?nom=" +
      nom +
      "&commentaire=" +
      commentaire +
      "&four=" +
      four +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //liste des zones de controle
  listZone() {
    const requete = "https://" + this.ip + "/zones/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<zone[]>(requete, requestOptions);
  }

  //liste des zones de controle
  listZoneAndAnomalieOfDay(date: string | undefined, quart: number) {
    if (date != undefined) date = encodeURIComponent(date);
    const requete =
      "https://" +
      this.ip +
      "/getZonesAndAnomaliesOfDay/" +
      this.idUsine +
      "/" +
      date +
      "?quart=" +
      quart;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<zone[]>(requete, requestOptions);
  }

  //liste des zones de controle
  listZonesRonde(rondeId: number) {
    const requete = "https://" + this.ip + "/zoneRonde/" + rondeId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<zone[]>(requete, requestOptions);
  }

  //liste des zones de controle libres
  listZoneLibre() {
    const requete = "https://" + this.ip + "/ZonesLibre/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<zone[]>(requete, requestOptions);
  }

  //Mise à jour du commentaire d'une zone de contrôle
  updateCommentaire(zoneId: number, commentaire: string) {
    const requete =
      "https://" + this.ip + "/zoneCommentaire/" + zoneId + "/" + commentaire;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //Mise à jour du nom d'une zone de contrôle
  updateNomZone(zoneId: number, nom: string) {
    nom = encodeURIComponent(nom);
    const requete = "https://" + this.ip + "/zoneNom/" + zoneId + "?nom=" + nom;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //Mise à jour du num d'un four
  updateNumZone(zoneId: number, four: number) {
    const requete =
      "https://" + this.ip + "/zoneFour/" + zoneId + "?four=" + four;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  deleteZone(id: number) {
    const requete = "https://" + this.ip + "/deleteZone?Id=" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }
  /*
    FIN ZONE DE CONTROLE
     */

  //Création d'un groupement
  createGroupement(zoneId: number, groupement: string) {
    groupement = encodeURIComponent(groupement);
    const requete =
      "https://" +
      this.ip +
      "/groupement?zoneId=" +
      zoneId +
      "&groupement=" +
      groupement;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //Récupérer tout les groupements d'une usine
  getGroupementsOfOneDay(date: string | undefined, quart: number) {
    if (date != undefined) {
      date = encodeURIComponent(date);
    }
    const requete =
      "https://" +
      this.ip +
      "/getGroupementsOfOneDay/" +
      this.idUsine +
      "/" +
      date +
      "?quart=" +
      quart;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<elementsOfZone[]>(requete, requestOptions);
  }

  getAllGroupements() {
    const requete =
      "https://" + this.ip + "/getAllGroupements?idUsine=" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<elementsOfZone[]>(requete, requestOptions);
  }

  //Récupérer un groupement
  getOneGroupement(idGroupement: number) {
    const requete =
      "https://" + this.ip + "/getOneGroupement?idGroupement=" + idGroupement;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<element>(requete, requestOptions);
  }

  //Récupérer un groupement
  getElementsGroupement(idGroupement: number) {
    const requete =
      "https://" +
      this.ip +
      "/getElementsGroupement?idGroupement=" +
      idGroupement;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  //Modifier un groupement
  updateGroupement(idGroupement: number, groupement: string, zoneId: number) {
    groupement = encodeURIComponent(groupement);
    const requete =
      "https://" +
      this.ip +
      "/updateGroupement?idGroupement=" +
      idGroupement +
      "&groupement=" +
      groupement +
      "&zoneId=" +
      zoneId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  deleteGroupement(idGroupement: number) {
    const requete =
      "https://" + this.ip + "/deleteGroupement?idGroupement=" + idGroupement;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  /*
    ELEMENT DE CONTROLE
     */

  //création de l'élément de controle
  //?zoneId=1&nom=ddd&valeurMin=1.4&valeurMax=2.5&typeChamp=1&isFour=0&isGlobal=1&unit=tonnes&defaultValue=1.7&isRegulateur=0&listValues=1;2;3&isCompteur=1&ordre=5&infoSup=zhhz
  createElement(
    zoneId: number,
    nom: string,
    valeurMin: number,
    valeurMax: number,
    typeChamp: number,
    unit: string,
    defaultValue: number,
    isRegulateur: number,
    listValues: string,
    isCompteur: number,
    ordre: number,
    idGroupement: number,
    codeEquipement: string,
    infoSupValue: string,
  ) {
    nom = encodeURIComponent(nom);
    infoSupValue = encodeURIComponent(infoSupValue);
    const requete =
      "https://" +
      this.ip +
      "/element?zoneId=" +
      zoneId +
      "&nom=" +
      nom +
      "&valeurMin=" +
      valeurMin +
      "&valeurMax=" +
      valeurMax +
      "&typeChamp=" +
      typeChamp +
      "&unit=" +
      unit +
      "&defaultValue=" +
      defaultValue +
      "&isRegulateur=" +
      isRegulateur +
      "&listValues=" +
      listValues +
      "&isCompteur=" +
      isCompteur +
      "&ordre=" +
      ordre +
      "&idGroupement=" +
      idGroupement +
      "&codeEquipement=" +
      codeEquipement +
      "&infoSup=" +
      infoSupValue;
    console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //update de l'élément de controle ayant comme id
  //?zoneId=1&nom=ddd&valeurMin=1.4&valeurMax=2.5&typeChamp=1&isFour=0&isGlobal=1&unit=tonnes&defaultValue=1.7&isRegulateur=0&listValues=1;2;3&isCompteur=1&ordre=5&infoSup=zhhz
  updateElement(
    Id: number,
    zoneId: number,
    nom: string,
    valeurMin: number,
    valeurMax: number,
    typeChamp: number,
    unit: string,
    defaultValue: number,
    isRegulateur: number,
    listValues: string,
    isCompteur: number,
    ordre: number,
    idGroupement: number,
    codeEquipement: string,
    infoSupValue: string,
  ) {
    nom = encodeURIComponent(nom);
    infoSupValue = encodeURIComponent(infoSupValue);
    const requete =
      "https://" +
      this.ip +
      "/updateElement/" +
      Id +
      "?zoneId=" +
      zoneId +
      "&nom=" +
      nom +
      "&valeurMin=" +
      valeurMin +
      "&valeurMax=" +
      valeurMax +
      "&typeChamp=" +
      typeChamp +
      "&unit=" +
      unit +
      "&defaultValue=" +
      defaultValue +
      "&isRegulateur=" +
      isRegulateur +
      "&listValues=" +
      listValues +
      "&isCompteur=" +
      isCompteur +
      "&ordre=" +
      ordre +
      "&idGroupement=" +
      idGroupement +
      "&codeEquipement=" +
      codeEquipement +
      "&infoSup=" +
      infoSupValue;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  getElementsOfUsine() {
    const requete =
      "https://" + this.ip + "/elementsControleOfUsine/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<element>(requete, requestOptions);
  }

  getElementsAndValuesOfDay(date: string | undefined, quart: number) {
    if (date != undefined) date = encodeURIComponent(date);
    const requete =
      "https://" +
      this.ip +
      "/getElementsAndValuesOfDay/" +
      this.idUsine +
      "/" +
      date +
      "?quart=" +
      quart;
    console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<element>(requete, requestOptions);
  }

  getAnomaliesOfOneDay(date: string | undefined, quart: number) {
    if (date != undefined) date = encodeURIComponent(date);
    const requete =
      "https://" +
      this.ip +
      "/getAnomaliesOfOneDay/" +
      this.idUsine +
      "/" +
      date +
      "?quart=" +
      quart;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<element>(requete, requestOptions);
  }

  changeTypeRecupSetRondier(Id: number, elementRondier: number) {
    const requete =
      "https://" +
      this.ip +
      "/productElementRondier?id=" +
      Id +
      "&idElementRondier=" +
      elementRondier;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //update de l'ordre des éléments ayant un ordre suppérieur à x pour une zone
  //?zoneId=1&ordre=2
  updateOrdreElement(zoneId: number, ordre: number) {
    const requete =
      "https://" +
      this.ip +
      "/updateOrdreElement/?zoneId=" +
      zoneId +
      "&maxOrdre=" +
      ordre;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //delete 1 élément de controle
  deleteElement(Id: number) {
    const requete = "https://" + this.ip + "/deleteElement?id=" + Id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  //Récupérer 1 élément
  getOneElement(Id: number) {
    const requete = "https://" + this.ip + "/element/" + Id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<element>(requete, requestOptions);
  }

  //liste des elements de controle d'une zone de controle
  listElementofZone(zoneId: number) {
    const requete = "https://" + this.ip + "/elementsOfZone/" + zoneId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<element[]>(requete, requestOptions);
  }
  //Récupérer les groupements d'une zone
  getGroupements(zoneId: number) {
    const requete = "https://" + this.ip + "/getGroupements?zoneId=" + zoneId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<element[]>(requete, requestOptions);
  }
  //liste des elements de controle de type compteur
  listElementCompteur() {
    const requete = "https://" + this.ip + "/elementsCompteur/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<element[]>(requete, requestOptions);
  }

  listZonesAndElements() {
    if (this.idUsine != 7) {
      const requete =
        "https://" + this.ip + "/BadgeAndElementsOfZone/" + this.idUsine;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http.get<elementsOfZone[]>(requete, requestOptions);
    } else {
      const requete = "https://" + this.ip + "/elementsOfUsine/" + this.idUsine;
      //console.log(requete);

      const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
      };

      return this.http.get<elementsOfZone[]>(requete, requestOptions);
    }
  }

  listZonesAndElementsWithValues(rondeId: number) {
    const requete =
      "https://" +
      this.ip +
      "/BadgeAndElementsOfZoneWithValues/" +
      this.idUsine +
      "/" +
      rondeId;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<elementsOfZone[]>(requete, requestOptions);
  }

  /*
    FIN ELEMENT DE CONTROLE
     */

  /*
    MESURE RONDIER
     */
  //Update value element de controle sur une ronde
  updateMesureRondier(id: number, value: string | null) {
    const requete =
      "https://" + this.ip + "/updateMesureRonde?id=" + id + "&value=" + value;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //Récupérer la valeur pour un élément de contrôle et une date (quart de nuit => dernier de la journée)
  //?id=111&date=dhdhdh
  valueElementDay(id: number, date: string) {
    const requete =
      "https://" + this.ip + "/valueElementDay?id=" + id + "&date=" + date;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<any>(requete, requestOptions);
  }

  /*
    FIN MESURE RONDIER
     */

  /*
    PERMIS DE FEU
     */

  //création du permis de feu
  //?dateHeureDeb=dggd&dateHeureFin=fff&badgeId=1?numero=ehgeheh
  createPermisFeu(
    dateHeureDeb: string | null,
    dateHeureFin: string | null,
    badgeId: number,
    zone: string,
    isPermisFeu: number,
    numero: string,
  ) {
    const requete =
      "https://" +
      this.ip +
      "/PermisFeu?dateHeureDeb=" +
      dateHeureDeb +
      "&dateHeureFin=" +
      dateHeureFin +
      "&badgeId=" +
      badgeId +
      "&zone=" +
      zone +
      "&isPermisFeu=" +
      isPermisFeu +
      "&numero=" +
      numero;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //liste des permis de feu en cours
  listPermisFeu() {
    const requete = "https://" + this.ip + "/PermisFeu/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<permisFeu[]>(requete, requestOptions);
  }

  //liste des validation de permis de feu
  //?dateHeure=xshhshx
  listPermisFeuValidation(dateHeure: string | undefined) {
    const requete =
      "https://" +
      this.ip +
      "/PermisFeuVerification?dateHeure=" +
      dateHeure +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<permisFeuValidation[]>(requete, requestOptions);
  }

  /*
    FIN PERMIS DE FEU
     */

  /*
    MODE OP
     */
  //création du mode OP
  //?nom=dggd&fichier=fff&zoneId=1
  createModeOP(nom: string, fichier: File | undefined, zoneId: number) {
    nom = encodeURIComponent(nom);
    //utilisation de formData pour conserver le format du fichier
    const formData = new FormData();
    // @ts-ignore
    formData.append("fichier", fichier, fichier.name);
    const requete =
      "https://" + this.ip + "/modeOP?nom=" + nom + "&zoneId=" + zoneId;
    //console.log(fichier);

    const headers = new HttpHeaders();
    // @ts-ignore
    headers.append("Content-Type", null);
    headers.append("Accept", "application/json");

    const requestOptions = {
      headers: headers,
    };

    return this.http.post<any>(requete, formData, requestOptions);
  }

  //liste des modeOP
  listModeOP() {
    const requete = "https://" + this.ip + "/modeOPs/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<modeOP[]>(requete, requestOptions);
  }

  //delete modeOP
  deleteModeOP(id: number, nom: string) {
    const requete = "https://" + this.ip + "/modeOP/" + id + "?nom=" + nom;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  /*
    FIN MODE OP
     */

  /*
    RONDE
     */

  //liste des rondes pour une date donnée
  listRonde(date: any, quart: number) {
    const requete =
      "https://" +
      this.ip +
      "/Rondes?date=" +
      date +
      "&idUsine=" +
      this.idUsine +
      "&quart=" +
      quart;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<ronde[]>(requete, requestOptions);
  }

  //Affichage d'une ronde pour une date et un quart donnée
  affichageRonde(date: string, quart: number) {
    const requete =
      "https://" +
      this.ip +
      "/RondesQuart?date=" +
      date +
      "&idUsine=" +
      this.idUsine +
      "&quart=" +
      quart;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<ronde[]>(requete, requestOptions);
  }

  //Reporting d'une ronde
  reportingRonde(idRonde: number) {
    const requete = "https://" + this.ip + "/reportingRonde/" + idRonde;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<mesureRonde[]>(requete, requestOptions);
  }

  //Cloture de la ronde
  closeRonde(id: number) {
    const requete =
      "https://" + this.ip + "/closeRondeEnCours?id=" + id + "&four1=1&four2=1";
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //delete ronde
  deleteRonde(id: number) {
    const requete = "https://" + this.ip + "/deleteRonde?id=" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }

  /*
    FIN RONDE
     */

  //liste des users sans badge
  listUserLibre() {
    const requete = "https://" + this.ip + "/UsersLibre/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<user[]>(requete, requestOptions);
  }

  /*
    CONSIGNES
     */
  //création d'une consigne
  //?commentaire=dggd&dateFin=fff&type=1
  createConsigne(
    titre: string,
    desc: string,
    type: number,
    dateFin: string | null,
    dateDebut: string | null,
    fileToUpload: File | null,
  ) {
    titre = encodeURIComponent(titre);
    desc = encodeURIComponent(desc);

    const requete =
      "https://" +
      this.ip +
      "/consigne?commentaire=" +
      desc +
      "&dateFin=" +
      dateFin +
      "&dateDebut=" +
      dateDebut +
      "&type=" +
      type +
      "&idUsine=" +
      this.idUsine +
      "&titre=" +
      titre;
    //console.log(requete);

    const headers = new HttpHeaders();
    // @ts-ignore
    headers.append("Content-Type", null);
    headers.append("Accept", "application/json");
    const requestOptions = {
      headers: headers,
    };

    if (fileToUpload != undefined) {
      const formData = new FormData();
      formData.append("fichier", fileToUpload, fileToUpload.name);

      return this.http.put<any>(requete, formData, requestOptions);
    } else {
      return this.http.put<any>(requete, null, requestOptions);
    }
  }

  //liste des consignes en cours de validité à l'instant T
  listConsignes() {
    const requete = "https://" + this.ip + "/consignes/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<consigne[]>(requete, requestOptions);
  }

  //liste des consignes en cours de validité entre 2 dates
  listConsignesEntreDeuxDates(dateDeb: string, dateFin: string) {
    const requete =
      "https://" +
      this.ip +
      "/consignesEntreDeuxDates/" +
      this.idUsine +
      "?dateDeb=" +
      dateDeb +
      "&dateFin=" +
      dateFin;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<consigne[]>(requete, requestOptions);
  }

  //liste des consignes
  listAllConsignes() {
    const requete = "https://" + this.ip + "/allConsignes/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<consigne[]>(requete, requestOptions);
  }

  //delete consigne
  deleteConsigne(id: number) {
    const requete = "https://" + this.ip + "/consigne/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  //update d'une consigne
  //?commentaire=dggd&dateFin=fff&type=1
  updateConsigne(
    titre: string,
    desc: string,
    type: number,
    dateFin: string | null,
    dateDebut: string | null,
    id: number,
  ) {
    titre = encodeURIComponent(titre);
    desc = encodeURIComponent(desc);
    const requete =
      "https://" +
      this.ip +
      "/updateConsigne?commentaire=" +
      desc +
      "&dateFin=" +
      dateFin +
      "&dateDebut=" +
      dateDebut +
      "&type=" +
      type +
      "&id=" +
      id +
      "&titre=" +
      titre;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  /*
    FIN CONSIGNES
     */

  /*
    ANOMALIES
     */

  //liste des anomalies sur une ronde
  listAnomalies(id: number) {
    const requete = "https://" + this.ip + "/anomalies/" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<anomalie[]>(requete, requestOptions);
  }

  //liste des anomalies sur une usine
  getAllAnomalies() {
    const requete =
      "https://" + this.ip + "/getAllAnomalies?idUsine=" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<anomalie[]>(requete, requestOptions);
  }

  //liste d'une anomalie'
  getOneAnomalie(idAnomalie: number) {
    const requete =
      "https://" + this.ip + "/getOneAnomalie?idAnomalie=" + idAnomalie;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<anomalie[]>(requete, requestOptions);
  }

  updateAnomalie(rondeId: number, zoneId: number, commentaire: string) {
    const requete =
      "https://" +
      this.ip +
      "/updateAnomalie?rondeId=" +
      rondeId +
      "&zoneId=" +
      zoneId +
      "&commentaire=" +
      commentaire;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<anomalie[]>(requete, requestOptions);
  }

  updateAnomalieSetEvenement(idAnomalie: number) {
    const requete =
      "https://" +
      this.ip +
      "/updateAnomalieSetEvenement?idAnomalie=" +
      idAnomalie;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<any>(requete, null, requestOptions);
  }

  createAnomalie(rondeId: number, commentaire: string, zoneId: number) {
    const requete =
      "https://" +
      this.ip +
      "/createAnomalie?rondeId=" +
      rondeId +
      "&zoneId=" +
      zoneId +
      "&commentaire=" +
      commentaire;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<anomalie[]>(requete, requestOptions);
  }
  /*
    FIN ANOMALIES
    */

  /*
    NB LIGNE USINE
     */

  //Nombre de four dans l'usine
  nbLigne() {
    const requete = "https://" + this.ip + "/nbLigne/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<number>(requete, requestOptions);
  }

  //Nombre de GTA dans l'usine
  nbGTA() {
    const requete = "https://" + this.ip + "/nbGTA/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<number>(requete, requestOptions);
  }

  //Nombre de RCU dans l'usine
  nbRCU() {
    const requete = "https://" + this.ip + "/nbRCU/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<number>(requete, requestOptions);
  }

  /*
    FIN NB LIGNE USINE
     */

  createRepriseDeRonde(date: Date, quart: number) {
    const requete =
      "https://" +
      this.ip +
      "/createRepriseDeRonde?date=" +
      date +
      "&quart=" +
      quart +
      "&idUsine=" +
      this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.put<anomalie[]>(requete, requestOptions);
  }

  //Nombre de RCU dans l'usine
  getReprisesRonde() {
    const requete = "https://" + this.ip + "/getReprisesRonde/" + this.idUsine;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.get<number>(requete, requestOptions);
  }

  deleteRepriseRonde(id: number) {
    const requete = "https://" + this.ip + "/deleteRepriseRonde?id=" + id;
    //console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http.delete<any>(requete, requestOptions);
  }
}
