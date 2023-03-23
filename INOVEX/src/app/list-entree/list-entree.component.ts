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
import { importAdemi } from 'src/models/importAdemi.model';
//***HODJA
import { valueHodja } from 'src/models/valueHodja.model';

@Component({
  selector: 'app-list-entree',
  templateUrl: './list-entree.component.html',
  styleUrls: ['./list-entree.component.scss']
})
export class ListEntreeComponent implements OnInit {

  public moralEntities : moralEntity[];
  public debCode : string;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;
  public listDays : string[];
  public listTotal : number[];
  public monthCall : number;
  public containerDasri : product | undefined;
  private listTypeDechetsCollecteurs : dechetsCollecteurs[];
  public listTypeDechets : string[];
  public typeImportTonnage : string;
  public ademiArray : importAdemi[];
  //stockage données ADEMI à envoyer
  public stockageImport : Map<String,number>;
  //**HODJA
  public valuesHodja : valueHodja[];
  //stockage données HODJA à envoyer
  public stockageHodja : Map<moralEntity,number>;
  

  constructor(private moralEntitiesService : moralEntitiesService, private productsService : productsService, private Papa : Papa) {
    this.debCode = '20';
    this.moralEntities = [];
    this.listDays = [];
    this.listTotal = [];
    this.monthCall = 0;
    this.listTypeDechetsCollecteurs = [];
    this.listTypeDechets = [];
    this.typeImportTonnage = '';
    this.ademiArray = [];
    this.stockageImport = new Map();
    //**HODJA
    this.valuesHodja = [];
    this.stockageHodja = new Map();
  }

  ngOnInit(): void {
    this.containerDasri = undefined;

    //Récupération type Import pour les tonnages
    this.moralEntitiesService.GetImportTonnage().subscribe((response)=>{
      //@ts-ignore
      this.typeImportTonnage = response.data[0].typeImport;
    });

    //Récupération des types de déchets et des collecteurs
    this.moralEntitiesService.GetTypeDéchets().subscribe((response)=>{
      //@ts-ignore
      this.listTypeDechetsCollecteurs = response.data;

      //On boucle maintenant sur ce tableau pour scindé en déchets / collecteurs avec les codes associés
      this.listTypeDechetsCollecteurs.forEach(typeDechetsCollecteurs => {
        let typeDechets, regroupType;

        //ON regroupe les noms DIB et DEA en 1 seul
        if(typeDechetsCollecteurs.Name.split(' ')[0].includes('DIB') || typeDechetsCollecteurs.Name.split(' ')[0].includes('DEA')){
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
    if (this.debCode == '203'){
      this.productsService.getContainers().subscribe((response)=>{
        // @ts-ignore
        this.containerDasri = response.data[0];
        this.getValuesContainer();
      });
    }
  }

  getMoralEntities(){
    this.moralEntitiesService.getMoralEntities(this.debCode).subscribe((response)=>{
      // @ts-ignore
      this.moralEntities = response.data;
      this.getValues();
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
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  setPeriod(form: NgForm) {
    this.listDays = [];
    this.dateDeb = new Date(form.value['dateDeb']);
    this.dateFin = new Date(form.value['dateFin']);
    if (this.dateFin < this.dateDeb) {
      form.controls['dateFin'].reset();
      form.value['dateFin'] = '';
      Swal.fire({
        icon: 'error',
        text: 'La date de Fin est inférieure à la date de Départ !',
      })
    }
    this.listDays = this.getDays(this.dateDeb, this.dateFin);
    this.getValues();
    this.getValuesContainer();
  }


  //récupérer les jours de la période
  getDays(start : Date, end : Date) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
      var dd = String(dt.getDate()).padStart(2, '0');
      var mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = dt.getFullYear();
      var day = dd + '/' + mm + '/' + yyyy;
      arr.push(day);
    }
    return arr;
  };


  //valider la saisie des tonnages
  validation(){
    this.listDays.forEach(date =>
        this.moralEntities.forEach(mr =>{
          var value = (<HTMLInputElement>document.getElementById(mr.Id+'-'+mr.productId+'-'+date)).value.replace(',','.');
          var valueInt : number = +value;
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
  CONTAINERS DASRI
   */
  //récupérer les valeurs en BDD pour Container DASRI
  getValuesContainer(){
    this.listDays.forEach(date => {
      // @ts-ignore
      this.productsService.getValueProducts(date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2), this.containerDasri.Id).subscribe((response) => {
        if (response.data[0] != undefined && response.data[0].Value != 0) {
          // @ts-ignore
          (<HTMLInputElement>document.getElementById(this.containerDasri.Id + '-' + date)).value = response.data[0].Value;
        }
        else { // @ts-ignore
          (<HTMLInputElement>document.getElementById(this.containerDasri.Id + '-' + date)).value = '';
        }
      });
    });
  }

  //valider la saisie des Containers DASRI
  validationContainer(){
    this.listDays.forEach(date => {
      // @ts-ignore
      var value = (<HTMLInputElement>document.getElementById(this.containerDasri.Id+'-'+date)).value;
      var valueInt : number = +value;
      if (valueInt >0.0){
        // @ts-ignore
        this.moralEntitiesService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),valueInt,this.containerDasri.Id,0).subscribe((response)=>{
          if (response == "Création du Measures OK"){
            Swal.fire("Les valeurs de Containers ont été insérées avec succès !");
          }
          else {
            Swal.fire({
              icon: 'error',
              text: 'Erreur lors de l\'insertion des valeurs ....',
            })
          }
        });
      }
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
    var date = new Date();
    var yyyy = date.getFullYear();
    var dd = String(date.getDate() - 1).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    if(dd === '00'){
      dd = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(2, '0');
      mm = String(date.getMonth()).padStart(2, '0');
    }
    var day = yyyy + '-' + mm + '-' + dd;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = day;
    (<HTMLInputElement>document.getElementById("dateFin")).value = day;
    form.value['dateDeb'] = day;
    form.value['dateFin'] = day;
    this.setPeriod(form);
    form.controls['dateDeb'].reset();
    form.value['dateDeb']='';
    form.controls['dateFin'].reset();
    form.value['dateFin']='';
  }

  //changer les dates pour saisir la semaine en cours
  setCurrentWeek(form: NgForm){
    this.removeloading();
    var date = new Date();
    //le début de la semaine par défaut est dimanche (0)
    var firstday = new Date(date.setDate(date.getDate() - date.getDay()+1));
    var lastday = new Date(date.setDate(date.getDate() - date.getDay()+7));
    var ddF = String(firstday.getDate()).padStart(2, '0');
    var mmF = String(firstday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyyF = firstday.getFullYear();
    var firstDayOfWeek = yyyyF + '-' + mmF + '-' + ddF;
    var ddL = String(lastday.getDate()).padStart(2, '0');
    var mmL = String(lastday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyyL = lastday.getFullYear();
    var LastDayOfWeek = yyyyL + '-' + mmL + '-' + ddL;

    (<HTMLInputElement>document.getElementById("dateDeb")).value = firstDayOfWeek;
    (<HTMLInputElement>document.getElementById("dateFin")).value = LastDayOfWeek;
    form.value['dateDeb'] = firstDayOfWeek;
    form.value['dateFin'] = LastDayOfWeek;
    this.setPeriod(form);
    form.controls['dateDeb'].reset();
    form.value['dateDeb']='';
    form.controls['dateFin'].reset();
    form.value['dateFin']='';
  }

  //changer les dates pour saisir le mois en cours
  setCurrentMonth(form: NgForm){
    this.loading();
    var date = new Date();
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');

    var Fisrtday = yyyy + '-' + mm + '-' + '01';
    var Lastday = yyyy + '-' + mm + '-' + dd;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = Fisrtday;
    (<HTMLInputElement>document.getElementById("dateFin")).value = Lastday;
    form.value['dateDeb'] = Fisrtday;
    form.value['dateFin'] = Lastday;
    this.setPeriod(form);
    form.controls['dateDeb'].reset();
    form.value['dateDeb']='';
    form.controls['dateFin'].reset();
    form.value['dateFin']='';
    this.removeloading();
  }


  //Export de la table dans fichier EXCEL
  exportExcel(){
    /* table id is passed over here */
    let element = document.getElementById('listEntree');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element,{raw:false,dateNF:'mm/dd/yyyy'}); //Attention les jours sont considérés comme mois !!!!

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entrants');

    /* save to file */
    XLSX.writeFile(wb, 'entrants.xlsx');
  }

  //import tonnage via fichier
  import(event : Event){
    if (this.typeImportTonnage.toLowerCase().includes("ademi")){
      this.importAdemi(event);
    }
    else if (this.typeImportTonnage.toLowerCase().includes("protruck")){
      this.importProTruck();
    }
  }

  //Traitement du fichier csv ADEMI
  importAdemi(event : Event){
    //@ts-ignore
    var files = event.target.files; // FileList object
    var file = files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file
      //options à ajouter => pas d'entête, delimiter ;
      this.Papa.parse(csv, {
        skipEmptyLines: true,
        delimiter: ";",
        header: false,
        //TODO : attendre ce traitement avant de traiter le tableau avec la boucle
        complete: (results) => {
          for (let i = 0; i < results.data.length; i++) {
            //ON récupére les lignes infos nécessaires pour chaque ligne du csv
            //ON récupère uniquement les types de déchets pour les entrants
            if(results.data[i][7] == "OM" || results.data[i][7] == "DIB" || results.data[i][7] == "DEA" || results.data[i][7] == "DAOM" || results.data[i][7] == "REFUS DE TRI"){
              let importAdemi = {
                client: results.data[i][8],
                typeDechet: results.data[i][7],
                dateEntree : results.data[i][2].substring(0,10),
                tonnage : results.data[i][5]/1000,
              };
              this.ademiArray.push(importAdemi);
            }
          }
          this.insertTonnageAdemi();
        }
      });
    }
  }

  //Insertion du tonnage récupéré depuis le fichier csv ADEMI
  insertTonnageAdemi(){
    this.debCode = '20';
    this.stockageImport.clear();
    this.getMoralEntities();
    this.moralEntities.forEach(mr => {
      this.ademiArray.forEach(ademi => {
        mr.Name = mr.Name.toLocaleLowerCase();
        mr.produit = mr.produit.toLocaleLowerCase().replace(" ","");
        ademi.client = ademi.client.toLocaleLowerCase();
        ademi.typeDechet = ademi.typeDechet.toLocaleLowerCase();
        //Si il y a correspondance on fait traitement
        if( mr.Name.split(' - ')[1] == ademi.client && (mr.produit == ademi.typeDechet || (mr.produit == "dib/dea" && mr.produit.includes(ademi.typeDechet))) ){
          //if( mr.Name.split(' - ')[1] == ademi.client  ){  
          let formatDate = ademi.dateEntree.split('/')[2]+'-'+ademi.dateEntree.split('/')[1]+'-'+ademi.dateEntree.split('/')[0];
          let keyHash = formatDate+'_'+mr.productId+'_'+mr.Id;
          //si il y a deja une valeur dans la hashMap pour ce client et ce jour, on incrémente la valeur
          let value, valueRound;
          if(this.stockageImport.has(keyHash)){
            //@ts-ignore
            value = this.stockageImport.get(keyHash)+ademi.tonnage;
            valueRound = parseFloat(value.toFixed(3));
            this.stockageImport.set(keyHash,valueRound);
          }
          //Sinon on insére dans la hashMap
          //@ts-ignore
          this.stockageImport.set(keyHash,parseFloat(ademi.tonnage.toFixed(3)));
        }
      })
    });

    //on parcours la hashmap pour insertion en BDD
    this.stockageImport.forEach(async (value : number, key : String) => {
      await this.moralEntitiesService.createMeasure(key.split('_')[0],value,parseInt(key.split('_')[1]),parseInt(key.split('_')[2])).subscribe((response) =>{
        if (response == "Création du Measures OK"){
          Swal.fire("Les valeurs ont été insérées avec succès !");
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de l\'insertion des valeurs ....',
          })
        }
      })
    });
  }

  importProTruck(){
    alert("Protruck");
  }

  //Import tonnage via HODJA
  //? apres un nom de param signifie qu'il est optionnel
  recupHodja(form : NgForm){
    this.stockageHodja.clear();
    let dateDebFormat = new Date(), dateFinFormat = new Date();
    let listDate = [];

    dateDebFormat = new Date(form.value['dateDeb']);
    dateFinFormat = new Date(form.value['dateFin']);

    listDate = this.getDays(dateDebFormat,dateFinFormat);
    listDate.forEach(async day =>{
      await this.wait(100);
      //On récupère dans hodja les valeurs de bascule pour la période choisit (par défaut semaine en cours)
      this.moralEntitiesService.recupHodja(day,day).subscribe(async (response)=>{
        this.stockageHodja.clear();
        //console.log(day);
        this.valuesHodja = response;
        //ON boucle sur les valeurs HODJA
        for await (const valueHodja of this.valuesHodja){
          //ET les clients INOVEX
          for (const mr of this.moralEntities){
            //On regarde si le nom INOVEX sans la désignation du type de déchet est contenu dans le nom HODJA et si le début du code correspond
            let nameWithoutTypeDechet;
            if(mr.Name.toLowerCase().split(" - ").length>2){
              nameWithoutTypeDechet = mr.Name.toLowerCase().split(" - ")[1]+" - "+mr.Name.toLowerCase().split(" - ")[2];
            }
            else nameWithoutTypeDechet = mr.Name.toLowerCase().split(" - ")[1];
            if(valueHodja.client.toLowerCase().replace(/ /g,"") === nameWithoutTypeDechet.replace(/ /g,"") && mr.Code.startsWith(valueHodja.debCode)){
              //Si il y a correspondance alors on fait un traitement
              //Si il y a déjà une valeur dans la HashMap pour ce client, on incrémente la valeur
              if(this.stockageHodja.has(mr)){
                // @ts-ignore
                let value = this.stockageHodja.get(mr) + (valueHodja.TK_Poids_brut-valueHodja.TK_Poids_tare)/1000;//Pour avoir en tonnes et arrondir à 3 chiffres
                this.stockageHodja.set(mr,parseFloat(value.toFixed(3)));
              }
              //Sinon on insére tout simplement dans la HashMap
              else this.stockageHodja.set(mr,parseFloat(((valueHodja.TK_Poids_brut-valueHodja.TK_Poids_tare)/1000).toFixed(3)));//Pour avoir en tonnes et arrondir à 3 chiffres
            }
          }
          //await this.wait(100);
        }
        //On parcours la HashMap pour insérer en BDD
        this.stockageHodja.forEach(async (value : number, key : moralEntity) =>{
          await this.moralEntitiesService.createMeasure(day.split('/')[2]+'-'+day.split('/')[1]+'-'+day.split('/')[0],value,key.productId,key.Id).subscribe((response)=>{
            if (response == "Création du Measures OK"){
              Swal.fire("Recup HODJA OK");
            }
            else {
              Swal.fire({
                icon: 'error',
                text: 'Erreur lors de l\'insertion des valeurs ....',
              })
            }
          });
        })
        await this.wait(350);
      });
    })
  }


}

