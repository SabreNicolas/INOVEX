import { Component, TemplateRef, ViewChild } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import Swal from "sweetalert2";
import { PopupService } from '../services/popup.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-liens-externes',
  templateUrl: './list-liens-externes.component.html',
  styleUrls: ['./list-liens-externes.component.scss']
})
export class ListLiensExternesComponent {

  @ViewChild('myCreateLienDialog') createLienDialog = {} as TemplateRef<any>;
  
  public listLien : any[];
  public nom : string;
  public url : string;
  public idLien : number;
  public dialogRef = {};

  constructor(public cahierQuartService : cahierQuartService,private popupService : PopupService, private dialog : MatDialog) {
    
    this.listLien = [];
    this.nom = "";
    this.url = "";
    this.idLien = 0;

  }
  
  ngOnInit(): void {
    this.cahierQuartService.getAllLiensExternes().subscribe((response)=>{
      // @ts-ignore
      this.listLien = response.data;
    });
    
    this.nom = "";
    this.url = "";
    this.idLien = 0;
  }

  activerLien(id:number, isActif : number){
    if(isActif == 1){
      this.cahierQuartService.desactiverLien(id).subscribe((response)=>{
        this.ngOnInit();
      });
    }
    else{
      this.cahierQuartService.activerLien(id).subscribe((response)=>{
        this.ngOnInit();
      });
    }
  }
  
  //suppression d'un lien
  deleteLienExterne(id : number){
    this.cahierQuartService.deleteLienExterne(id).subscribe((response)=>{
      if (response == "Suppression du lien OK"){
        Swal.fire("Le lien a bien été supprimé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression du lien....',
        })
      }
    });
    this.ngOnInit();
  }

  ouvrirDialogCreerLien(){
    this.dialogRef = this.dialog.open(this.createLienDialog,{
      width:'40%',
      disableClose:false,
      autoFocus:true,
    })
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.idLien = 0;
      this.ngOnInit();
    })
  }
  //Création ou édition d'un lien
  newLienExterne(){
      //Il faut avoir renseigné un nom
      if(this.nom == "" ){
        this.popupService.alertErrorForm('Veuillez renseigner le nom du fichier correspondant au lien. La saisie a été annulée.');
        return;
      }
      //Il faut avoir renseigné un url
      if(this.url == "" ){
        this.popupService.alertErrorForm('Veuillez renseigner l\'url du fichier. La saisie a été annulée.');
        return;
      }
      //Choix de la phrase à afficher en fonction du mode
      if(this.idLien > 0){
        var question = 'Êtes-vous sûr(e) de modifier ce lien ?'
      }
      else var question = 'Êtes-vous sûr(e) de créer ce lien ?'
      //Demande de confirmation de création du lien
      Swal.fire({title: question ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, créer',cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          //Si on est en mode édition d'un lien on va dans la fonction update
          if (this.idLien != 0){
            this.cahierQuartService.updateLienExterne(this.nom,this.url,this.idLien).subscribe((response)=>{
              if(response == "Modif du lien OK !"){
                this.popupService.alertSuccessForm('Lien modifié !');
                this.ngOnInit();
                this.dialog.closeAll();
              }
            });        
          }
          //Sinon on créé le lien
          else{
            this.cahierQuartService.newLienExterne(this.nom,this.url).subscribe((response)=>{
              console.log(response)
              if(response == "Création du lien OK !"){
                this.popupService.alertSuccessForm('Nouveau lien créé');
                this.ngOnInit();
                this.dialog.closeAll();
              }
            });
          }  
        } 
        else {
          // Pop-up d'annulation de la création
          this.popupService.alertErrorForm('La création a été annulée.');
        }
      });
  }

  ouvrirDialogModifActu(id : number){
    this.idLien = id
    this.dialogRef = this.dialog.open(this.createLienDialog,{
      width:'40%',
      disableClose:false,
      autoFocus:true,
    })

    //On récupère l'actu
    this.cahierQuartService.getOneLienExterne(this.idLien).subscribe((response) =>{
      console.log(response.data)
      this.nom = response.data[0]['nom'];
      this.url = response.data[0]['url'];
    })
    
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.idLien = 0;
      this.ngOnInit();
    })
  }
}
