import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public typeId : number;
  public listProducts : product[];
  public name : string;
  public listId : number[];

  constructor(private productsService : productsService) {
    this.typeId = 4;
    this.listProducts = [];
    this.name ="";
    this.listId = [];
  }

  ngOnInit(): void {
    this.getProducts();
  }

  setFilters(){
    /* Début prise en compte des filtres*/
    var typeElt = document.getElementById("type");
    // @ts-ignore
    var typeSel = typeElt.options[typeElt.selectedIndex].value;
    var name = (<HTMLInputElement>document.getElementById('name')).value;
    this.typeId = typeSel;
    this.name = name;
    /*Fin de prise en commpte des filtres */
    this.getProducts();
  }

  getProducts(){
    this.productsService.getAllProductsByType(this.typeId,this.name).subscribe((response)=>{
      // @ts-ignore
      this.listProducts = response.data;
    });
  }

  //désactiver un produit
  setVisibility(idPR : number, visibility : number){
    this.productsService.setEnabled(idPR,visibility).subscribe((response)=>{
      if (response == "Changement de visibilité du client OK"){
        Swal.fire("La visibilité à bien été mise à jour");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors du changement de visibilité du produit ....',
        })
      }
    });
    this.getProducts();
  }

  //mise à jour de l'unité
  setUnit(PR : product){
    var unit = prompt('Veuillez saisir une unité',String(PR.Unit));
    if (unit == null) {
      return; //break out of the function early
    }
    // @ts-ignore
    this.productsService.setUnit(unit,PR.Id).subscribe((response)=>{
      if (response == "Mise à jour de l'unité OK"){
        Swal.fire("L'unité a été mise à jour !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour de l\'unité ....',
        })
      }
    });
    this.getProducts();
  }

  //mise à jour du type
  setType(PR : product){
    var type = prompt('2 pour Consommable, 3 pour Niveau, 4 pour Compteur, 5 pour Sortie, 6 pour Analyse',String(PR.typeId));
    // @ts-ignore
    if (type < 1 ) {
      return; //break out of the function early
    }
    // @ts-ignore
    this.productsService.setType(type,PR.Id).subscribe((response)=>{
      if (response == "Changement de catégorie du produit OK"){
        Swal.fire("Le type a été changé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du type ....',
        })
      }
    });
    this.getProducts();
  }

  //permet de stocker les Id des products pour lesquelles il faut changer le type
  addPr(Id : number){
    // @ts-ignore
    if (document.getElementById(""+Id).checked == true) {
      this.listId.push(Id);
    }
    else this.listId.splice(this.listId.indexOf(Id),1);
  }

  changeAllType(){
    var type = prompt('2 pour Consommable, 3 pour Niveau, 4 pour Compteur, 5 pour Sortie, 6 pour Analyse','0');
    // @ts-ignore
    if (type < 1) {
      return; //break out of the function early
    }
    for(var i= 0; i < this.listId.length; i++)
    {
      // @ts-ignore
      this.productsService.setType(type,this.listId[i]).subscribe((response)=>{
        if (response == "Changement de catégorie du produit OK"){
          Swal.fire("Le type a été changé !");
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la mise à jour du type ....',
          })
        }
      });
      this.getProducts();
    }
    this.listId = [];
    Swal.fire("Le type a été mis à jour !");
  }

}
