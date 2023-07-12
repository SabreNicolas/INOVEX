import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";
import {element} from "../../models/element.model";
import {rondierService} from "../services/rondier.service";
import { identifierModuleUrl } from '@angular/compiler';


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
  public listElements : element[];

  constructor(private productsService : productsService,private rondierService : rondierService) {
    this.typeId = 4;
    this.listProducts = [];
    this.name ="";
    this.listId = [];
    this.listElements =[];
  }

  ngOnInit(): void {
    this.getProducts();
    this.getElements();
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
    this.productsService.getAllProductsAndElementRondier(this.typeId,this.name).subscribe((response)=>{
      // @ts-ignore
      this.listProducts = response.data;
    });
  }

  getElements(){
    //Requête pour récupérer tout les éléments rondiers d'une usine qui sont en type valeur
    this.rondierService.getElementsOfUsine().subscribe((response)=>{
      // @ts-ignore
      this.listElements = response.data;
      // console.log(this.listElements)
    });
  }

  //désactiver un produit
  async setVisibility(idPR : number, visibility : number){
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
    await this.wait(5);
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

  //Fonction pour attendre
  wait(ms : number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  //Mise à jour du tag ou du codeEquipement d'un produit
  setElement(product : product,type : string){
    if(type=="CodeEquipement"){
      if(product.CodeEquipement == null){
        var saisie = prompt('Veuillez saisir un code GMAO','');
      }
      else var saisie = prompt('Veuillez saisir un code GMAO',String(product.CodeEquipement));
    }
    else {
      if(product.TAG == null){
        var saisie = prompt('Veuillez saisir un TAG','');
      }
      else var saisie = prompt('Veuillez saisir un TAG',String(product.TAG));
    }
    if(saisie == null) return;
    this.productsService.setElement(saisie,product.Id,type).subscribe((response)=>{
      if (response == "Mise à jour du Code OK"){
        Swal.fire("Le code GMAO a bien été affecté !");
        this.ngOnInit();
      }
      else if (response == "Mise à jour du TAG OK"){
        Swal.fire("Le TAG a bien été affecté !");
        this.ngOnInit();
      }
      else {
        Swal.fire({
          icon: 'error',
          text: "Erreur lors de l'affectation ....",
        })
      }
    });
  }
  updateTypeRecup(id : number, typeRecupEMonitoring : string){
    this.productsService.updateTypeRecup(id,typeRecupEMonitoring).subscribe((response)=>{
      if (response == "Changement du type de récupération OK"){
        Swal.fire("Le type a été changé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du type ....',
        })
      }
    });
  }

  //fonction qui permet de choisir l'élement rondier correspondant au produit pour la récupération automatique
  setElementRondier(pr : product){
    let listElementsRondier = {};
    //@ts-ignore
    listElementsRondier[0] = "Aucun"
    for(let i=0; i<this.listElements.length;i++){
      //@ts-ignore
      listElementsRondier[this.listElements[i]['Id']] = this.listElements[i]['nom']
    }
    Swal.fire({
      title: 'Veuillez choisir un élément rondier',
      input: 'select',
      inputOptions: listElementsRondier,
      showCancelButton: true,
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
      allowOutsideClick: false,
    })
    .then((result) => {
      if(result.value != undefined){
        this.rondierService.changeTypeRecupSetRondier(pr.Id,result.value).subscribe((response) =>{
          console.log("ok")
          this.ngOnInit();
        })
      }
    });
  }
}
