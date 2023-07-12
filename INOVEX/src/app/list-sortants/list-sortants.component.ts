import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";
import { category } from 'src/models/categories.model';
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";
import {moralEntitiesService} from "../services/moralentities.service";
import { dateService } from '../services/date.service';
//Librairie pour lire les csv importés
import {Papa} from 'ngx-papaparse';
import { dechetsCollecteurs } from 'src/models/dechetsCollecteurs.model';
import { importCSV } from 'src/models/importCSV.model';

@Component({
  selector: 'app-list-sortants',
  templateUrl: './list-sortants.component.html',
  styleUrls: ['./list-sortants.component.scss']
})
export class ListSortantsComponent implements OnInit {

  public listProducts : product[];
  public listCategories : category[];
  public debCode : string;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;
  public listDays : string[];
  public typeImportTonnage : string;
  public csvArray : importCSV[];
  public stockageImport : Map<String,number>;
  public correspondance : any[];



  constructor(private productsService : productsService, private categoriesService : categoriesService, private Papa : Papa, private mrService : moralEntitiesService,private dateService : dateService) {
    this.debCode = '';
    this.listProducts = [];
    this.listDays = [];
    this.listCategories = [];
    this.typeImportTonnage = '';
    this.csvArray = [];
    this.stockageImport = new Map();
    this.correspondance = [];
  }

  ngOnInit(): void {
    this.categoriesService.getCategoriesSortants().subscribe((response)=>{
      // @ts-ignore
      this.listCategories = response.data;
    });

    this.mrService.GetImportTonnage().subscribe((response)=>{
      //@ts-ignore
      this.typeImportTonnage = response.data[0].typeImport;
    });

    this.getCorrespondance();

    this.productsService.getSortants(this.debCode).subscribe((response)=>{
      // @ts-ignore
      this.listProducts = response.data;
      this.getValues();
    });
  }

  setFilters(){
    var codeCat = document.getElementById("categorie");
    // @ts-ignore
    var codeCatSel = codeCat.options[codeCat.selectedIndex].value;
    this.debCode = codeCatSel;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  setPeriod(form: NgForm){
    this.listDays = [];
    this.dateDeb = new Date((<HTMLInputElement>document.getElementById("dateDeb")).value);
    this.dateFin = new Date((<HTMLInputElement>document.getElementById("dateFin")).value);
    if(this.dateFin < this.dateDeb){
      this.dateService.mauvaiseEntreeDate(form);
    }
    this.listDays = this.dateService.getDays(this.dateDeb, this.dateFin);
    this.getValues();
  }



  //récupérer les tonnages en BDD
  getValues(){
    this.listDays.forEach(date => {
      this.listProducts.forEach(pr => {
        this.productsService.getValueProducts(date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2), pr.Id).subscribe((response) => {
          if (response.data[0] != undefined && response.data[0].Value != 0) {
            (<HTMLInputElement>document.getElementById(pr.Id + '-' + date)).value = response.data[0].Value;
          }
          else (<HTMLInputElement>document.getElementById(pr.Id + '-' + date)).value = '';
        });
      });
    });
  }

  //valider les saisies
  validation(){
    this.listDays.forEach(date => {
      this.listProducts.forEach(pr =>{
        var value = (<HTMLInputElement>document.getElementById(pr.Id+'-'+date)).value.replace(',','.');
        var valueInt : number = +value;
        if (valueInt >0.0){
          this.mrService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),valueInt,pr.Id,0).subscribe((response)=>{
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

  //changer les dates pour saisir hier
  setYesterday(form: NgForm){
    this.dateService.setYesterday(form);
    this.setPeriod(form);
    //this.dateService.resetForm(form);
  }

  //changer les dates pour saisir la semaine en cours
  setCurrentWeek(form: NgForm){
    this.dateService.setCurrentWeek(form);
    this.setPeriod(form);
    // this.dateService.resetForm(form);
  }

  //changer les dates pour saisir le mois en cours
  setCurrentMonth(form: NgForm){
    this.dateService.setCurrentMonth(form);
    this.setPeriod(form);
    // this.dateService.resetForm(form);
  }


  //mettre à 0 la value pour modificiation
  delete(Id : number, date : string){
    this.mrService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),0,Id,0).subscribe((response)=>{
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

  /**
   * IMPORT CSV
   */

    //import tonnage via fichier
    import(event : Event){
      //Pithiviers/chinon
      if (this.typeImportTonnage.toLowerCase().includes("ademi")){
        //delimiter,header,typedechet,dateEntree,tonnage
        this.lectureCSV(event, ";", false, 7, 2, 5);
      }
      //Noyelles-sous-lens
      else if (this.typeImportTonnage.toLowerCase().includes("protruck")){
        //delimiter,header,typedechet,dateEntree,tonnage
        this.lectureCSV(event, ";", false, 31, 2, 16);
      }
      //Saint-Saulve
      else if (this.typeImportTonnage.toLowerCase().includes("dpk")){
        //delimiter,header,typedechet,dateEntree,tonnage
        this.lectureCSV(event, ";", false,  20, 7, 19);
      }
      //Calce
      else if (this.typeImportTonnage.toLowerCase().includes("informatique verte")){
        //delimiter,header,typedechet,dateEntree,tonnage
        this.lectureCSV(event, ";", false, 22, 10, 8);
      }
      else if (this.typeImportTonnage.toLowerCase().includes("tradim")){
        //delimiter,header,typedechet,dateEntree,tonnage
        this.lectureCSV(event, ";", false, 6, 0, 5);
      }
    }

    //import tonnage via fichier
  //Traitement du fichier csv ADEMI
  lectureCSV(event : Event, delimiter : string, header : boolean,  posTypeDechet : number, posDateEntree : number, posTonnage : number){
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
            //Création de l'objet qui contient l'ensemble des infos nécessaires
            let importCSV = {
              client : "Aucun",
              typeDechet: results.data[i][posTypeDechet],
              dateEntree : results.data[i][posDateEntree].substring(0,10),
              tonnage : +results.data[i][posTonnage].replace(/[^0-9]/g,"")/1000,
            };
            this.csvArray.push(importCSV);
          }
          console.log(this.csvArray);
          this.insertTonnageCSV();
        }
      });
    }
  }

  getCorrespondance(){
    this.mrService.getCorrespondanceSortants().subscribe((response)=>{
      // console.log(response)
      // @ts-ignore
      this.correspondance = response.data;
      console.log(this.correspondance);
    });
  }

  //Insertion du tonnage récupéré depuis le fichier csv ADEMI
  insertTonnageCSV(){
    this.debCode = '20';
    this.stockageImport.clear();
    this.correspondance.forEach(correspondance => {
        this.csvArray.forEach(csv => {
        
          csv.typeDechet = csv.typeDechet.toLowerCase().replace(/\s/g,"");
          correspondance.productImport = correspondance.productImport.toLowerCase().replace(/\s/g,"");  
          //Si il y a correspondance on fait traitement
          if( correspondance.productImport == csv.typeDechet ){
            let formatDate = csv.dateEntree.split('/')[2]+'-'+csv.dateEntree.split('/')[1]+'-'+csv.dateEntree.split('/')[0];
            let keyHash = formatDate+'_'+correspondance.ProductId;
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
    console.log(this.stockageImport)
    this.stockageImport.forEach(async (value : number, key : String) => {
      await this.mrService.createMeasure(key.split('_')[0],value,parseInt(key.split('_')[1]),0).subscribe((response) =>{
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
}
