import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import {DatePipe, Location} from "@angular/common";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-actu',
  templateUrl: './actu.component.html',
  styleUrls: ['./actu.component.scss']
})
export class ActuComponent implements OnInit {

  public titre : string;
  public importance : number;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;
  public idActu : number;
  public description : string;
  public dupliquer : number;

  constructor(public cahierQuartService : cahierQuartService, private popupService : PopupService, private datePipe : DatePipe,private route : ActivatedRoute, private location : Location) {
    this.titre = "";
    this.importance = 0;
    this.idActu = 0;
    this.description = "";
    this.dupliquer = 0;

    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe(params => {
      if(params.idActu != undefined){
        this.idActu = params.idActu;
      }
      else {
        this.idActu = 0;
      }
      if(params.dupliquer != undefined){
        this.dupliquer = params.dupliquer;
      }
      else {
        this.dupliquer = 0;
      }
    });
   }

  ngOnInit(): void {
    //Si on est en mode édition
    if(this.idActu > 0){
      //On récupère l'actu
      this.cahierQuartService.getOneActu(this.idActu).subscribe((response) =>{
        this.titre = response.data[0]['titre'];
        this.importance = response.data[0]['importance'];
        this.description = response.data[0]['description'];
        this.dateDeb = response.data[0]['date_heure_debut'].replace(' ','T').replace('Z','');
        this.dateFin = response.data[0]['date_heure_fin'].replace(' ','T').replace('Z','');
        
        if(this.dupliquer == 1){
          this.idActu = 0
        }
      })
    }
  }

  //Création ou édition d'une actualité
  newActu(){
    //Il faut avoir renseigné une date de début
    if(this.dateDeb != undefined){
      var dateDebString = this.datePipe.transform(this.dateDeb,'yyyy-MM-dd HH:mm');
    }
    else {
      this.popupService.alertErrorForm('Veuillez choisir une date de début. La saisie a été annulée.');
      return;
    }
    //Il faut avoir renseigné une date de fin
    if(this.dateFin != undefined){
      var dateFinString = this.datePipe.transform(this.dateFin,'yyyy-MM-dd HH:mm');
    }
    else {
      this.popupService.alertErrorForm('Veuillez choisir une date de Fin. La saisie a été annulée.');
      return;
    }
    //Il faut avoir renseigné un titre
    if(this.titre == "" ){
      this.popupService.alertErrorForm('Veuillez renseigner le titre de l\'actualité. La saisie a été annulée.');
      return;
    }
    //On vérifie si les deux dates sont valides
    if(this.dateFin < this.dateDeb){
      this.popupService.alertSuccessForm('Les dates ne correspondent pas. La saisie a été annulée.');
      return;
    }
    //Choix de la phrase à afficher en fonction du mode
    if(this.idActu > 0){
      var question = 'Êtes-vous sûr(e) de modifier cette Actu ?'
    }
    else var question = 'Êtes-vous sûr(e) de créer cette Actu ?'
    //Demande de confirmation de création d'équipe
    Swal.fire({title: question ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, créer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        //Si on est en mode édition d'une actu on va dans la fonction update
        if (this.idActu != 0){
          //@ts-ignore
          this.cahierQuartService.updateActu(this.titre,this.importance,dateDebString,dateFinString, this.idActu,this.description).subscribe((response)=>{
            if(response == "Modif de l'actu OK !"){
              this.cahierQuartService.historiqueActuUpdate(this.idActu).subscribe((response)=>{
                this.popupService.alertSuccessForm('Atualité modifiée !');
              })
            }
          });        
        }
        //Sinon on créé l'actu
        else{
          //@ts-ignore
          this.cahierQuartService.newActu(this.titre,this.importance,dateDebString,dateFinString,this.description).subscribe((response)=>{
            console.log(response)
            if(response != undefined){
              this.idActu = response['data'][0]['Id'];
              this.cahierQuartService.historiqueActuCreate(this.idActu).subscribe((response)=>{
                this.popupService.alertSuccessForm('Nouvelle actualité créée');
              })
              this.location.back();
            }
          });
        }  
      } 
      else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm('La création a été annulée.');
      }
    });
    
  }
}
