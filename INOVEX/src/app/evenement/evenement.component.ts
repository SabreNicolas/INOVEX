import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import {DatePipe, Location} from "@angular/common";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { consigne } from 'src/models/consigne.model';
declare var $ : any;
import {rondierService} from "../services/rondier.service";
import { AltairService } from '../services/altair.service';
import { PopupService } from '../services/popup.service';

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
  public idAnomalie : number;
  public groupementGMAO : string;
  public equipementGMAO : string;
  public listGroupementsGMAOMap : Map<String,String>;
  public listGroupementGMAOTable : any [];
  public listEquipementGMAO : any[];
  public listEquipementGMAOFiltre: any[];
  public demandeTravaux : number;
  public consigne : number;
  public cause : string;
  public description : string;
  fileToUpload: File | undefined;
  public imgSrc !: any
  public dupliquer : number;
  private token: string;

  constructor(public altairService : AltairService, private popupService : PopupService, public cahierQuartService : cahierQuartService, private rondierService : rondierService, private datePipe : DatePipe,private route : ActivatedRoute, private location : Location) {
    this.titre = "";
    this.importance = 0;
    this.idEvenement = 0;
    this.idAnomalie = 0;
    this.groupementGMAO ="";
    this.listGroupementsGMAOMap = new Map();
    this.listGroupementGMAOTable = [];
    this.listEquipementGMAOFiltre = [];
    this.listEquipementGMAO = [];
    this.equipementGMAO =""
    this.demandeTravaux=0;
    this.consigne = 0;
    this.cause ="";
    this.description = "";
    this.dupliquer = 0;
    this.token = "";

    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe(params => {
      if(params.idEvenement != undefined){
        this.idEvenement = params.idEvenement;
      }
      else {
        this.idEvenement = 0;
      }
      if(params.idAnomalie != undefined){
        this.idAnomalie = params.idAnomalie;
      }
      else {
        this.idAnomalie = 0;
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
    if(this.idEvenement > 0){
      //On récupère l'aévènement
      this.cahierQuartService.getOneEvenement(this.idEvenement).subscribe((response) =>{
        this.titre = response.data[0]['titre'];
        this.importance = response.data[0]['importance'];
        this.dateDeb = response.data[0]['date_heure_debut'].replace(' ','T').replace('Z','');
        this.dateFin = response.data[0]['date_heure_fin'].replace(' ','T').replace('Z','');
        this.groupementGMAO = response.data[0]['groupementGMAO'];
        this.equipementGMAO = response.data[0]['equipementGMAO'];
        this.demandeTravaux = response.data[0]['demande_travaux'];
        if(this.demandeTravaux == 1){
          $("#dateFin").show();
          $("#equipementGMAO").show();
          $("#groupementGMAO").show();
        }
        $('#demandeTravaux').hide();
        $('#demandeTravauxLabel').hide();
        this.description = response.data[0]['description'];
        this.consigne = response.data[0]['consigne'];
        this.cause = response.data[0]['cause'];
        this.imgSrc = response.data[0]['url'];
        
        if(this.dupliquer == 1){
          this.idEvenement = 0
        }
      })
    }
    else{
      //@ts-ignore
      this.dateDeb = this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm');
      this.dateFin = this.dateDeb;
    }


    if(this.idAnomalie > 0){
      this.rondierService.getOneAnomalie(this.idAnomalie).subscribe((response)=>{
        console.log(response)
        //@ts-ignore
        this.description = response.data[0]['commentaire']
        //@ts-ignore
        this.imgSrc = response.data[0]['photo']
      })
    }

    this.altairService.login().subscribe((response)=>{
      this.token = response.token

      this.altairService.getEquipements(this.token).subscribe((response)=>{
        this.listEquipementGMAO= response.equipment;
        this.listEquipementGMAOFiltre = this.listEquipementGMAO;

        for(let equipement of this.listEquipementGMAO){
          this.listGroupementsGMAOMap.set(equipement.fkcodelocation,equipement.fkcodelocation)
        }
        this.listGroupementGMAOTable = Array.from(this.listGroupementsGMAOMap.keys())

      })
    })

    
    
  }

  updateElements(){
    this.listEquipementGMAOFiltre = [];

    if(this.groupementGMAO == ""){
      this.listEquipementGMAOFiltre = this.listEquipementGMAO
    }
    else{
      for(let equipement of this.listEquipementGMAO){
        if(equipement.fkcodelocation == this.groupementGMAO){
          this.listEquipementGMAOFiltre.push(equipement)
        }
      }
    }
  }

  updateGroupements(){
    for(let equipement of this.listEquipementGMAO){
      if(equipement.codeequipment == this.equipementGMAO.split('---')[0]){
        this.groupementGMAO = equipement.fkcodelocation
      }
    }
  }

  //Création ou édition d'un évènement
  newEvenement(){
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
    //Il faut avoir renseigné un nom
    if(this.titre == "" ){
      this.popupService.alertErrorForm('Veuillez renseigner le titre de l\'actualité. La saisie a été annulée.');
      return;
    }
    //Il faut que les deux dates soient cohérentes
    if(this.dateFin < this.dateDeb){
      this.popupService.alertErrorForm('Les dates ne correspondent pas. La saisie a été annulée.');
      return;
    }
    //Si la case demande de travaux est choché on la met a un pour l'insertion sinon elle est a 'true'
    if(this.demandeTravaux){
      this.demandeTravaux=1;
    }
    else this.demandeTravaux=0;
    //Si on la case consigne est cochée on la crée
    if(this.consigne){
      this.consigne=1;
      if(this.fileToUpload != undefined){
        this.rondierService.createConsigne(this.titre,this.description,5,dateFinString,dateDebString,this.fileToUpload).subscribe((response)=>{
        })
      }
      else{
        this.rondierService.createConsigne(this.titre,this.description,5,dateFinString,dateDebString,null).subscribe((response)=>{
        })
      }
      
    }
    else this.consigne=0;
    //Choix de la phrase à afficher en fonction du mode
    if(this.idEvenement > 0){
      var question = 'Êtes-vous sûr(e) de modifier cet évènement ?'
    }
    else var question = 'Êtes-vous sûr(e) de créer cet évènement ?'
    //Demande de confirmation de l'évènement
    Swal.fire({title: question ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, créer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        //Si on est en mode édition 
        if (this.idEvenement != 0){
          //@ts-ignore
          this.cahierQuartService.updateEvenement(this.titre,this.importance,dateDebString,dateFinString, this.groupementGMAO, this.equipementGMAO, this.cause,this.description, this.consigne, this.demandeTravaux, this.idEvenement).subscribe((response)=>{
            if(response != undefined){
              this.cahierQuartService.historiqueEvenementUpdate(this.idEvenement).subscribe((response)=>{
                this.popupService.alertSuccessForm('Evènement modifiée !');
                this.location.back();
              })
            }
          });        
        }
        //Sinon on créé 
        else{
          //@ts-ignore
          this.cahierQuartService.newEvenement(this.titre,this.fileToUpload,this.importance,dateDebString,dateFinString, this.groupementGMAO, this.equipementGMAO, this.cause,this.description, this.consigne, this.demandeTravaux).subscribe((response)=>{
            if(response != undefined){
              this.popupService.alertSuccessForm('Nouvel évènement créée');
              this.idEvenement = response['data'][0]['Id'];
              this.cahierQuartService.historiqueEvenementCreate(this.idEvenement).subscribe((response)=>{
                if(this.idAnomalie > 0){
                  this.rondierService.updateAnomalieSetEvenement(this.idAnomalie).subscribe((response)=>{
                    this.location.back();
                  })
                } 
                else this.location.back(); 
              })
                          
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
    else this.popupService.alertErrorForm('Aucun fichier choisi....')
  }

  goBack(){
    this.location.back();
  }

  clickDemandeTravaux(){
    if($("input#demandeTravaux").is(':checked')){
      $("#dateFin").show();
      $("#equipementGMAO").show();
      $("#groupementGMAO").show();
    }
    else{
      $("#dateFin").hide();
      $("#equipementGMAO").hide();
      $("#groupementGMAO").hide();

    }
  }
}
