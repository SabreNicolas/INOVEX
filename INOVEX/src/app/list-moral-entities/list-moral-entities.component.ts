import { Component, OnInit } from '@angular/core';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';
import {moralEntity} from "../../models/moralEntity.model";

@Component({
  selector: 'app-list-moral-entities',
  templateUrl: './list-moral-entities.component.html',
  styleUrls: ['./list-moral-entities.component.scss']
})
export class ListMoralEntitiesComponent implements OnInit {

  public moralEntities : moralEntity[];
  public debCode : string;
  public listId : number[];

  constructor(private moralEntitiesService : moralEntitiesService) {
    this.debCode = '';
    this.listId = [];
    this.moralEntities = [];
  }

  ngOnInit(): void {
    this.moralEntitiesService.getMoralEntities(this.debCode).subscribe((response)=>{
      // @ts-ignore
      this.moralEntities = response.data;
    });
  }

  setFilters(){
    /* Début prise en compte des filtres*/
    var produitElt = document.getElementById("produit");
    // @ts-ignore
    var produitSel = produitElt.options[produitElt.selectedIndex].value;
    var collecteurElt = document.getElementById("collecteur");
    // @ts-ignore
    var collecteurSel = collecteurElt.options[collecteurElt.selectedIndex].value;
    this.debCode = produitSel+collecteurSel;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  //mise à jour du code d'un client
  setCode(MR : moralEntity){
    var code = prompt('Veuillez saisir un Code',MR.Code);
    this.moralEntitiesService.setCode(code,MR.Id).subscribe((response)=>{
      if (response == "Mise à jour du code OK"){
        Swal.fire("Le Code a été mis à jour !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du Code ....',
        })
      }
    });
    this.ngOnInit();
  }

  //mise à jour du prix d'un client
  setPrice(MR : moralEntity){
    var prix = prompt('Veuillez saisir un Prix',String(MR.UnitPrice));
    // @ts-ignore
    this.moralEntitiesService.setPrix(prix.replace(',','.'),MR.Id).subscribe((response)=>{
      if (response == "Mise à jour du prix unitaire OK"){
        Swal.fire("Le Prix a été mis à jour !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du Prix ....',
        })
      }
    });
    this.ngOnInit();
  }

  //désactiver un client
  setDisabled(idMR : number){
    this.moralEntitiesService.setEnabled(idMR).subscribe((response)=>{
      if (response == "Désactivation du client OK"){
        Swal.fire("Le client a été désactivé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la désactivation du client ....',
        })
      }
    });
    this.ngOnInit();
  }

  //permet de stocker les Id des moralEntities pour lesquelles il faut changer le prix
  addMr(Id : number){
    // @ts-ignore
    if (document.getElementById(""+Id).checked == true) {
      this.listId.push(Id);
    }
    else this.listId.splice(this.listId.indexOf(Id),1);

    console.log(this.listId);
  }

  changeAllPrice(){
    var prix = prompt('Veuillez saisir un Prix','0');
    for(var i= 0; i < this.listId.length; i++)
    {
      // @ts-ignore
      this.moralEntitiesService.setPrix(prix.replace(',','.'),this.listId[i]).subscribe((response)=>{
        if (response == "Mise à jour du prix unitaire OK"){
          console.log("Le Prix a été mis à jour !");
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la mise à jour du Prix ....',
          })
        }
      });
    }
    this.listId = [];
    this.ngOnInit();
    Swal.fire("Le Prix a été mis à jour !");
  }


}