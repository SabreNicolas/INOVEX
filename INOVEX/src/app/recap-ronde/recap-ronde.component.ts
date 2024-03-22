import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import { ActivatedRoute } from '@angular/router';
import { addDays, format } from 'date-fns';
import {rondierService} from "../services/rondier.service";
import { zone } from 'src/models/zone.model';
import Swal from 'sweetalert2';
declare var $ : any;

@Component({
  selector: 'app-recap-ronde',
  templateUrl: './recap-ronde.component.html',
  styleUrls: ['./recap-ronde.component.scss']
})
export class RecapRondeComponent implements OnInit {

  public listAction : any[];
  public listEvenement : any[];
  public listZone : any[];
  public listZoneOfUsine : zone[];
  public listZoneSelection : any[];
  public consignes : any[];
  public dateDebString : string;
  public dateFinString : string;
  public quart : number;
  public nomAction : string;
  public idEquipe : number;

  constructor(public cahierQuartService : cahierQuartService,private route : ActivatedRoute,private rondierService : rondierService,) {
    this.listAction = [];
    this.listZoneOfUsine = [];
    this.listZoneSelection = [];
    this.listZone = [];
    this.listEvenement = [];
    this.consignes = [];
    this.dateDebString = "";
    this.dateFinString = "";
    this.quart = 0;
    this.nomAction = "";
    this.idEquipe = 0;

    this.route.queryParams.subscribe(params => {
      if(params.quart != undefined){
        this.quart = params.quart;
      }
      else {
        this.quart = 0;
      }
    });
  }

  ngOnInit(): void {
    //Récupération de la date de début et de la date de fin en fonction du quart 
    if(this.quart == 1){
      this.dateDebString = format(new Date(),'yyyy-MM-dd') + ' 05:00:00.000'
      this.dateFinString = format(new Date(),'yyyy-MM-dd') + ' 13:00:00.000'
    }
    else if(this.quart == 2){
      this.dateDebString = format(new Date(),'yyyy-MM-dd') + ' 13:00:00.000'
      this.dateFinString = format(new Date(),'yyyy-MM-dd') + ' 21:00:00.000'
    }
    else{
      this.dateDebString = format(new Date(),'yyyy-MM-dd') + ' 21:00:00.000'
      this.dateFinString = format(addDays(new Date(), 1),'yyyy-MM-dd') + ' 05:00:00.000'
    }

    //Récupération des action pour la ronde en cours
    this.cahierQuartService.getActionsRonde(this.dateDebString, this.dateFinString).subscribe((response)=>{
      // @ts-ignore
      this.listAction = response.data;
    });

    //Récupération des évènement pour la ronde en cours
    this.cahierQuartService.getEvenementsRonde(this.dateDebString, this.dateFinString).subscribe((response)=>{
      // @ts-ignore
      this.listEvenement = response.data;
    });
    
    //Récupération des zones pour la ronde en cours
    this.cahierQuartService.getZonesCalendrierRonde(this.dateDebString, this.dateFinString).subscribe((response)=>{
      // @ts-ignore
      this.listZone = response.data;
    });
    
    //Récupération de l'id de l'équipe pour la ronde si l'équipe est déjà crée
    this.cahierQuartService.getEquipeQuart(this.quart,format(new Date(),'yyyy-MM-dd')).subscribe((response)=>{
      // @ts-ignore
      this.idEquipe = response.data[0].id;
    });

    //Récupération des zones de l'usine pour l'ajout d'une zone
    this.rondierService.listZone().subscribe((response)=>{
      // @ts-ignore
      this.listZoneOfUsine = response.data;
    });

    //On récupére la liste des consignes en cours de validité
    this.rondierService.listConsignes().subscribe((response) => {
      //@ts-ignore
      this.consignes = response.data;
    });
  }

  //Fonction qui permet d'afficher la création d'une zone
  newZone(){
    $('#divCreationZone').show();
    $('#hideZone').show();
    $('#createZone').hide();
  }
  
  //Fonction qui permet de cacher la création d'une zone
  hideZone(){
    $('#divCreationZone').hide();
    $('#hideZone').hide();
    $('#createZone').show();
  }

  //Focntion qui permet d'ajouter la zone au calendrier
  createZone(){
    for(const zone of this.listZoneSelection){   
      this.cahierQuartService.newCalendrierZone(zone,this.dateDebString,this.quart,this.dateFinString).subscribe((response) => {
        this.ngOnInit();
      })
    }
  }

  //Fonction qui permet d'afficher la création d'une action
  newAction(){
    $('#divCreationAction').show();
    $('#hideAction').show();
    $('#createAction').hide();
  }

  //Fonction qui permet de cacher la création d'une action
  hideAction(){
    $('#divCreationAction').hide();
    $('#hideAction').hide();
    $('#createAction').show();
  }

  //Focntion qui permet d'ajouter l'action au calendrier et à la tablea d'actions
  createAction(){
    this.cahierQuartService.newAction(this.nomAction, this.dateDebString,this.dateFinString).subscribe((response)=>{
      this.cahierQuartService.newCalendrierAction(response.data[0].id, response.data[0].date_heure_debut, this.quart, response.data[0].date_heure_fin).subscribe((response) => {
        this.ngOnInit();
      })
    })
  }

  //supprimer une zone
  deleteZone(id: any) {
    Swal.fire({title: "Etes vous sûr de vouloir supprimer cet évènement ?" ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService.deleteCalendrier(id).subscribe((response)=>{
          if (response == "Suppression de l'evenement du calendrier OK"){
            Swal.fire("L'évènement a bien été supprimé !");
            this.ngOnInit();
          }
          else {
            Swal.fire({
              icon: 'error',
              text: "Erreur lors de la suppression de l'évènement....",
            })
          }
        });
      }  
      else {
        // Pop-up d'annulation de la suppression
        Swal.fire('Annulé','La suppression a été annulée.','error');
      }
    });
  }

  //supprimer une action
  deleteAction(id: any) {
    Swal.fire({title: "Etes vous sûr de vouloir supprimer cet évènement ?" ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService.deleteCalendrier(id).subscribe((response)=>{
          if (response == "Suppression de l'evenement du calendrier OK"){
            Swal.fire("L'évènement a bien été supprimé !");
            this.ngOnInit();
          }
          else {
            Swal.fire({
              icon: 'error',
              text: "Erreur lors de la suppression de l'évènement....",
            })
          }
        });
      }  
      else {
        // Pop-up d'annulation de la suppression
        Swal.fire('Annulé','La suppression a été annulée.','error');
      }
    });
  }
}
