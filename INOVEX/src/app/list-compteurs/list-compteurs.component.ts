import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";
import { category } from 'src/models/categories.model';
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";

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

  constructor(private productsService : productsService, private categoriesService : categoriesService) {
    this.listCategories = [];
    this.listCompteurs = [];
    this.Code = '';
    this.listDays = [];
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
    var date = new Date(form.value['dateDeb']);
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');
    this.listDays.push(dd + '/' + mm + '/' + yyyy);
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

  //récupérer les valeurs en BDD
  getValues() {
    this.listCompteurs.forEach(cp => {
      this.listDays.forEach(day => {
        this.productsService.getValueCompteurs(day.substr(6, 4) + '-' + day.substr(3, 2) + '-' + day.substr(0, 2),cp.Code).subscribe((response) => {
          if (response.data[0] != undefined && response.data[0].Value != 0) {
            (<HTMLInputElement>document.getElementById(cp.Code + '-' + day)).value = response.data[0].Value;
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

}
