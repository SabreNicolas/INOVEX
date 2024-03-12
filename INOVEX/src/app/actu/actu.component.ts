import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import {DatePipe} from "@angular/common";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

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

  constructor(public cahierQuartService : cahierQuartService, private datePipe : DatePipe,private route : ActivatedRoute) {
    this.titre = "";
    this.importance = 0;
    this.idActu = 0;
    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe(params => {
      if(params.idActu != undefined){
        this.idActu = params.idActu;
      }
      else {
        this.idActu = 0;
      }
    });
   }

  ngOnInit(): void {
    if(this.idActu > 0){
      this.cahierQuartService.getOneActu(this.idActu).subscribe((response) =>{
        this.titre = response.data[0]['titre'];
        this.importance = response.data[0]['importance'];
        this.dateDeb = response.data[0]['date_heure_debut'].replace(' ','T').replace('Z','');
        this.dateFin = response.data[0]['date_heure_fin'].replace(' ','T').replace('Z','');
      })
    }
  }

  newActu(){
    if(this.dateDeb != undefined){
      var dateDebString = this.datePipe.transform(this.dateDeb,'yyyy-MM-dd HH:mm');
    }
    else {
      Swal.fire('Veuillez choisir une date de début','La saisie a été annulée.','error');
      return;
    }
    if(this.dateFin != undefined){
      var dateFinString = this.datePipe.transform(this.dateFin,'yyyy-MM-dd HH:mm');
    }
    else {
      Swal.fire('Veuillez choisir une date de Fin','La saisie a été annulée.','error');
      return;
    }
    if(this.titre == "" ){
      Swal.fire('Veuillez renseigner le titre de l\'actualité','La saisie a été annulée.','error');
      return;
    }
    if(this.dateFin < this.dateDeb){
      Swal.fire('Les dates ne correspondent pas','La saisie a été annulée.','error');
      return;
    }
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
          this.cahierQuartService.updateActu(this.titre,this.importance,dateDebString,dateFinString, this.idActu).subscribe((response)=>{
            console.log(response)
            if(response == "Modif de l'actu OK !"){
              Swal.fire({text : 'Atualité modifiée !', icon :'success'});
            }
          });        
        }
        //Sinon on créé l'actu
        else{
          //@ts-ignore
          this.cahierQuartService.newActu(this.titre,this.importance,dateDebString,dateFinString).subscribe((response)=>{
            console.log(response)
            if(response == "Création de l'actu OK !"){
              Swal.fire({text : 'Nouvelle actualité créée', icon :'success'});
            }
          });
        }  
      } 
      else {
        // Pop-up d'annulation de la suppression
        Swal.fire('Annulé','La création a été annulée.','error');
      }
    });
    
  }
}
