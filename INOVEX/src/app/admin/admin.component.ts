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
      console.log(this.listProducts);
    });
  }

}
