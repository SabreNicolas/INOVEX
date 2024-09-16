import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe,Location } from '@angular/common';
import { MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actualite } from 'src/models/actualite.model';
import { cahierQuartService } from '../services/cahierQuart.service';
import { PopupService } from '../services/popup.service';
import {rondierService} from "../services/rondier.service";
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AltairService } from '../services/altair.service';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'
declare var $ : any;

@Component({
  selector: 'app-list-evenements',
  templateUrl: './list-evenements.component.html',
  styleUrls: ['./list-evenements.component.scss']
})
export class ListEvenementsComponent implements OnInit {

  @ViewChild('myCreateEventDialog') createEventDialog = {} as TemplateRef<any>;
  @ViewChild('myDTDialog') DTDialog = {} as TemplateRef<any>;

  public listEvenement : any[];
  public dateDebString : string;
  public dateFinString : string;
  public submitted : boolean;
  public idEvenement : number;
  public dialogRef = {};
  public titre : string;
  public importance : number;
  public dateDeb : Date | undefined;

  fileToUpload: File | undefined;
  public imgSrc !: any

  public groupementGMAO : string;
  public equipementGMAO : string;
  public listGroupementsGMAOMap : Map<String,String>;
  public listGroupementGMAOTable : any [];
  public listEquipementGMAO : any[];
  public listEquipementGMAOFiltre: any[];
  private token: string;
  public dateFin : Date | undefined;
  public demandeTravaux : number;
  public consigne : number;
  public description : string;
  public cause : string;

  public DI : string;
  public BT : string;
  public descriptionBT : string;
  public commentaireBT : string;
  public responsableBT : string;
  public statusBT : string;
  public planifieDebutBT : string;
  public planifieFinBT : string;


  constructor(public altairService : AltairService, private rondierService : rondierService, private datePipe : DatePipe, public cahierQuartService : cahierQuartService, private dialog : MatDialog,private popupService : PopupService) {
    this.listEvenement = [];
    this.dateDebString = "";
    this.titre = "";
    this.importance = 0;
    this.dateFinString = "";
    this.idEvenement = 0;
    this.submitted = false;
    this.token ="";
    this.demandeTravaux = 0;
    this.consigne = 0;
    this.description = "";
    this.groupementGMAO ="";
    this.listGroupementsGMAOMap = new Map();
    this.listGroupementGMAOTable = [];
    this.listEquipementGMAOFiltre = [];
    this.listEquipementGMAO = [];
    this.equipementGMAO =""
    this.cause ="";

    this.DI = "";
    this.BT ="";
    this.descriptionBT = "";
    this.statusBT = "";
    this.planifieDebutBT = "";
    this.planifieFinBT = "";
    this.commentaireBT = "";
    this.responsableBT = "";
  }

  ngOnInit(): void {
    this.cahierQuartService.getAllEvenement().subscribe((response)=>{
      // @ts-ignore
      this.listEvenement = response.data;
    });

    this.titre = "";
    this.cause = "";
    this.groupementGMAO = "";
    this.equipementGMAO = "";
    this.description = "";
    this.importance = 0;
    this.dateDeb = undefined;
    this.imgSrc ="";
    this.demandeTravaux = 0;
    
    this.altairService.login().subscribe((response)=>{
      this.token = response.token

      this.altairService.getEquipements(this.token).subscribe((response)=>{
        for(let equipment of response.equipment){
          if(equipment.status != "REBUT"){
            this.listEquipementGMAO.push(equipment)
          }
        }
        this.listEquipementGMAOFiltre = this.listEquipementGMAO;
        console.log(this.listEquipementGMAO);
        for(let equipement of this.listEquipementGMAO){
          this.listGroupementsGMAOMap.set(equipement.fkcodelocation,equipement.fkcodelocation)
        }
        this.listGroupementGMAOTable = Array.from(this.listGroupementsGMAOMap.keys());
      })
    })
  }

  

  //suppression d'un évènement
  deleteEvenement(id : number){
    Swal.fire({title: "Etes vous sûr de vouloir supprimer cet évènement ?" ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService.deleteEvenement(id).subscribe((response)=>{
          if (response == "Suppression de l'evenement OK"){
            this.cahierQuartService.historiqueEvenementDelete(id).subscribe((response)=>{
              this.popupService.alertSuccessForm("L'evenement a bien été supprimé !");
            })
          }
          else {
            this.popupService.alertErrorForm("Erreur lors de la suppression de l'evenement....")
          }
        });
        this.ngOnInit();
      }  
      else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm('La suppression a été annulée.');
      }
    });
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

  downloadImage(urlPhoto : string) {
    window.open(urlPhoto, '_blank');
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

  ouvrirDialogCreerEvent(){
    this.dialogRef = this.dialog.open(this.createEventDialog,{
      width:'60%',
      disableClose:true,
      autoFocus:true,
    })
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.idEvenement = 0;
      this.ngOnInit();
    })
  }

  ouvrirDialogModifEvent(id : number, dupliquer : number){
    this.idEvenement = id
    this.dialogRef = this.dialog.open(this.createEventDialog,{
      width:'40%',
      disableClose:true,
      autoFocus:true,
    })

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
      
      if(dupliquer == 1){
        this.idEvenement = 0
        $("#equipementGMAO").show();
        $("#groupementGMAO").show();
        
        this.groupementGMAO ="";
        this.equipementGMAO ="";
      }
      else{
        $('#demandeTravaux').hide();
        $('#demandeTravauxLabel').hide();
      }
    })
    
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.idEvenement = 0;
      this.ngOnInit();
    })
  }

  //Création ou édition d'un évènement
  newEvenement(){
    this.dateFin = this.dateDeb
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

    if(this.demandeTravaux != 0 && this.idEvenement == 0){
      console.log(this.equipementGMAO)
      if(this.equipementGMAO == ""){
        this.popupService.alertErrorForm('Veuillez choisir un équipement pour la DI');
        return;
      }
    }
    
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
                this.ngOnInit();
                this.dialog.closeAll();
              })
            }
          });        
        }
        //Sinon on créé 
        else{
          if(this.demandeTravaux != 0){
            this.altairService.createDI(this.token,this.titre, this.groupementGMAO, this.equipementGMAO.split('---')[0], this.cause, this.importance, this.description).subscribe((response) =>{
              console.log(response)
              //@ts-ignore
              this.cahierQuartService.newEvenement(this.titre,this.fileToUpload,this.importance,dateDebString,dateFinString, this.groupementGMAO, this.equipementGMAO, this.cause,this.description, this.consigne, response.codeworkrequest).subscribe((response)=>{
                if(response != undefined){
                  this.popupService.alertSuccessForm('Nouvel évènement créée');
                  this.idEvenement = response['data'][0]['Id'];
                    this.cahierQuartService.historiqueEvenementCreate(this.idEvenement).subscribe((response)=>{
                      this.ngOnInit();
                      this.dialog.closeAll();
                  })        
                }
              });
            })
          }
          else{
            //@ts-ignore
            this.cahierQuartService.newEvenement(this.titre,this.fileToUpload,this.importance,dateDebString,dateFinString, this.groupementGMAO, this.equipementGMAO, this.cause,this.description, this.consigne, this.demandeTravaux).subscribe((response)=>{
              if(response != undefined){
                this.popupService.alertSuccessForm('Nouvel évènement créée');
                this.idEvenement = response['data'][0]['Id'];    
                this.cahierQuartService.historiqueEvenementCreate(this.idEvenement).subscribe((response)=>{
                  this.ngOnInit();
                  this.dialog.closeAll();
                })        
              }
            });
          }
          
        }  
      } 
      else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm('La création a été annulée.');
      }
    });
    
  }

  getDI(id : string){
    this.altairService.getOneDI(this.token,id).subscribe((response) =>{
      console.log(response);
      this.DI = id;
      this.BT = response.fkcodeworkorder;
      let timeZone = 'Europe/Paris';
      if(response.fkcodeworkorder != undefined){
        this.altairService.getOneDT(this.token,this.BT).subscribe((response) =>{
          this.descriptionBT = response.description
          this.responsableBT = response.fkcodelaborincharge
          this.commentaireBT = response.wom1
          if(response.targstartdate != undefined){
            const dateDeb = parseISO(response.targstartdate)
            const zoneDateDeb = toZonedTime(dateDeb, timeZone)
            this.planifieDebutBT = format(zoneDateDeb, 'dd/MM/yyyy HH:mm')
          }
          if(response.targenddate != undefined){
            const dateFin = parseISO(response.targenddate)
            const zoneDateFin = toZonedTime(dateFin, timeZone)
            this.planifieFinBT = format(zoneDateFin, 'dd/MM/yyyy HH:mm')
          }
          this.statusBT = response.status
          this.ouvrirDialogDT();
        })

      }
      else{
        this.popupService.alertErrorForm("Aucune demande de travaux n'est associée à cette DI !!")
      }
    })
  }

  ouvrirDialogDT(){
    this.dialogRef = this.dialog.open(this.DTDialog,{
      width:'60%',
      disableClose:false,
      autoFocus:true,
    })
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.idEvenement = 0;
      this.DI = "";
      this.BT ="";
      this.ngOnInit();
    })
  }
}
