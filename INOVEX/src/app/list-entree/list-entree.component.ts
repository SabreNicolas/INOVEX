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

@Component({
  selector: 'app-list-entree',
  templateUrl: './list-entree.component.html',
  styleUrls: ['./list-entree.component.scss']
})
export class ListEntreeComponent implements OnInit {

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
  //stockage données ADEMI à envoyer
  public stockageImport : Map<String,number>;
  //**HODJA
  public valuesHodja : valueHodja[];
  //stockage données HODJA à envoyer
  public stockageHodja : Map<moralEntity,number>;
  

  constructor(private moralEntitiesService : moralEntitiesService, private productsService : productsService, private Papa : Papa, private dateService : dateService) {
    this.debCode = '20';
    this.moralEntities = [];
    this.listDays = [];
    this.listTotal = [];
    this.monthCall = 0;
    this.listTypeDechetsCollecteurs = [];
    this.listTypeDechets = [];
    this.typeImportTonnage = '';
    this.csvArray = [];
    this.stockageImport = new Map();
    //**HODJA
    this.valuesHodja = [];
    this.stockageHodja = new Map();
    this.correspondance = [];
    this.productsEntrants = [];
  }

  ngOnInit(): void {
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
    console.log(this.debCode)
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
    if( (this.dateFin.getTime()-this.dateDeb.getTime())/(1000*60*60*24) > 29){
      this.loading();
    }
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
  Products Entrants
   */
  //récupérer les valeurs en BDD pour Products Entrants
  getValuesProduct(idProduct : number){
    this.listDays.forEach(date => {
      // @ts-ignore
      this.productsService.getValueProducts(date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2), idProduct).subscribe((response) => {
        console.log(response.data);
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
        var valueInt : number = +value;
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
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element,{raw:false,dateNF:'mm/dd/yyyy'}); //Attention les jours sont considérés comme mois !!!!

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entrants');

    /* save to file */
    XLSX.writeFile(wb, 'entrants.xlsx');
  }

  //import tonnage via fichier
  import(event : Event){
    //Pithiviers/chinon
    if (this.typeImportTonnage.toLowerCase().includes("ademi")){
      //delimiter,header,client,typedechet,dateEntree,tonnage
      this.lectureCSV(event, ";", false, 8, 7, 2, 5);
    }
    //Noyelles-sous-lens
    else if (this.typeImportTonnage.toLowerCase().includes("protruck")){
      //delimiter,header,client,typedechet,dateEntree,tonnage
      this.lectureCSV(event, ";", false, 6, 31, 2, 16);
    }
    //Saint-Saulve
    else if (this.typeImportTonnage.toLowerCase().includes("dpk")){
      //delimiter,header,client,typedechet,dateEntree,tonnage
      this.lectureCSV(event, ";", false, 21, 20, 7, 19);
    }
    //Calce
    else if (this.typeImportTonnage.toLowerCase().includes("informatique verte")){
      //delimiter,header,client,typedechet,dateEntree,tonnage
      this.lectureCSV(event, ";", false, 19, 22, 10, 8);
    }
    else if (this.typeImportTonnage.toLowerCase().includes("tradim")){
      //delimiter,header,client,typedechet,dateEntree,tonnage
      this.lectureCSV(event, ";", false, 8, 6, 0, 5);
    }
  }

  //import tonnage via fichier
  //Traitement du fichier csv ADEMI
  lectureCSV(event : Event, delimiter : string, header : boolean, posClient : number, posTypeDechet : number, posDateEntree : number, posTonnage : number){
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
        delimiter: delimiter,
        header: header,
        complete: (results) => {
          for (let i = 0; i < results.data.length; i++) {
            //ON récupére les lignes infos nécessaires pour chaque ligne du csv
            //ON récupère uniquement les types de déchets pour les entrants

            // if(this.typeImportTonnage.toLowerCase().includes("protruck")){
            //   results.data[i][posTypeDechet] = results.data[i][posTypeDechet].split(" - ")[0];
            // }
            console.log(results.data[i][posClient])
            //Création de l'objet qui contient l'ensemble des infos nécessaires
            let importCSV = {
              client: results.data[i][posClient],
              typeDechet: results.data[i][posTypeDechet],
              dateEntree : results.data[i][posDateEntree].substring(0,10),
              tonnage : +results.data[i][posTonnage].replace(/[^0-9]/g,"")/1000,
            };
            this.csvArray.push(importCSV);
          }
          //console.log(this.csvArray);
          this.insertTonnageCSV();
        }
      });
    }
  }

  //Insertion du tonnage récupéré depuis le fichier csv ADEMI
  insertTonnageCSV(){
    this.debCode = '20';
    this.stockageImport.clear();
    
    this.correspondance.forEach(correspondance => {
        this.csvArray.forEach(csv => {
        
          csv.client = csv.client.toLowerCase().replace(/\s/g,"");
          csv.typeDechet = csv.typeDechet.toLowerCase().replace(/\s/g,"");
          correspondance.nomImport = correspondance.nomImport.toLowerCase().replace(/\s/g,"");
          correspondance.productImport = correspondance.productImport.toLowerCase().replace(/\s/g,"");

          //Si il y a correspondance on fait traitement
          if( correspondance.nomImport == csv.client && correspondance.productImport == csv.typeDechet /*|| (mr.produit == "dib/dea" && mr.produit.includes(csv.typeDechet)))*/ ){  
            let formatDate = csv.dateEntree.split('/')[2]+'-'+csv.dateEntree.split('/')[1]+'-'+csv.dateEntree.split('/')[0];
            let keyHash = formatDate+'_'+correspondance.ProductId+'_'+correspondance.ProducerId;
            //si il y a deja une valeur dans la hashMap pour ce client et ce jour, on incrémente la valeur
            let value, valueRound;
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
        });
    });
    //debug
    //console.log(this.stockageImport);
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

  //Import tonnage via HODJA
  recupHodja(form : NgForm){
    this.stockageHodja.clear();
    let dateDebFormat = new Date(), dateFinFormat = new Date();
    let listDate = [];

    dateDebFormat = new Date(form.value['dateDeb']);
    dateFinFormat = new Date(form.value['dateFin']);

    listDate = this.dateService.getDays(dateDebFormat,dateFinFormat);
    listDate.forEach(async day =>{
      await this.wait(100);
      //On récupère dans hodja les valeurs de bascule pour la période choisit
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
            if(mr.Name.toLowerCase().split("-").length>2){
              nameWithoutTypeDechet = mr.Name.toLowerCase().split("-")[1]+"-"+mr.Name.toLowerCase().split("-")[2];
            }
            else nameWithoutTypeDechet = mr.Name.toLowerCase().split("-")[1];
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

