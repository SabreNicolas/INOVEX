import { Component, OnInit } from '@angular/core';
import {arretsService} from "../services/arrets.service";
import {productsService} from "../services/products.service";
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-arrets',
  templateUrl: './arrets.component.html',
  styleUrls: ['./arrets.component.scss']
})
export class ArretsComponent implements OnInit {

  public listArrets : product[];
  public arretName : string;
  public arretId : number;
  public dateDebut : Date | undefined;
  public dateFin : Date | undefined;
  public duree : number;
  public dateSaisie : Date;

  constructor(private arretsService : arretsService, private productsService : productsService,) {
    this.listArrets = [];
    this.arretId = 0;
    this.arretName = '';
    this.duree = 0;
    this.dateSaisie = new Date();
  }

  ngOnInit(): void {
    this.productsService.getCompteurs("303020").subscribe((response)=>{
      // @ts-ignore
      this.listArrets = response.data;
    });
  }

  //on stocke le type d'arrêt sélectionné
  setFilters(){
    var type = document.getElementById("type");
    // @ts-ignore
    this.arretName = type.options[type.selectedIndex].text;
    // @ts-ignore
    this.arretId = type.options[type.selectedIndex].value;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  //calcul de la durée de l'arrêt en heure
  setDuree(form : NgForm){
    this.dateDebut = new Date(form.value['dateDeb']);
    this.dateFin = new Date(form.value['dateFin']);
    // @ts-ignore
    this.duree = ((this.dateFin-this.dateDebut)/1000)/3600; //conversion de millisecondes vers heures
  }

  //création de l'arrêt en base
  onSubmit(form : NgForm){
    alert("OK");
  }

}
