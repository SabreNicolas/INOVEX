import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";
import { category } from 'src/models/categories.model';
import Swal from 'sweetalert2';
import {NgForm} from "@angular/forms";
import {product} from "../../models/products.model";
import {moralEntitiesService} from "../services/moralentities.service";

@Component({
  selector: 'app-analyses',
  templateUrl: './analyses.component.html',
  styleUrls: ['./analyses.component.scss']
})
export class AnalysesComponent implements OnInit {

  public listCategories : category[];
  public listAnalyses : product [];
  public Code : string;
  public listDays : string;

  constructor(private productsService : productsService, private categoriesService : categoriesService, private mrService : moralEntitiesService) {
    this.listCategories = [];
    this.listAnalyses = [];
    this.Code = '';
    this.listDays = '';
  }

  ngOnInit(): void {
    this.categoriesService.getCategoriesAnalyses().subscribe((response)=>{
      // @ts-ignore
      this.listCategories = response.data;
    });

    this.productsService.getAnalyses(this.Code).subscribe((response)=>{
      // @ts-ignore
      this.listAnalyses = response.data;
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
    this.listDays = '';
    var date = new Date(form.value['dateDeb']);
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');
    this.listDays = dd + '/' + mm + '/' + yyyy;
    this.getValues();
  }

  //changer les dates pour saisir le mois en cours
  setLastMonth(form: NgForm){
    var date = new Date();
    var mm = String(date.getMonth()).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    var Lastday = yyyy + '-' + mm;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = Lastday;
    form.value['dateDeb'] = Lastday;
    this.setPeriod(form);
  }

  //récupérer les valeurs en BDD
  getValues() {
    this.listAnalyses.forEach(an => {
      this.productsService.getValueProducts(this.listDays.substr(6, 4) + '-' + this.listDays.substr(3, 2) + '-' + this.listDays.substr(0, 2),an.Id).subscribe((response) => {
        if (response.data[0] != undefined && response.data[0].Value != 0) {
          (<HTMLInputElement>document.getElementById(an.Id + '-' + this.listDays)).value = response.data[0].Value;
        }
        else (<HTMLInputElement>document.getElementById(an.Id + '-' + this.listDays)).value = '';
      });
    });
  }

  //valider les saisies
  validation(){
    this.listAnalyses.forEach(an =>{
      var value = (<HTMLInputElement>document.getElementById(an.Id+'-'+this.listDays)).value.replace(',','.');
      var valueInt : number = +value;
      if (valueInt >0.0){
        this.mrService.createMeasure(this.listDays.substr(6,4)+'-'+this.listDays.substr(3,2)+'-'+this.listDays.substr(0,2),valueInt,an.Id,0).subscribe((response)=>{
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
      else {
        Swal.fire({
          icon: 'error',
          text: 'Un 0 a été saisi, il ne sera pas pris en compte ... Veuillez utiliser la poubelle pour supprimer la valeur !',
        })
      }
    })
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

}
