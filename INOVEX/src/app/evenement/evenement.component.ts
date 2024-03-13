import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import {DatePipe} from "@angular/common";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { consigne } from 'src/models/consigne.model';
declare var $ : any;

@Component({
  selector: 'app-evenement',
  templateUrl: './evenement.component.html',
  styleUrls: ['./evenement.component.scss']
})
export class EvenementComponent implements OnInit {
  public titre : string;
  public importance : number;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;
  public idEvenement : number;
  public groupementGMAO : string;
  public equipementGMAO : string;
  public demandeTravaux : number;
  public consigne : number;
  public cause : string;
  public description : string;
  fileToUpload: File | undefined;
  public imgSrc !: any

  constructor(public cahierQuartService : cahierQuartService, private datePipe : DatePipe,private route : ActivatedRoute) {
    this.titre = "";
    this.importance = 0;
    this.idEvenement = 0;
    this.groupementGMAO ="";
    this.equipementGMAO =""
    this.demandeTravaux=0;
    this.consigne = 0;
    this.cause ="";
    this.description = "";
    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe(params => {
      if(params.idEvenement != undefined){
        this.idEvenement = params.idEvenement;
      }
      else {
        this.idEvenement = 0;
      }
    });
   }

  ngOnInit(): void {
    if(this.idEvenement > 0){
      this.cahierQuartService.getOneEvenement(this.idEvenement).subscribe((response) =>{
        this.titre = response.data[0]['titre'];
        this.importance = response.data[0]['importance'];
        this.dateDeb = response.data[0]['date_heure_debut'].replace(' ','T').replace('Z','');
        this.dateFin = response.data[0]['date_heure_fin'].replace(' ','T').replace('Z','');
        this.groupementGMAO = response.data[0]['groupementGMAO'];
        this.equipementGMAO = response.data[0]['equipementGMAO'];
        this.demandeTravaux = response.data[0]['demande_travaux'];
        this.description = response.data[0]['description'];
        this.consigne = response.data[0]['consigne'];
        this.cause = response.data[0]['cause'];
        this.imgSrc = response.data[0]['url'];

      })
    }
  }

  
  newEvenement(){
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
    if(this.demandeTravaux){
      this.demandeTravaux=1;
    }
    else this.demandeTravaux=0;
    if(this.consigne){
      this.consigne=1;
    }
    else this.consigne=0;
    if(this.idEvenement > 0){
      var question = 'Êtes-vous sûr(e) de modifier cet évènement ?'
    }
    else var question = 'Êtes-vous sûr(e) de créer cet évènement ?'
    //Demande de confirmation de création d'équipe
    Swal.fire({title: question ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, créer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        //Si on est en mode édition d'une actu on va dans la fonction update
        if (this.idEvenement != 0){
          //@ts-ignore
          this.cahierQuartService.updateEvenement(this.titre,this.importance,dateDebString,dateFinString, this.groupementGMAO, this.equipementGMAO, this.cause,this.description, this.consigne, this.demandeTravaux, this.idEvenement).subscribe((response)=>{
            console.log(response)
            if(response == "Modification de l'evenement OK !"){
              Swal.fire({text : 'Evènement modifiée !', icon :'success'});
            }
          });        
        }
        //Sinon on créé l'actu
        else{
          //@ts-ignore
          this.cahierQuartService.newEvenement(this.titre,this.fileToUpload,this.importance,dateDebString,dateFinString, this.groupementGMAO, this.equipementGMAO, this.cause,this.description, this.consigne, this.demandeTravaux).subscribe((response)=>{
            console.log(response)
            if(response == "Création de l'evenement OK !"){
              Swal.fire({text : 'Nouvel évènement créée', icon :'success'});
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

  //Method déclenché dès que le fichier sélectionné change
  //Stockage du fichier chaque fois qu'un fichier est upload
  saveFile(event : Event) {
    //Récupération du fichier dans l'input
    // @ts-ignore
    this.fileToUpload = (<HTMLInputElement>event.target).files[0];
    // @ts-ignore
    //console.log((<HTMLInputElement>event.target).files[0]);

    // @ts-ignore
    if (event.target.value) {
      // @ts-ignore
      const file = event.target.files[0];
      this.fileToUpload = file;
      const reader = new FileReader();
      reader.onload = e => this.imgSrc = reader.result;
      reader.readAsDataURL(file);
    } 
    else Swal.fire('Aucun fichier choisi....')
  }
}
