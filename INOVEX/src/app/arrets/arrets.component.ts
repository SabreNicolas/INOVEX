import { Component, OnInit } from '@angular/core';
import {arretsService} from "../services/arrets.service";
import {productsService} from "../services/products.service";
import {product} from "../../models/products.model";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import { DatePipe } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {user} from "../../models/user.model";

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

  private userLogged : user | undefined;
  public IdUser : number;
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
  public isTotal : boolean = false;
  public isArret : boolean = false; // 'true' si on saisie des arrêts et 'false' si dépassements
  public disponible : boolean = false;
  public programme : boolean = false;
  public fortuit : boolean = false;
  public fortuit_four : boolean = false;
  public fortuit_chaudiere : boolean = false;
  public fortuit_traitement : boolean = false;
  public fortuit_commun : boolean = false;
  public saisieLibre : string;

  constructor(private arretsService : arretsService, private productsService : productsService, private datePipe : DatePipe, private route : ActivatedRoute, private router : Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; //permet de recharger le component au changement de paramètre
    this.IdUser = 0;
    this.listArrets = [];
    this.arretId = 0;
    this.arretName = '';
    this.duree = 0;
    this.dateSaisie = new Date();
    this.stringDateDebut = '';
    this.stringDateFin = '';
    this.stringDateSaisie = '';
    this.commentaire = '_';
    this.saisieLibre ="";
    this.route.queryParams.subscribe(params => {
      //Si le params n'est pas précisé dans l'url on le force à TRUE
      if(params.isArret == undefined || params.isArret.includes('true')){
        this.isArret = true;
        this.getProductsArrets("30302");
      }
      /**
       * Dépassements 1/2 heures
       */
      else {
        this.isArret = false;
        this.getProductsDep("60104");
      }
    });
  }

  ngOnInit(): void {
    //Réupération de l'Id du user connecté
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      // @ts-ignore
      this.IdUser = this.userLogged['Id'];
    }
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

    //Vérification de si on saisie un total ou non pour affcher le bon formulaire
    if (this.arretName.includes("Total -")){
      this.isTotal = true;
    }
    else this.isTotal = false;

    this.disponible = false;
    this.fortuit = false;
    this.programme = false;
    this.fortuit_four = false;
    this.fortuit_chaudiere = false;
    this.fortuit_traitement = false;
    this.fortuit_commun = false;

    if(this.arretName.toLocaleLowerCase().includes("disponible")){
      this.disponible = true;
    }
    else if(this.arretName.toLocaleLowerCase().includes("fortuit") || this.arretName.toLocaleLowerCase().includes("intempestif")){
      this.fortuit = true;
      this.fortuit_four = true;
    }
    else if(this.arretName.toLocaleLowerCase().includes("programm")){
      this.programme = true;
    }
  }


  //Fonction permettant de séléctionner les sous-commentaire d'un arrêt
  //A modifier en cas d'ajout car ne fonction qu'avec fortuit
  setSousCommentaire(id : string){
    //Initialisation de toutes les variables à false
    this.fortuit_four = false;
    this.fortuit_chaudiere = false;
    this.fortuit_traitement = false;
    this.fortuit_commun = false;

    //On récupère la référence du select dont l'id est passé en paramètre
    var selection = document.getElementById(id);
    //On regarde quelle est la valeur sélectionnée et on met sa valeur à true pour afficher le sous-menu
    //@ts-ignore
    if(selection.options[selection.selectedIndex].value == "Four"){
      this.fortuit_four = true;
    }
    //@ts-ignore
    else if(selection.options[selection.selectedIndex].value == "Chaudière"){
      this.fortuit_chaudiere = true;
    }
    //@ts-ignore
    else if(selection.options[selection.selectedIndex].value == "Traitement des fumées"){
      this.fortuit_traitement = true;
    }
    //@ts-ignore
    else if(selection.options[selection.selectedIndex].value == "Communs auxiliaires"){
      this.fortuit_commun = true;
    }
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
    //SI pas TOTAL DEP on récupére le commentaire (les dates sont déjà stockées lors du calcul de la durée)
    if(!this.isTotal) {
      /*
      * DEBUT récupération commentaire
      * */
      if(this.disponible == true){
        var selection = document.getElementById("disponible");
        //@ts-ignore
        this.commentaire = selection.options[selection.selectedIndex].text
      }
      else if(this.fortuit == true){
        var selection = document.getElementById("fortuit");
        //@ts-ignore
        this.commentaire = selection.options[selection.selectedIndex].value;
        
        if(this.fortuit_chaudiere == true){
          var selection2 = document.getElementById("fortuit_chaudiere");
          //@ts-ignore
          this.commentaire =  this.commentaire + " - " + selection2.options[selection2.selectedIndex].value;
        }
        else if(this.fortuit_commun == true){
          var selection2 = document.getElementById("fortuit_commun");
          //@ts-ignore
          this.commentaire =  this.commentaire + " - " + selection2.options[selection2.selectedIndex].value;
        }
        else if(this.fortuit_four == true){
          var selection2 = document.getElementById("fortuit_four");
          //@ts-ignore
          this.commentaire =  this.commentaire + " - " + selection2.options[selection2.selectedIndex].value;
        }
        else {
          var selection2 = document.getElementById("fortuit_traitement");
          //@ts-ignore
          this.commentaire =  this.commentaire + " - " + selection2.options[selection2.selectedIndex].value;
        }
      }
      else if(this.programme == true){
        this.commentaire = "Arrêt technique";
      }
      /*
      * FIN récupération commentaire
      * */
    }
    //Sinon on stocke les dates (dateDebut = dateFin)
    else{
      this.dateDebut = new Date(form.value['dateSaisie']);
      this.dateFin = this.dateDebut;
      this.commentaire = '_';
    }
    if(this.commentaire != '_'){
      this.commentaire = this.commentaire +" - "+ this.saisieLibre;
    }
    else this.commentaire = this.saisieLibre + " -";
    this.transformDateFormat();
    if (this.isArret == true) {
      this.arretsService.createArret(this.stringDateDebut, this.stringDateFin, this.duree, this.IdUser, this.stringDateSaisie, this.commentaire, this.arretId).subscribe((response) => {
        if (response == "Création de l'arret OK") {
          Swal.fire("L'arrêt a bien été créé !");
          //envoi d'un mail si arrêt intempestif ou arrêt GTA
          if (this.arretName.includes("FORTUIT") || this.arretName.includes("GTA")) {
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
          }
          form.reset();
          this.arretId = 0;
          this.arretName = '';
          this.duree = 0;
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la création de l\'arrêt ....',
          })
        }
      });
    }

    /**
     * Dépassements 1/2 heures
     */
    else {
      this.arretsService.createDepassement(this.stringDateDebut, this.stringDateFin, this.duree, this.IdUser, this.stringDateSaisie, this.commentaire, this.arretId).subscribe((response) => {
        if (response == "Création du DEP OK") {
          Swal.fire("Le dépassement a bien été créé !");
          form.reset();
          this.arretId = 0;
          this.arretName = '';
          this.duree = 0;
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


  updateDuree(form : NgForm){
    var duree = form.value['duree'];
    this.duree = duree;
  }

}
