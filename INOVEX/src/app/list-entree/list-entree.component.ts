import { Component, OnInit } from '@angular/core';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';
import {moralEntity} from "../../models/moralEntity.model";
import {NgForm} from "@angular/forms";
import {productsService} from "../services/products.service";
import {product} from "../../models/products.model";
import * as XLSX from 'xlsx';
//Librairie pour lire les csv importés
import {Papa} from 'ngx-papaparse';
import { dechetsCollecteurs } from 'src/models/dechetsCollecteurs.model';
import { importCSV } from 'src/models/importCSV.model';
//***HODJA
import { valueHodja } from 'src/models/valueHodja.model';
import { dateService } from '../services/date.service';
import { user } from 'src/models/user.model';
import { idUsineService } from '../services/idUsine.service';
import {DatePipe} from '@angular/common'

@Component({
  selector: 'app-list-entree',
  templateUrl: './list-entree.component.html',
  styleUrls: ['./list-entree.component.scss']
})
export class ListEntreeComponent implements OnInit {

  public userLogged!: user;
  public idUsine : number;
  public moralEntities : moralEntity[];
  public correspondance : any[];
  public debCode : string;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;
  public listDays : string[];
  public listTotal : number[];
  public monthCall : number;
  public productsEntrants : product[];
  private listTypeDechetsCollecteurs : dechetsCollecteurs[];
  public listTypeDechets : string[];
  public typeImportTonnage : string;
  public csvArray : importCSV[];
  public csvRegistre : any[];

  //stockage données ADEMI à envoyer
  public stockageImport : Map<String,number>;
  //**HODJA
  public valuesHodja : valueHodja[];
  //stockage données HODJA à envoyer
  public stockageHodja : Map<String,number>;
  public dates : string[];
  public clientManquants: Map<String,String>;

  constructor(private idUsineService : idUsineService,private datePipe:DatePipe, private moralEntitiesService : moralEntitiesService, private productsService : productsService, private Papa : Papa, private dateService : dateService) {
    this.debCode = '2';
    this.moralEntities = [];
    this.listDays = [];
    this.csvRegistre = [];
    this.listTotal = [];
    this.monthCall = 0;
    this.listTypeDechetsCollecteurs = [];
    this.listTypeDechets = [];
    this.typeImportTonnage = '';
    this.csvArray = [];
    this.stockageImport = new Map();
    this.clientManquants = new Map();
    //**HODJA
    this.valuesHodja = [];
    this.stockageHodja = new Map();
    this.correspondance = [];
    this.productsEntrants = [];
    this.idUsine = 0;
    this.dates = [];
  }

  ngOnInit(): void {

    this.idUsine = this.idUsineService.getIdUsine();

    this.productsEntrants = [];
    //Récupération type Import pour les tonnages
    this.moralEntitiesService.GetImportTonnage().subscribe((response)=>{
      //@ts-ignore
      this.typeImportTonnage = response.data[0].typeImport;
    });
    this.getCorrespondance();
    //Récupération des types de déchets et des collecteurs
    this.moralEntitiesService.GetTypeDéchets().subscribe((response)=>{
      //@ts-ignore
      this.listTypeDechetsCollecteurs = response.data;

      //On boucle maintenant sur ce tableau pour scindé en déchets / collecteurs avec les codes associés
      this.listTypeDechetsCollecteurs.forEach(typeDechetsCollecteurs => {
        let typeDechets, regroupType;

        //ON regroupe les noms DIB et DEA en 1 seul
        if(typeDechetsCollecteurs.Name.split(' ')[0] == 'DIB' || typeDechetsCollecteurs.Name.split(' ')[0] == 'DEA'){
          regroupType = 'DIB/DEA';
        }
        else regroupType = typeDechetsCollecteurs.Name.split(' ')[0];

        typeDechets = typeDechetsCollecteurs.Code.substring(0,3)+"_"+regroupType;

        if(!this.listTypeDechets.includes(typeDechets)){
          this.listTypeDechets.push(typeDechets);
        }
      });
    });

    this.getMoralEntities();

    //Récupération du produit container DASRI
      this.productsService.getProductEntrant().subscribe((response)=>{
        // @ts-ignore
        this.productsEntrants = response.data;
        //console.log(this.productsEntrants);
        for(let product of this.productsEntrants){
          this.getValuesProduct(product.Id);
        }
      });
  }

  getMoralEntities(){
    this.moralEntitiesService.getMoralEntities(this.debCode).subscribe((response)=>{
      // @ts-ignore
      this.moralEntities = response.data;
      // console.log(this.moralEntities);
      this.getValues();
    });
  }
  getCorrespondance(){
    this.moralEntitiesService.getCorrespondance().subscribe((response)=>{
      // console.log(response)
      // @ts-ignore
      this.correspondance = response.data;
      // console.log(this.correspondance);
    });
  }
  setFilters(){
    /* Début prise en compte des filtres*/
    var produitElt = document.getElementById("produit");
    // @ts-ignore
    var produitSel = produitElt.options[produitElt.selectedIndex].value;
    //var collecteurElt = document.getElementById("collecteur");
    // @ts-ignore
    //var collecteurSel = collecteurElt.options[collecteurElt.selectedIndex].value;
    this.debCode = produitSel;
    // console.log(this.debCode)
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  async setPeriod(form: NgForm) {
    this.listDays = [];
    this.dateDeb = new Date((<HTMLInputElement>document.getElementById("dateDeb")).value);
    this.dateFin = new Date((<HTMLInputElement>document.getElementById("dateFin")).value);
    if (this.dateFin < this.dateDeb) {
      this.dateService.mauvaiseEntreeDate(form); 
    }
    // if( (this.dateFin.getTime()-this.dateDeb.getTime())/(1000*60*60*24) > 29){
      this.loading();
    // }
    this.listDays = this.dateService.getDays(this.dateDeb, this.dateFin);
    await this.getValues();
    this.removeloading();
    
    for(let product of this.productsEntrants){
      this.getValuesProduct(product.Id);
    }
    
  }

  //valider la saisie des tonnages
  validation(){
    this.listDays.forEach(date =>
        this.moralEntities.forEach(mr =>{
          var value = (<HTMLInputElement>document.getElementById(mr.Id+'-'+mr.productId+'-'+date)).value.replace(',','.');
          var Value2 = value.replace(" ", "");
          var valueInt: number = +Value2;
          if (valueInt >0.0){
            this.moralEntitiesService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),valueInt,mr.productId,mr.Id).subscribe((response)=>{
              if (response == "Création du Measures OK"){
                Swal.fire("Les valeurs ont été insérées avec succès !");
              }
              else {
                Swal.fire({
                  icon: 'error',
                  text: 'Erreur lors de l\'insertion des valeurs ....',
                })
              }
            });
          }
        })
    );
    this.getTotaux();
  }

  //Fonction pour attendre
  wait(ms : number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }


  async getValues(){
    let i = 0;
    for (const date of this.listDays){
      for (const mr of this.moralEntities){
        i++;
        //temporisation toutes les 400 req pour libérer de l'espace
        if(i >= 400){
          i=0;
          await this.wait(500);
        }
        this.moralEntitiesService.getEntry(date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2), mr.productId, mr.Id).subscribe((response) => {
          //i++;
          if (response.data[0] != undefined && response.data[0].Value != 0) {
            (<HTMLInputElement>document.getElementById(mr.Id + '-' + mr.productId + '-' + date)).value = response.data[0].Value;
            (<HTMLInputElement>document.getElementById('export-'+mr.Id + '-' + mr.productId + '-' + date)).innerHTML = response.data[0].Value;
          }
          else {
            (<HTMLInputElement>document.getElementById(mr.Id + '-' + mr.productId + '-' + date)).value = '';
          }
        });
      }
      this.getTotaux();
    }
  }

  //récpérer les totaux
  getTotaux(){
    this.listDays.forEach(date => {
      this.moralEntitiesService.getTotal(date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2), this.debCode).subscribe((response) => {
        if (response.data[0] != undefined && response.data[0].Total != 0) {
          (<HTMLInputElement>document.getElementById(date)).innerHTML = response.data[0].Total;
        }
        else (<HTMLInputElement>document.getElementById(date)).innerHTML = '0';
      });
    });
  }

  //mettre à 0 la value pour modificiation
  delete(Id : number, productId : number, date : string){
    this.moralEntitiesService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),0,productId,Id).subscribe((response)=>{
      if (response == "Création du Measures OK"){
        Swal.fire("La valeur a bien été supprimé !");
        (<HTMLInputElement>document.getElementById(Id + '-' + productId + '-' + date)).value = '';
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de la valeur ....',
        })
      }
    });
    this.getTotaux();
  }

  /*
  Products Entrants
   */
  //récupérer les valeurs en BDD pour Products Entrants
  getValuesProduct(idProduct : number){
    this.listDays.forEach(date => {
      // @ts-ignore
      this.productsService.getValueProducts(date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2), idProduct).subscribe((response) => {
        if (response.data[0] != undefined && response.data[0].Value != 0) {
          // @ts-ignore
          (<HTMLInputElement>document.getElementById(idProduct + '-' + date)).value = response.data[0].Value;
        }
        else { // @ts-ignore
          (<HTMLInputElement>document.getElementById(idProduct + '-' + date)).value = '';
        }
      });
    });
  }

  //valider la saisie des Products Entrants
  validationProducts(){
    this.listDays.forEach(date => {
      // @ts-ignore
      this.productsEntrants.forEach(product => {
        var value = (<HTMLInputElement>document.getElementById(product.Id+'-'+date)).value;
        var Value2 = value.replace(" ", "");
        var valueInt: number = +Value2;
        if (valueInt >0.0){
          // @ts-ignore
          this.moralEntitiesService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),valueInt,product.Id,0).subscribe((response)=>{
            if (response == "Création du Measures OK"){
              Swal.fire("Les valeurs ont été insérées avec succès !");
            }
            else {
              Swal.fire({
                icon: 'error',
                text: 'Erreur lors de l\'insertion des valeurs ....',
              })
            }
          });
        }
      })
    });
  }

  //mettre à 0 la value pour modificiation
  deleteContainer(Id : number, date : string){
    this.moralEntitiesService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),0,Id,0).subscribe((response)=>{
      if (response == "Création du Measures OK"){
        Swal.fire("La valeur a bien été supprimé !");
        (<HTMLInputElement>document.getElementById(Id + '-' + date)).value = '';
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de la valeur ....',
        })
      }
    });
  }

  /*
  FIN CONTAINERS DASRI
   */


  loading(){
    var element = document.getElementById('spinner');
    // @ts-ignore
    element.classList.add('loader');
    var element = document.getElementById('spinnerBloc');
    // @ts-ignore
    element.classList.add('loaderBloc');
  }
  removeloading(){
      var element = document.getElementById('spinner');
      // @ts-ignore
      element.classList.remove('loader');
      var element = document.getElementById('spinnerBloc');
      // @ts-ignore
      element.classList.remove('loaderBloc');
  }

  //changer les dates pour saisir hier
  setYesterday(form: NgForm){
    this.removeloading();
    this.dateService.setYesterday(form);
    this.setPeriod(form);
  }

  //changer les dates pour saisir la semaine en cours
  setCurrentWeek(form: NgForm){
    this.removeloading();
    this.dateService.setCurrentWeek(form);
    this.setPeriod(form);
  }

  //changer les dates pour saisir le mois en cours
  async setCurrentMonth(form: NgForm){
    this.loading();
    this.dateService.setCurrentMonth(form);
    await this.setPeriod(form);     
    this.removeloading();
  }


  //Export de la table dans fichier EXCEL
  exportExcel(){
    /* table id is passed over here */
    let element = document.getElementById('listEntree');
    console.log(element)
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element,{raw:false,dateNF:'mm/dd/yyyy'}); //Attention les jours sont considérés comme mois !!!!

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entrants');

    /* save to file */
    XLSX.writeFile(wb, 'entrants.xlsx');
  }



  //import tonnage via fichier
  import(event : Event){
    //Pithiviers/chinon/dunkerque
    if (this.typeImportTonnage.toLowerCase().includes("ademi")){
      //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
      //Dunkerque
      if(this.idUsine === 9){
        this.lectureCSV(event, ";", true, 12, 11, 0, 37);
      }
      else this.lectureCSV(event, ";", false, 8, 7, 2, 5);
    }
    //Noyelles-sous-lens et Thiverval
    else if (this.typeImportTonnage.toLowerCase().includes("protruck")){
      //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
      //Thiverval
      if(this.idUsine === 11){
        this.lectureCSV(event, ";", false, 6, 29, 2, 16, 1);
      }
      else {
        this.lectureCSV(event, ";", true, 6, 31, 2, 16);
        this.registre_DNDTS(event);
      }
    }
    //Saint-Saulve
    else if (this.typeImportTonnage.toLowerCase().includes("dpk")){
      //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
      //this.lectureCSV(event, ";", false, 21, 20, 7, 19);
      this.lectureCSV(event, ";", false, 21, 20, 7, 19, 25);
    }
    //Calce
    else if (this.typeImportTonnage.toLowerCase().includes("informatique verte")){
      //@ts-ignore
      var file = event.target.files[0].name;
      file = file.toLowerCase();
      if(file.includes("dasri")){
        //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
        this.lectureCSV(event, ";", true, 1, 9999 , 3, 7);
      }
      else{
        //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
        this.lectureCSV(event, ";", true, 13, 15, 8, 6, 12);
      }
    }
    //Maubeuge
    else if (this.typeImportTonnage.toLowerCase().includes("tradim")){
      //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
      this.lectureCSV(event, ";", true, 8, 6, 0, 5, 11);
    }
    //Plouharnel / GIEN / Douchy/ Mourenx
    else if (this.typeImportTonnage.toLowerCase().includes("arpege masterk")){
      //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
      //Gien
      if(this.idUsine === 16){
        this.lectureCSV(event, ";", false, 18, 17, 14, 7);
      }
      //Douchy
      else if(this.idUsine === 10){
        this.lectureCSV(event, ";", true, 28, 27, 16, 7);
      }
      //Mourenx
      else if(this.idUsine === 18){
        this.lectureCSV(event, ";", false, 11, 13, 1, 7);
      }   
      //Plouharnel 
      else this.lectureCSV(event, ";", false, 8, 6, 1, 11, 12);
    }
    //Pluzunet
    else if (this.typeImportTonnage.toLowerCase().includes("caktus")){
      //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
      this.lectureCSV(event, ",", true, 31, 27, 14, 10, 11);
    }
    //Sète , Cergy
    else if (this.typeImportTonnage.toLowerCase().includes("hodja")){
      //Sète
      //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
      if(this.idUsine === 19){
        this.lectureCSV(event, ";", true, 8, 11, 0, 14);
      }
      //Cergy
      else {
        this.lectureCSV(event, ",", true, 9, 12, 0, 14);
      }
    }
    //Vitré
    else if (this.typeImportTonnage.toLowerCase().includes("pcs précia")){      
      //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
      if(this.idUsine === 15){
        //Vitré
        this.lectureCSV(event, ";", true,13, 20, 4, 27, 31);
      }
      //Villefranche
      else {
        this.lectureCSV(event, ";", true, 23, 19, 6, 11, 2);
      }
    }
    //Saint Ouen
    else if (this.typeImportTonnage.toLowerCase().includes("syspeau")){
      //delimiter,header,client,typedechet,dateEntree,tonnage, posEntreeSortie
      this.lectureCSV(event, ";", true, 0, 18, 5, 9, 4);
    }
  }

    //Export de la table dans fichier EXCEL
    exportRegistreDNDTSExcel(){
      if((<HTMLInputElement>document.getElementById("dateDeb")).value != "" && (<HTMLInputElement>document.getElementById("dateFin")).value != ""){
        this.dateDeb = new Date((<HTMLInputElement>document.getElementById("dateDeb")).value);
        this.dateFin = new Date((<HTMLInputElement>document.getElementById("dateFin")).value);
      
        var dateDebString = this.datePipe.transform(this.dateDeb,'yyyy-MM-dd')
        var dateFinString = this.datePipe.transform(this.dateFin,'yyyy-MM-dd')

        var nomFichier = "dnd-entrant du " + this.datePipe.transform(this.dateDeb,'dd-MM-yyyy') + " au " +this.datePipe.transform(this.dateFin,'dd-MM-yyyy')
        this.moralEntitiesService.getRegistreDNDTSEntrants(dateDebString, dateFinString).subscribe((response)=>{
          /* table id is passed over here */
          let element = response.data
          if(response.data.length >1){
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element); //Attention les jours sont considérés comme mois !!!!
      
            /* generate workbook and add the worksheet */
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Entrants');
        
            // /* save to file */
            XLSX.writeFile(wb, nomFichier+'.xlsx');
          }
          else {
            Swal.fire({
              icon: 'error',
              text: 'Aucune donnée sur ces dates !',
            })
          }
        })
      }
      else{
        Swal.fire({
          icon: 'error',
          text: 'Veuillez entrer des dates',
        })
      }
    }

  registre_DNDTS(event : Event){
    this.loading();
    //@ts-ignore
    var files = event.target.files; // FileList object
    var file = files[0];
    var reader = new FileReader();
    var debut = 1;

    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file

      //options à ajouter => pas d'entête, delimiter ;
      this.Papa.parse(csv, {
        skipEmptyLines: true,
        delimiter: ";",
        //False pour éviter de devoir utiliser le nom des entêtes et rester sur un tableau avec des indices.
        header: false,
        complete: async (results) => {
          for (let i = debut; i < results.data.length; i++) {
            if(results.data[i][0] != "Compteur" && results.data[i][0] != 'Somme'){
              //Création de l'objet qui contient l'ensemble des infos nécessaires
              let importCSV = {
                numDePesee: results.data[i][0].replace(/'/g,"''"),
                type: results.data[i][1].replace(/'/g,"''"),
                date1: results.data[i][2].replace(/'/g,"''"),
                codeBadge: results.data[i][3].replace(/'/g,"''"),
                codeVehicule: results.data[i][4].replace(/'/g,"''"),
                codeClient: results.data[i][5].replace(/'/g,"''"),
                nomClient: results.data[i][6].replace(/'/g,"''"),
                poids1: results.data[i][7].replace(/'/g,"''"),
                poids1DSD: results.data[i][8].replace(/'/g,"''"),
                poids1DateHeure: results.data[i][9].replace(/'/g,"''"),
                pontBasculeP1: results.data[i][10].replace(/'/g,"''"),
                date2:results.data[i][11].replace(/'/g,"''"),
                poids2: results.data[i][12].replace(/'/g,"''"),
                poids2DSD: results.data[i][13].replace(/'/g,"''"),
                poids2DateHeure: results.data[i][14].replace(/'/g,"''"),
                pontBasculeP2: results.data[i][15].replace(/'/g,"''"),
                net : results.data[i][16].replace(/'/g,"''"),
                tempsDeRetenue: results.data[i][17].replace(/'/g,"''"),
                codeSociete: results.data[i][18].replace(/'/g,"''"),
                nomSociete: results.data[i][19].replace(/'/g,"''"),
                codeFamilleVehicule : results.data[i][20].replace(/'/g,"''"),
                nomFamilleVehicule : results.data[i][21].replace(/'/g,"''"),
                codeFamilleTransporteur: results.data[i][22].replace(/'/g,"''"),
                nomFamilleTransporteur: results.data[i][23].replace(/'/g,"''"),
                codeTransporteur: results.data[i][24].replace(/'/g,"''"),
                nomTransporteur: results.data[i][25].replace(/'/g,"''"),
                codeFamilleClient: results.data[i][26].replace(/'/g,"''"),
                nomFamilleClient: results.data[i][27].replace(/'/g,"''"),
                codeFamilleProduit: results.data[i][28].replace(/'/g,"''"),
                nomFamilleProduit: results.data[i][29].replace(/'/g,"''"),
                codeProduit: results.data[i][30].replace(/'/g,"''"),
                nomProduit: results.data[i][31].replace(/'/g,"''"),
                codeCollecte: results.data[i][32].replace(/'/g,"''"),
                nomCollecte: results.data[i][33].replace(/'/g,"''"),
                codeDestination: results.data[i][34].replace(/'/g,"''"),
                nomDestination: results.data[i][35].replace(/'/g,"''"),
                codeChantier: results.data[i][36].replace(/'/g,"''"),
                nomChantier: results.data[i][37].replace(/'/g,"''"),
                codeChauffeur: results.data[i][38].replace(/'/g,"''"),
                nomChauffeur: results.data[i][39].replace(/'/g,"''"),
                codeFamilleBenne: results.data[i][40].replace(/'/g,"''"),
                nomFamilleBenne: results.data[i][41].replace(/'/g,"''"),
                codeBenne: results.data[i][42].replace(/'/g,"''"),
                nomBenne: results.data[i][43].replace(/'/g,"''"),
                codeZoneDeStockage: results.data[i][44].replace(/'/g,"''"),
                nomZoneDeStockage: results.data[i][45].replace(/'/g,"''"),
                codeFichier1: results.data[i][46].replace(/'/g,"''"),
                nomFichier1: results.data[i][47].replace(/'/g,"''"),
                codeFichier2: results.data[i][48].replace(/'/g,"''"),
                nomFichier2: results.data[i][49].replace(/'/g,"''"),
                codeFichier3: results.data[i][50].replace(/'/g,"''"),
                nomFichier3: results.data[i][51].replace(/'/g,"''"),
                codeFichier4: results.data[i][52].replace(/'/g,"''"),
                nomFichier4: results.data[i][53].replace(/'/g,"''"),
                terminee: results.data[i][54].replace(/'/g,"''"),
                supprimee: results.data[i][55].replace(/'/g,"''"),
                modifie: results.data[i][56].replace(/'/g,"''"),
                humidite: results.data[i][57].replace(/'/g,"''"),
                proteine : results.data[i][58].replace(/'/g,"''"),
                impurete: results.data[i][59].replace(/'/g,"''"),
                poidsSpecifique: results.data[i][60].replace(/'/g,"''"),
                parcelle: results.data[i][61].replace(/'/g,"''"),
                calibration: results.data[i][62].replace(/'/g,"''"),
                numeroCommande: results.data[i][63].replace(/'/g,"''"),
                numeroDeBSB: results.data[i][64].replace(/'/g,"''"),
                adresse1Societe: results.data[i][65].replace(/'/g,"''"),
                adresse2Societe: results.data[i][66].replace(/'/g,"''"),
                codePostalSociete: results.data[i][67].replace(/'/g,"''"),
                villeSociete: results.data[i][68].replace(/'/g,"''"),
                mobileSociete: results.data[i][69].replace(/'/g,"''"),
                telephoneSociete: results.data[i][70].replace(/'/g,"''"),
                faxSociete: results.data[i][71].replace(/'/g,"''"),
                modeDegrade: results.data[i][72].replace(/'/g,"''"),
                borne : results.data[i][73].replace(/'/g,"''"),
                numeroDePeseeBorne: results.data[i][74].replace(/'/g,"''"),
                creeLe : results.data[i][75].replace(/'/g,"''"),
                creePar : results.data[i][76].replace(/'/g,"''"),
                creeSur : results.data[i][77].replace(/'/g,"''"),
                modifieLe: results.data[i][78].replace(/'/g,"''"),
                modifiePar: results.data[i][79].replace(/'/g,"''"),
                modifieSur: results.data[i][80].replace(/'/g,"''"),
                adresseClient : results.data[i][81].replace(/'/g,"''") + results.data[i][82].replace(/'/g,"''"),
                codePostalClient : results.data[i][83].replace(/'/g,"''"),
                villeClient : results.data[i][84].replace(/'/g,"''"),
                siret : results.data[i][85].replace(/'/g,"''"),
                idUsine: this.idUsine
              };
              this.csvRegistre.push(importCSV);
            }
          }
          console.log(this.csvRegistre)
          this.removeloading();
          this.moralEntitiesService.registreDNDTS(this.csvRegistre).subscribe((response)=>{
            Swal.fire({
              icon: 'success',
              text: 'Valeurs insérées avec succès',
            })
          })
        }
        
      });
    }
   

  }
  //import tonnage via fichier
  //Traitement du fichier csv
  //La position pour le sens n'est pas obligatoire
  lectureCSV(event : Event, delimiter : string, header : boolean, posClient : number, posTypeDechet : number, posDateEntree : number, posTonnage : number, posEntreeSortie? : number){
    this.loading();
    //@ts-ignore
    var files = event.target.files; // FileList object
    var file = files[0];
    var reader = new FileReader();
    var debut = 0;

    //Si on a une ligne header, on commence l'acquisition à 1.
    if(header == true){
      debut = 1;
    }

    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file

      //options à ajouter => pas d'entête, delimiter ;
      this.Papa.parse(csv, {
        skipEmptyLines: true,
        delimiter: delimiter,
        //False pour éviter de devoir utiliser le nom des entêtes et rester sur un tableau avec des indices.
        header: false,
        complete: async (results) => {
          for (let i = debut; i < results.data.length; i++) {
            //ON récupére les lignes infos nécessaires pour chaque ligne du csv
            //ON récupère uniquement les types de déchets pour les entrants

            // if(this.typeImportTonnage.toLowerCase().includes("protruck")){
            //   results.data[i][posTypeDechet] = results.data[i][posTypeDechet].split(" - ")[0];
            // }
            // console.log(results.data[i][posClient])

            //permet de diviser le tonnage par 1000 si on l'a en kg
            let divisionKgToTonnes = 1;
            //si ce n'est pas caktus ni tradim ni Dunkerque, on divise par 1000 pour avoir en tonnes
            if (!this.typeImportTonnage.toLowerCase().includes("caktus") && !this.typeImportTonnage.toLowerCase().includes("tradim") && this.idUsine != 9){
              divisionKgToTonnes = 1000;
            }

            var EntreeSortie
            //Si l'argument de position n'est pas fournit, on met la valeur à E
            if(posEntreeSortie == undefined){
              EntreeSortie = "E";
            }
            else{
              EntreeSortie = results.data[i][posEntreeSortie]
            }

            //Si la position du dechet est 9999 (valeur impossible dans un csv, alors c'est du dasri)
            var typeDechet
            if(posTypeDechet == 9999){
               typeDechet= "DASRI"
            }
            else typeDechet = results.data[i][posTypeDechet]
            //Permet d'éviter l'erreur en cas de lignes vides
            if(results.data[i][posDateEntree] != undefined){
              if(results.data[i][posDateEntree] != ""){
                //On ajoute toutes les dates dans le tableau dates
                this.dates.push(results.data[i][posDateEntree].substring(0,10));
              } 
              //Création de l'objet qui contient l'ensemble des infos nécessaires
              let importCSV = {
                client: results.data[i][posClient],
                typeDechet: typeDechet,
                dateEntree : results.data[i][posDateEntree].substring(0,10),
                tonnage : +results.data[i][posTonnage].replace(/[^0-9,.]/g,"").replace(",",".")/divisionKgToTonnes,
                entrant : EntreeSortie
              };
              this.csvArray.push(importCSV);
            }
          }
          //Fonction qui tranforme les dates string au format date afin de les comparer
          function compareDates(a: string, b: string){
            const dateA = new Date(a.split('/').reverse().join('/'));
            const dateB = new Date(b.split('/').reverse().join('/'));
            return dateA.getTime() - dateB.getTime();
          }

          //On trie le tableau des dates
          this.dates.sort(compareDates);

          //On récupère la date de début qui est donc la première date du tableau et on la met au format 'yyyy-mm-dd'
          const [day, month, year] = this.dates[0].split('/');
          const dateDeb = `${year}-${month}-${day}`;

          //On récupère la date de fin qui est donc la dernière date du tableau et on la met au format 'yyyy-mm-dd'
          const [day2, month2, year2] = this.dates[this.dates.length-1].split('/');
          const dateFin = `${year2}-${month2}-${day2}`;

          //On supprime toutes les mesures sur les entrants entre les deux dates avant de faire la nouvelle insertion
          this.moralEntitiesService.deleteMesuresEntrantsEntreDeuxDates(dateDeb,dateFin).subscribe((response)=>{
            this.insertTonnageCSV();
          });
          
          this.removeloading();
        }
      });
    }
  }

  //Insertion du tonnage récupéré depuis le fichier csv ADEMI
  insertTonnageCSV(){
    let successInsert = true;
    this.debCode = '20';
    this.stockageImport.clear();
    var count = 0 ;

    this.csvArray.forEach(csv => {
      var clientManquant = csv.client;
      var dechetManquant = csv.typeDechet;
      count = 0;
      this.correspondance.forEach(correspondance => {

          csv.client = csv.client.toLowerCase().replace(/\s/g,"");
          csv.typeDechet = csv.typeDechet.toLowerCase().replace(/\s/g,"");
          correspondance.nomImport = correspondance.nomImport.toLowerCase().replace(/\s/g,"");
          correspondance.productImport = correspondance.productImport.toLowerCase().replace(/\s/g,"");

          if(csv.entrant.toLowerCase() == "e" || csv.entrant == 1 || csv.entrant.toLowerCase() == "réception" || csv.entrant.toLowerCase() == "reception" || csv.entrant.toLowerCase() == "entree" || csv.entrant.toLowerCase() == "entrant" || csv.entrant.toLowerCase() == "incinerables"){
            //Si il y a correspondance on fait traitement
            if( correspondance.nomImport == csv.client && correspondance.productImport == csv.typeDechet  /*|| (mr.produit == "dib/dea" && mr.produit.includes(csv.typeDechet)))*/ ){  
              let formatDate = csv.dateEntree.split('/')[2]+'-'+csv.dateEntree.split('/')[1]+'-'+csv.dateEntree.split('/')[0];
              let keyHash = formatDate+'_'+correspondance.ProductId+'_'+correspondance.ProducerId;
              let value, valueRound;
              count = count + 1;;
              //si il y a deja une valeur dans la hashMap pour ce client et ce jour, on incrémente la valeur
              if(this.stockageImport.has(keyHash)){
                //@ts-ignore
                value = this.stockageImport.get(keyHash)+csv.tonnage;
                valueRound = parseFloat(value.toFixed(3));
                this.stockageImport.set(keyHash,valueRound);
              }
              else
              //Sinon on insére dans la hashMap
              //@ts-ignore
              this.stockageImport.set(keyHash,parseFloat(csv.tonnage.toFixed(3)));
            }
          }
        });
        //Si sur ce dechet, nous n'avons pas trouvé de correspondant, count = 0, et que ce dechet est une entree, on la'jouter au tableau des dechet et clients manquants
        if(count == 0 && (csv.entrant.toLowerCase() == "e" || csv.entrant.toLowerCase() == "réception" || csv.entrant == 1 || csv.entrant.toLowerCase() == "reception" || csv.entrant.toLowerCase() == "entree" || csv.entrant.toLowerCase() == "entrant" || csv.entrant.toLowerCase() == "incinerables")){
          this.clientManquants.set(dechetManquant +"-"+ clientManquant,dechetManquant +"-"+ clientManquant);
        }
    });
    //debug
    // console.log(this.stockageImport);
    //on parcours la hashmap pour insertion en BDD
    this.stockageImport.forEach(async (value : number, key : String) => {
      await this.moralEntitiesService.createMeasure(key.split('_')[0],value,parseInt(key.split('_')[1]),parseInt(key.split('_')[2])).subscribe((response) =>{
        if (response != "Création du Measures OK"){
          successInsert = false;
        }
      })
    });

    //Si l'inserstion s'est bien passée, on affiche la liste des correspondances manquantes
    if (successInsert){
      var afficher = "";
      this.clientManquants.forEach(async (value : String, key : String) => {       
        afficher += "Le client <strong>'" + key.split("-")[1] + "'</strong> avec le déchet : <strong>'" + key.split("-")[0] + "'</strong> n'a pas de correspondance dans CAP Exploitation <br>";
      });

      afficher += "<strong>Pensez à faire la correspondance dans l'administration !</strong>";
      Swal.fire({
        html : afficher,
        width : '80%',
        title :"Les valeurs ont été insérées avec succès !"
      });
    }
    else {
      Swal.fire({
        icon: 'error',
        text: 'Erreur lors de l\'insertion des valeurs ....',
      })
    }

    if(this.stockageImport.size == 0 ){
      Swal.fire({
        icon: 'error',
        text: 'Aucune valeur n\'a été insérée, aucune correspondance n\'a été trouvée',
      })
    }

  }

  //Import tonnage via HODJA
  recupHodja(form : NgForm){
    let successInsert = true;
    this.stockageHodja.clear();
    let dateDebFormat = new Date(), dateFinFormat = new Date();
    let listDate = [];
    var count = 0 ;
    let clientManquants: any[] = [];
    let dechetsManquants: string[]  = [];

    dateDebFormat = new Date(form.value['dateDeb']);
    dateFinFormat = new Date(form.value['dateFin']);

    listDate = this.dateService.getDays(dateDebFormat,dateFinFormat);
    listDate.forEach(async day =>{
      await this.wait(100);
      //On récupère dans hodja les valeurs de bascule pour la période choisit
      this.moralEntitiesService.recupHodjaEntrants(day,day).subscribe(async (response)=>{
        
        this.stockageHodja.clear();
        this.valuesHodja = response;

        //ON boucle sur les valeurs HODJA
        for await (const valueHodja of this.valuesHodja){
          count = 0;
          var clientManquant = valueHodja.client;
          var dechetManquant = valueHodja.typeDechet;
          //ET les clients INOVEX
          for (const correspondance of this.correspondance){

            valueHodja.client = valueHodja.client.toLowerCase().replace(/\s/g,"");
            valueHodja.typeDechet = valueHodja.typeDechet.toLowerCase().replace(/\s/g,"");
            correspondance.nomImport = correspondance.nomImport.toLowerCase().replace(/\s/g,"");
            correspondance.productImport = correspondance.productImport.toLowerCase().replace(/\s/g,"");
            
            //Si il y a correspondance on fait traitement
            if( correspondance.nomImport == valueHodja.client && correspondance.productImport == valueHodja.typeDechet){  

              let formatDate = valueHodja.entryDate.split('T')[0];
              let keyHash = formatDate+'_'+correspondance.ProductId+'_'+correspondance.ProducerId;
              let value, valueRound;
              count = count + 1;;

              //si il y a deja une valeur dans la hashMap pour ce client et ce jour, on incrémente la valeur
              if(this.stockageHodja.has(keyHash)){
                //@ts-ignore       
                value = this.stockageHodja.get(keyHash) + ( (valueHodja.TK_Poids_brut - valueHodja.TK_Poids_tare) /1000 );
                valueRound = parseFloat(value.toFixed(3));
                this.stockageHodja.set(keyHash,valueRound);
              }
              else
              //Sinon on insére dans la hashMap
              //@ts-ignore
              this.stockageHodja.set(keyHash,parseFloat(( (valueHodja.TK_Poids_brut - valueHodja.TK_Poids_tare) /1000 ).toFixed(3)));
            }
          }
          if(count == 0){
            dechetsManquants.push(dechetManquant);
            clientManquants.push(clientManquant);
          }
        }

        //On parcours la HashMap pour insérer en BDD
        this.stockageHodja.forEach(async (value : number, key : String) =>{
          await this.moralEntitiesService.createMeasure(key.split('_')[0],value,parseInt(key.split('_')[1]),parseInt(key.split('_')[2])).subscribe((response) =>{
            if (response != "Création du Measures OK"){
              successInsert = false
            }
          });
        })

        if(successInsert == true){
          var afficher = "";

              for(let i = 0; i< clientManquants.length; i++){
                afficher += "Le client <strong>'" + clientManquants[i] + "'</strong> avec le déchet : <strong>'" + dechetsManquants[i] + "'</strong> n'a pas de correspondance dans CAP Exploitation <br>";
              }
              afficher += "<strong>Pensez à faire la correspondance dans l'administration !</strong>";
              Swal.fire({
                html : afficher,
                width : '80%',
                title :"Les valeurs ont été insérées avec succès !"
              });
            }
            else {
              Swal.fire({
                icon: 'error',
                text: 'Erreur lors de l\'insertion des valeurs ....',
              })
        }
        await this.wait(350);
      });
    })
  }
}