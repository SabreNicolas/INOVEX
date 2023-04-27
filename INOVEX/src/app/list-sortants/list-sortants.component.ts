import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";
import { category } from 'src/models/categories.model';
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";
import {moralEntitiesService} from "../services/moralentities.service";
import { dateService } from '../services/date.service';

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

  constructor(private productsService : productsService, private categoriesService : categoriesService, private mrService : moralEntitiesService,private dateService : dateService) {
    this.debCode = '';
    this.listProducts = [];
    this.listDays = [];
    this.listCategories = [];
  }

  ngOnInit(): void {
    this.categoriesService.getCategoriesSortants().subscribe((response)=>{
      // @ts-ignore
      this.listCategories = response.data;
    });

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

}
