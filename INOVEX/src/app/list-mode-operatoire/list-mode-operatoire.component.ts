import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {modeOP} from "../../models/modeOP.models";
import {rondierService} from "../services/rondier.service";
import { PopupService } from '../services/popup.service';
import { zone } from 'src/models/zone.model';
import { MatDialog } from '@angular/material/dialog';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-list-mode-operatoire',
  templateUrl: './list-mode-operatoire.component.html',
  styleUrls: ['./list-mode-operatoire.component.scss']
})
export class ListModeOperatoireComponent implements OnInit {

  @ViewChild('myCreateModeOPDialog') createModeOPDialog = {} as TemplateRef<any>;

  public listModeOP : modeOP[];
  public dialogRef = {};
  public listZone : zone[];
  fileToUpload: File | undefined;
  private nom : string;
  private zoneId : number;

  constructor(private rondierService : rondierService, private popupService : PopupService, private dialog : MatDialog) {
    this.listModeOP = [];
    this.listZone = [];
    this.nom = "";
    this.zoneId = 0;
  }

  ngOnInit(): void {
    this.rondierService.listModeOP().subscribe((response)=>{
      // @ts-ignore
      this.listModeOP = response.data;
    });
    this.rondierService.listZone().subscribe((response)=>{
      // @ts-ignore
      this.listZone = response.data;
    });
  }

  //suppression d'un mode opératoire
  deleteModeOP(modeOP : modeOP){
    //On récupére le nom du fichier dans l'url pour le supprimer du stockage multer
    this.rondierService.deleteModeOP(modeOP.Id,modeOP.fichier.split("/fichiers/")[1]).subscribe((response)=>{
      if (response == "Suppression du modeOP OK"){
        this.popupService.alertSuccessForm("Le mode opératoire a bien été supprimé !");
      }
      else {
        this.popupService.alertErrorForm('Erreur lors de la suppression du mode opératoire....')
      }
    });
    this.ngOnInit();
  }

  //Affichage d'un mode opératoire
  downloadModeOP(urlModeOp : string){
    window.open(urlModeOp, '_blank');
  }

  ouvrirDialogCreerModeOP(){
    this.dialogRef = this.dialog.open(this.createModeOPDialog,{
      width:'60%',
      disableClose:true,
      autoFocus:true,
    })
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.ngOnInit();
    })
  }

  //Création mode opératoire
  onSubmit(form : NgForm) {
    this.nom = form.value['nom'].replace(/'/g,"''");
    this.zoneId = form.value['zone'];
    this.rondierService.createModeOP(this.nom,this.fileToUpload,this.zoneId).subscribe((response)=>{
      if (response == "Création du modeOP OK"){
        this.popupService.alertSuccessForm("Le mode opératoire a bien été créé !");
        this.dialog.closeAll();
      }
      else {
        this.popupService.alertErrorForm('Erreur lors de la création du mode opératoire ....')
      }
    });

    this.resetFields(form);
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
    } else this.popupService.alertErrorForm('Aucun fichier choisi....')
  }

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']="";
    form.controls['zone'].reset();
    form.value['zone']="";
  }

}
