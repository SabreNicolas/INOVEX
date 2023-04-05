import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";
import { category } from 'src/models/categories.model';
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";
import * as XLSX from 'xlsx';

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

  constructor(private productsService : productsService, private categoriesService : categoriesService) {
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
      var date = new Date(form.value['dateDeb']);
      var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = date.getFullYear();
      var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');
      this.listDays.push(dd + '/' + mm + '/' + yyyy);
    }
    else {
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
    }
    this.getValues();
  }

  //changer les dates pour saisir le mois précédent
  setLastMonth(form: NgForm){
    var date = new Date();
    var mm : String;
    var yyyy : number;
    if (date.getMonth() === 0){
      mm = "12";
      yyyy = date.getFullYear()-1;
    }
    else {
      mm = String(date.getMonth()).padStart(2, '0'); //January is 0!
      yyyy = date.getFullYear();
    }

    var Lastday = yyyy + '-' + mm;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = Lastday;
    form.value['dateDeb'] = Lastday;
    this.setPeriod(form);
  }

  //afficher le dernier jour de chaque mois de l'année en cours
  setYear(){
    this.listDays = [];
    var date = new Date();
    var yyyy = date.getFullYear();
    for (let i = 1; i < 13; i++) {
      var dd = String(new Date(yyyy, i, 0).getDate()).padStart(2, '0');
      if(i<10){
        this.listDays.push(dd + '/' + 0+i + '/' + yyyy);
      }
      else this.listDays.push(dd + '/' + i + '/' + yyyy);
    }
    this.getValues();
  }

  //afficher le dernier jour de chaque mois de l'année en cours
  setLastYear(){
    this.listDays = [];
    var date = new Date();
    var yyyy = date.getFullYear()-1;
    for (let i = 1; i < 13; i++) {
      var dd = String(new Date(yyyy, i, 0).getDate()).padStart(2, '0');
      if(i<10){
        this.listDays.push(dd + '/' + 0+i + '/' + yyyy);
      }
      else this.listDays.push(dd + '/' + i + '/' + yyyy);
    }
    this.getValues();
  }

  /**
   * PARTIE SAISIE JOUR
  */

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

  //changer les dates pour saisir hier
  setYesterday(form: NgForm){
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
