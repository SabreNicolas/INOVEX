import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {rondierService} from "../services/rondier.service";
import {DatePipe} from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { cahierQuartService } from '../services/cahierQuart.service';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-consigne',
  templateUrl: './consigne.component.html',
  styleUrls: ['./consigne.component.scss']
})
export class ConsigneComponent implements OnInit {

  public titre : string
  public desc : string;
  public type : number;
  public dateDebut : Date | undefined;
  private stringDateDebut : string | null;
  public dateFin : Date | undefined;
  private stringDateFin : string | null;
  public idConsigne : number;
  fileToUpload: File | undefined;
  public imgSrc !: any
  public dupliquer : number;


  constructor(private rondierService : rondierService, private popupService : PopupService, public cahierQuartService : cahierQuartService, private datePipe : DatePipe,private route : ActivatedRoute) {
    this.desc = "";
    this.titre ="";
    this.type = 1;
    this.stringDateFin = "";
    this.stringDateDebut ="";
    this.idConsigne = 0;
    this.dupliquer = 0;

    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe(params => {
      if(params.idConsigne != undefined){
        this.idConsigne = params.idConsigne;
      }
      else {
        this.idConsigne = 0;
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
    if(this.idConsigne != 0){
      this.cahierQuartService.getOneConsigne(this.idConsigne).subscribe((response)=>{
        this.titre = response.data[0]['titre'];
        this.dateDebut = response.data[0]['date_heure_debut'];
        this.desc = response.data[0]['commentaire'];
        this.type = response.data[0]['type'];
        if(response.data[0]['date_heure_fin'] != "2099-01-01 00:00"){
          this.dateFin = response.data[0]['date_heure_fin']
        }
        if(this.dupliquer == 1){
          this.idConsigne = 0
        }
      })
    }
  }

  createConsigne(form : NgForm) {
    this.desc = form.value['desc'];
    this.desc = this.desc.replace("'", " ");
    this.desc = this.desc.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, " ");

    if(this.dateFin == undefined){
      this.dateFin = new Date("2099-01-01 00:00");
      this.stringDateFin = "2099-01-01 00:00";
    }
    else {
      this.dateFin = new Date(form.value['dateFin']);
    }
    this.dateDebut = new Date(form.value['dateDebut']);
    this.stringDateFin = this.datePipe.transform(this.dateFin,'yyyy-MM-dd HH:mm');
    this.stringDateDebut = this.datePipe.transform(this.dateDebut,'yyyy-MM-dd HH:mm');
    this.type = form.value['type'];
    
    if(this.titre == ''){
      this.popupService.alertErrorForm('Veuillez renseigner un titre !')
      return;
    }
    
    if(this.dateDebut != undefined && this.dateDebut > this.dateFin){
      this.popupService.alertErrorForm('La date de début et la date de fin ne correspondent pas !')
    }
    else {
      if(this.idConsigne > 0){
        this.rondierService.updateConsigne(this.titre,this.desc,this.type,this.stringDateFin,this.stringDateDebut,this.idConsigne).subscribe((response)=>{
          if (response == "Modification de la consigne OK"){
            this.cahierQuartService.historiqueConsigneUpdate(this.idConsigne).subscribe((response)=>{
              this.popupService.alertSuccessForm("La consigne a bien été modifiée !");
            })
          }
          else {
            this.popupService.alertErrorForm('Erreur lors de la création de la consigne ....')
          }
        });
      }
      else{
        //@ts-ignore
        this.rondierService.createConsigne(this.titre,this.desc,this.type,this.stringDateFin,this.stringDateDebut,this.fileToUpload).subscribe((response)=>{
          if (response != undefined){
            this.idConsigne = response['data'][0]['Id'];
            this.cahierQuartService.historiqueConsigneCreate(this.idConsigne).subscribe((response)=>{
              this.popupService.alertSuccessForm("La consigne a bien été créé !");
            })
          }
          else {
            this.popupService.alertErrorForm('Erreur lors de la création de la consigne ....')
          }
        });
        this.resetFields(form);
      }
    }
  }

  resetFields(form: NgForm){
    form.controls['desc'].reset();
    form.controls['dateFin'].reset();
    // form.controls['type'].reset();
    form.controls['dateDebut'].reset();
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

}
