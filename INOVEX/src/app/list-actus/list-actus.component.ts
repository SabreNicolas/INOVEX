import { Component, NgModule, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe,Location } from '@angular/common';
import { MatDialog} from '@angular/material/dialog';
import {loginService} from "../services/login.service";
import { Actualite } from 'src/models/actualite.model';
import { cahierQuartService } from '../services/cahierQuart.service';
import { PopupService } from '../services/popup.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { user } from 'src/models/user.model';

@Component({
  selector: 'app-list-actus',
  templateUrl: './list-actus.component.html',
  styleUrls: ['./list-actus.component.scss'],
})


export class ListActusComponent implements OnInit {

  @ViewChild('myCreateActuDialog') createActuDialog = {} as TemplateRef<any>;

  public listActu : Actualite[];
  public titre : string;
  public importance : number;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;
  public idActu : number;
  public description : string;
  public dupliquer : number;  public dialogRef = {};
  public forQuart : boolean | number;
  public listUsers : user[];
  public listEmail : string[];

  constructor(public cahierQuartService : cahierQuartService,private popupService : PopupService, private loginService : loginService, private dialog : MatDialog, private datePipe : DatePipe,private route : ActivatedRoute, private location : Location) {
    this.listActu = [];
    this.titre = "";
    this.importance = 0;
    this.idActu = 0;
    this.description = "";
    this.dupliquer = 0;
    this.forQuart = false; 
    this.listUsers = [];
    this.listEmail = [];
  }
  
  ngOnInit(): void {

    this.cahierQuartService.getAllActuDateCourante().subscribe((response)=>{
      // @ts-ignore
      this.listActu = response.data;
    });

    this.loginService.getUsersEmail().subscribe((response)=>{
      // @ts-ignore 
      this.listUsers = response.data;
    });

    this.titre = "";
    this.importance = 0;
    this.idActu = 0;
    this.description = "";
    this.dupliquer = 0;    
    this.dateDeb = undefined;
    this.dateFin = undefined;
    this.forQuart = false;
    this.listEmail = [];
  }

  terminerActu(id:number, isValide : number){
    if(isValide == 1){
      this.cahierQuartService.invaliderActu(id).subscribe((response)=>{
        this.ngOnInit();
        this.popupService.alertSuccessForm("Actu non lié à un quart")
      });
    }
    else{
      this.cahierQuartService.validerActu(id).subscribe((response)=>{
        this.ngOnInit();
        this.popupService.alertSuccessForm("Actu lié à un quart")
      });
    }
  }



  ouvrirDialogCreerActu(){
    this.dialogRef = this.dialog.open(this.createActuDialog,{
      width:'40%',
      disableClose:true,
      autoFocus:true,
    })
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.ngOnInit();
      this.idActu = 0;
    })
  }

  ouvrirDialogModifActu(id : number, dupliquer : number){
    this.idActu = id
    this.dialogRef = this.dialog.open(this.createActuDialog,{
      width:'40%',
      disableClose:true,
      autoFocus:true,
    })
    this.cahierQuartService.getOneActu(this.idActu).subscribe((response) =>{
      //On récupère l'actu
      this.cahierQuartService.getOneActu(this.idActu).subscribe((response) =>{
        this.titre = response.data[0]['titre'];
        this.importance = response.data[0]['importance'];
        this.forQuart = response.data[0]['isValide'];
        this.description = response.data[0]['description'];
        this.dateDeb = response.data[0]['date_heure_debut'].replace(' ','T').replace('Z','');
        this.dateFin = response.data[0]['date_heure_fin'].replace(' ','T').replace('Z','');
        
        if(this.dupliquer == 1){
          this.idActu = 0
        }
      })

      if(dupliquer == 1){
        this.idActu = 0
      }
    })
    
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.idActu = 0;
      this.ngOnInit();
    })
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
    //On transforme la case à coché pour lié l'action à un quart en number
    if(this.forQuart){
      this.forQuart = 1
    }
    else this.forQuart = 0;

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
          this.cahierQuartService.updateActu(this.titre,this.importance,dateDebString,dateFinString, this.idActu,this.description, this.forQuart).subscribe((response)=>{
            if(response == "Modif de l'actu OK !"){
              this.cahierQuartService.historiqueActuUpdate(this.idActu).subscribe((response)=>{
                this.popupService.alertSuccessForm('Atualité modifiée !');
                this.ngOnInit();
                this.dialog.closeAll();
              })
            }
          });        
        }
        //Sinon on créé l'actu
        else{
          //Si des utilisateurs ont été sélectionné pour un envoi de mail, on crée une chaine correspondant à la maillist en partant du tableau de mail
          let stringEmail = "";
          if(this.listEmail.length > 0){
            this.listEmail.forEach(email => {
              stringEmail += email+";";
            });
          }
          //@ts-ignore
          this.cahierQuartService.newActu(this.titre,this.importance,dateDebString,dateFinString,this.description, this.forQuart, stringEmail).subscribe((response)=>{
            console.log(response)
            if(response != undefined){
              this.idActu = response['data'][0]['Id'];
              this.cahierQuartService.historiqueActuCreate(this.idActu).subscribe((response)=>{
                this.popupService.alertSuccessForm('Nouvelle actualité créée');
                this.ngOnInit();
                this.dialog.closeAll();
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

  //suppression d'une actu
  deleteActu(id : number){
    Swal.fire({title: "Etes vous sûr de vouloir supprimer cette actu ?" ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService.deleteActu(id).subscribe((response)=>{
          if (response == "Suppression de l'actu OK"){
            this.popupService.alertSuccessForm("L'actu a bien été supprimé !");
          }
          else {
            this.popupService.alertErrorForm("Erreur lors de la suppression de l'actu....")
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
}
