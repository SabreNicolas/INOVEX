import { Component, OnInit } from '@angular/core';
import {arretsService} from "../services/arrets.service";
import {productsService} from "../services/products.service";
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import { DatePipe } from '@angular/common';

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
  public stringDateDebut : string;
  public dateFin : Date | undefined;
  public stringDateFin : string;
  public duree : number;
  public dateSaisie : Date;
  public stringDateSaisie : string;
  public commentaire : string;

  constructor(private arretsService : arretsService, private productsService : productsService, private datePipe : DatePipe) {
    this.listArrets = [];
    this.arretId = 0;
    this.arretName = '';
    this.duree = 0;
    this.dateSaisie = new Date();
    this.stringDateDebut = '';
    this.stringDateFin = '';
    this.stringDateSaisie = '';
    this.commentaire = '';
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
    if (this.dateFin < this.dateDebut) {
      this.duree = 0;
      form.controls['dateFin'].reset();
      form.value['dateFin'] = '';
      Swal.fire({
        icon: 'error',
        text: 'La date/heure de Fin est inférieure à la date/heure de Départ !',
      })
    }
    // @ts-ignore
    else this.duree = ((this.dateFin-this.dateDebut)/1000)/3600; //conversion de millisecondes vers heures
  }

  //création de l'arrêt en base
  onSubmit(form : NgForm){
    this.commentaire = form.value['desc'];
    this.transformDateFormat();
    this.arretsService.createArret(this.stringDateDebut,this.stringDateFin,this.duree,1,this.stringDateSaisie,this.commentaire,this.arretId).subscribe((response)=>{
      if (response == "Création de l'arret OK"){
        Swal.fire("L'arrêt a bien été créé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la création de l\'arrêt ....',
        })
      }
    });
  }

  transformDateFormat(){
    // @ts-ignore
    this.stringDateDebut = this.datePipe.transform(this.dateDebut,'yyyy-MM-dd HH:mm');
    // @ts-ignore
    this.stringDateFin = this.datePipe.transform(this.dateFin,'yyyy-MM-dd HH:mm');
    // @ts-ignore
    this.stringDateSaisie = this.datePipe.transform(this.dateSaisie,'yyyy-MM-dd HH:mm');
  }

}
