import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";
import { category } from 'src/models/categories.model';
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";
import * as XLSX from 'xlsx';
import { dateService } from '../services/date.service';

@Component({
  selector: 'app-list-compteurs',
  templateUrl: './list-compteurs.component.html',
  styleUrls: ['./list-compteurs.component.scss']
})
export class ListCompteursComponent implements OnInit {

  public listCategories : category[];
  public listCompteurs : product[];
  public Code : string;
  public listDays : string[];
  public idUsine : number | undefined;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;

  constructor(private productsService : productsService, private categoriesService : categoriesService, private dateService : dateService) {
    this.listCategories = [];
    this.listCompteurs = [];
    this.Code = '';
    this.listDays = [];

    //Récupération du user dans localStorage
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
        var userLoggedParse = JSON.parse(userLogged);

        //Récupération de l'idUsine
        // @ts-ignore
        this.idUsine = userLoggedParse['idUsine'];
    }
  }

  ngOnInit(): void { 
    this.categoriesService.getCategories().subscribe((response)=>{
      // @ts-ignore
      this.listCategories = response.data;
    });

    this.productsService.getCompteurs(this.Code).subscribe((response)=>{
      // @ts-ignore
      this.listCompteurs = response.data;
      this.getValues();
    });
  }
  
  //Fonction pour attendre
  wait(ms : number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
  
  setFilters(){
    var codeCat = document.getElementById("categorie");
    // @ts-ignore
    var codeCatSel = codeCat.options[codeCat.selectedIndex].value;
    this.Code = codeCatSel;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  setPeriod(form: NgForm){
    this.listDays = [];
    if(this.idUsine !=2 ){
      if(form.value['dateDeb'] != ''){
        var date = new Date(form.value['dateDeb']);
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');
        this.listDays.push(dd + '/' + mm + '/' + yyyy);
      }
      else{
        Swal.fire({
          icon: 'error',
          text: 'Date invalide',
        })
      }
      
    }
    else {
    this.dateDeb = new Date((<HTMLInputElement>document.getElementById("dateDeb")).value);
    this.dateFin = new Date((<HTMLInputElement>document.getElementById("dateFin")).value);
      if (this.dateFin < this.dateDeb) {
        this.dateService.mauvaiseEntreeDate(form);
      }
      this.listDays = this.dateService.getDays(this.dateDeb, this.dateFin);
    }
    this.getValues();
  }

  //changer les dates pour saisir le mois précédent
  setLastMonth(form: NgForm){
    this.dateService.setLastMonth(form);
    this.setPeriod(form);
  }

  //afficher le dernier jour de chaque mois de l'année en cours
  setYear(){
    this.listDays = this.dateService.setYear();
    this.getValues();
  }

  //afficher le dernier jour de chaque mois de l'année en cours
  setLastYear(){
    this.listDays = this.dateService.setLastYear();
    this.getValues();
  }

  /**
   * PARTIE SAISIE JOUR
  */


  //changer les dates pour saisir hier
  setYesterday(form: NgForm){
    this.dateService.setYesterday(form);
    this.setPeriod(form);
  }

  //changer les dates pour saisir la semaine en cours
  setCurrentWeek(form: NgForm){
    this.dateService.setCurrentWeek(form);
    this.setPeriod(form);
  }

  //changer les dates pour saisir le mois en cours
  setCurrentMonth(form: NgForm){
    this.dateService.setCurrentMonth(form);
    this.setPeriod(form);
  }

  /**
   * FIN PARTIE SAISIE JOUR
  */

  //récupérer les valeurs en BDD
  getValues() {
    this.listCompteurs.forEach(cp => {
      this.listDays.forEach(day => {
        this.productsService.getValueCompteurs(day.substr(6, 4) + '-' + day.substr(3, 2) + '-' + day.substr(0, 2),cp.Code).subscribe((response) => {
          if (response.data[0] != undefined && response.data[0].Value != 0) {
            (<HTMLInputElement>document.getElementById(cp.Code + '-' + day)).value = response.data[0].Value;
            (<HTMLInputElement>document.getElementById('export-'+cp.Code + '-' + day)).innerHTML = response.data[0].Value;
          } else (<HTMLInputElement>document.getElementById(cp.Code + '-' + day)).value = '';
        });
      });
    });
  }

  //valider les saisies
  validation(){
    this.listCompteurs.forEach(cp =>{
      this.listDays.forEach(day => {
        var value = (<HTMLInputElement>document.getElementById(cp.Code + '-' + day)).value.replace(',', '.');
        var valueInt: number = +value;
        if (valueInt > 0.0) {
          this.productsService.createMeasure(day.substr(6, 4) + '-' + day.substr(3, 2) + '-' + day.substr(0, 2), valueInt, cp.Code).subscribe((response) => {
            if (response == "Création du saisiemensuelle OK") {
              Swal.fire("Les valeurs ont été insérées avec succès !");
            } else {
              Swal.fire({
                icon: 'error',
                text: 'Erreur lors de l\'insertion des valeurs ....',
              })
            }
          });
        }
      });
    });
  }

  //mettre à 0 la value pour modificiation
  delete(Code : string, date : string){
    this.productsService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),0,Code).subscribe((response)=>{
      if (response == "Création du saisiemensuelle OK"){
        Swal.fire("La valeur a bien été supprimé !");
        (<HTMLInputElement>document.getElementById(Code + '-' + date)).value = '';
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de la valeur ....',
        })
      }
    });
  }


  //Export de la table dans fichier EXCEL
  exportExcel(){
    /* table id is passed over here */
    let element = document.getElementById('listCompteurs');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element,{raw:false,dateNF:'mm/dd/yyyy'}); //Attention les jours sont considérés comme mois !!!!

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Comppteurs');

    /* save to file */
    XLSX.writeFile(wb, 'compteurs.xlsx');
  }

}
