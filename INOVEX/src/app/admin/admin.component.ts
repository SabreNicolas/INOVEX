import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";
import {moralEntity} from "../../models/moralEntity.model";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public typeId : number;
  public listProducts : product[];

  constructor(private productsService : productsService) {
    this.typeId = 0;
    this.listProducts = [];
  }

  ngOnInit(): void {
    // @ts-ignore
    while (mdp != "admin") {
      var mdp = prompt("Veuillez saisir le mot de passe pour accéder à l'interface d'Administration :");
    }
    this.getProducts();
  }

  setFilters(){
    /* Début prise en compte des filtres*/
    var typeElt = document.getElementById("type");
    // @ts-ignore
    var typeSel = typeElt.options[typeElt.selectedIndex].value;

    this.typeId = typeSel;
    /*Fin de prise en commpte des filtres */
    this.getProducts();
  }

  getProducts(){
    this.productsService.getAllProductsByType(this.typeId).subscribe((response)=>{
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

}
