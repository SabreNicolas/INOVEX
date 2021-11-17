import { Component, OnInit } from '@angular/core';
import {arretsService} from "../services/arrets.service";
import {productsService} from "../services/products.service";
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import { DatePipe } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-arrets',
  templateUrl: './arrets.component.html',
  styleUrls: ['./arrets.component.scss']
})

/**
 * ATTENTION : Component utilisé également pour la saisie des dépassements 1/2 heures
 *
 */

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
  public isArret : boolean = false; // 'true' si on saisie des arrêts et 'false' si dépassements

  constructor(private arretsService : arretsService, private productsService : productsService, private datePipe : DatePipe, private route : ActivatedRoute, private router : Router) {
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false; //permet de recharger le component au changement de paramètre
    this.listArrets = [];
    this.arretId = 0;
    this.arretName = '';
    this.duree = 0;
    this.dateSaisie = new Date();
    this.stringDateDebut = '';
    this.stringDateFin = '';
    this.stringDateSaisie = '';
    this.commentaire = '';
    this.route.queryParams.subscribe(params => {
      if(params.isArret.includes('true')){
        this.isArret = true;
      }
      else this.isArret = false;
    });

    if (this.isArret == true) {
      this.getProductsArrets("303020");
    }
    /**
     * Dépassements 1/2 heures
     */
    else {
      this.getProductsDep("60104");
    }
  }

  ngOnInit(): void {
  }

  getProductsArrets(Code : string){
    this.productsService.getCompteursArrets(Code).subscribe((response)=>{
      // @ts-ignore
      this.listArrets = response.data;
    });
  }

  getProductsDep(Code : string){
    this.productsService.getDep().subscribe((response)=>{
      // @ts-ignore
      this.listArrets = response.data;
    });
  }

  //on stocke le type d'arrêt/dépassement sélectionné
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

  //création de l'arrêt/dépassement en base
  onSubmit(form : NgForm){
    /*
    * DEBUT suppression des caractères suppression
    * */
    this.commentaire = form.value['desc'];
    this.commentaire = this.commentaire.replace("'"," ").toLowerCase();
    this.commentaire = this.commentaire.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g," ");
    /*
    * FIN suppression des caractères suppression
    * */
    this.transformDateFormat();
    if (this.isArret == true) {
      this.arretsService.createArret(this.stringDateDebut, this.stringDateFin, this.duree, 1, this.stringDateSaisie, this.commentaire, this.arretId).subscribe((response) => {
        if (response == "Création de l'arret OK") {
          Swal.fire("L'arrêt a bien été créé !");
          //envoi d'un mail si arrêt intempestif
          if (this.arretName.includes("intempestif")) {
            console.log(this.stringDateDebut);
            this.arretsService.sendEmail(this.stringDateDebut.substr(8, 2) + '-' + this.stringDateDebut.substr(5, 2) + '-' + this.stringDateDebut.substr(0, 4), this.stringDateDebut.substr(11, 5), this.duree, this.arretName, this.commentaire).subscribe((response) => {
              if (response == "mail OK") {
                Swal.fire("Un mail d'alerte à été envoyé !");
              } else {
                Swal.fire({
                  icon: 'error',
                  text: 'Erreur lors de l\'envoi du mail ....',
                })
              }
            });
            form.reset();
            this.arretId = 0;
            this.arretName = '';
            this.duree = 0;
          }
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la création de l\'arrêt .... Un même arrêt existe peut-être déjà pour ce jour',
          })
        }
      });
    }

    /**
     * Dépassements 1/2 heures
     */
    else {
      this.arretsService.createDepassement(this.stringDateDebut, this.stringDateFin, this.duree, 1, this.stringDateSaisie, this.commentaire, this.arretId).subscribe((response) => {
        if (response == "Création du DEP OK") {
          Swal.fire("Le dépassement a bien été créé !");
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la création du dépassement .... Un même dépassement existe peut-être déjà pour ce jour',
          })
        }
      });
    }
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
