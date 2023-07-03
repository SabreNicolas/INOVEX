import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";
import { category } from 'src/models/categories.model';
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";
import * as XLSX from 'xlsx';
import { dateService } from '../services/date.service';
import { moralEntitiesService } from '../services/moralentities.service';

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

  constructor(private productsService : productsService, private categoriesService : categoriesService, private dateService : dateService, private mrService : moralEntitiesService) {
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

  async setPeriod(form: NgForm){
    this.listDays = [];
    this.dateDeb = new Date((<HTMLInputElement>document.getElementById("dateDeb")).value);
    this.dateFin = new Date((<HTMLInputElement>document.getElementById("dateFin")).value);
    if(this.dateFin < this.dateDeb){
      this.dateService.mauvaiseEntreeDate(form);
    }
    if( (this.dateFin.getTime()-this.dateDeb.getTime())/(1000*60*60*24) >= 29){
      this.loading();
    }
    this.listDays = this.dateService.getDays(this.dateDeb, this.dateFin);
    await this.getValues();
    this.removeloading();
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
  async setCurrentMonth(form: NgForm){
    this.loading();
    this.dateService.setCurrentMonth(form);
    await this.setPeriod(form);     
    this.removeloading();
  }

  /**
   * FIN PARTIE SAISIE JOUR
  */

  //récupérer les valeurs en BDD
  async getValues(){
    let i = 0;
    for (const date of this.listDays){
      for (const pr of this.listCompteurs){
        i++;
        //temporisation toutes les 400 req pour libérer de l'espace
        if(i >= 400){
          i=0;
          await this.wait(500);
        }
        this.productsService.getValueProducts(date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2), pr.Id).subscribe((response) => {
          if (response.data[0] != undefined && response.data[0].Value != 0) {
            (<HTMLInputElement>document.getElementById(pr.Id + '-' + date)).value = response.data[0].Value;
          }
          else (<HTMLInputElement>document.getElementById(pr.Id + '-' + date)).value = '';
        });
      }
    }
  }

  //valider les saisies
  validation(){
    this.listDays.forEach(date => {
      this.listCompteurs.forEach(pr =>{
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
