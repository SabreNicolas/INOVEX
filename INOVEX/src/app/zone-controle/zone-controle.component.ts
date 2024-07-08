import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {rondierService} from "../services/rondier.service";
import { user } from 'src/models/user.model';
import { idUsineService } from '../services/idUsine.service';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-zone-controle',
  templateUrl: './zone-controle.component.html',
  styleUrls: ['./zone-controle.component.scss']
})
export class ZoneControleComponent implements OnInit {

  private nom : string;
  private commentaire : string;
  private nbfour : number;
  public numbers : number[]; 
  private four : number;
  public denomination : string;
  public userLogged!: user;
  private idUsine: number;

  constructor(private rondierService : rondierService, private popupService : PopupService, private idUsineService : idUsineService) {
    this.nom ="";
    this.commentaire="";
    this.nbfour = 0;
    //contient des chiffres pour l'itération des fours
    this.numbers = [];
    this.four = 0;
    this.denomination ="";
    this.idUsine=0;
  }

  ngOnInit(): void {
    //Récupération du nombre de four du site
    this.rondierService.nbLigne().subscribe((response)=>{
      //@ts-ignore
      this.nbfour = response.data[0].nbLigne;
      this.numbers = Array(this.nbfour).fill(1).map((x,i) => i+1);
    });

    this.idUsine = this.idUsineService.getIdUsine();
    if(this.idUsine==7){
      this.denomination = "Ronde";
    }
    else this.denomination = "Zone de contrôle";
    
  }

  //création de la zone de controle
  onSubmit(form : NgForm) {
    this.nom = form.value['nom'].replace(/'/g,"''");
    //On affecte la valeur si le four est coché
    if (form.controls['four'].touched){
      this.four = form.value['four'];
    }
    //Sinon 0 pour commun
    else this.four = 0;
    //Gestion commentaire
    if(form.value['commentaire'].length < 1){
      this.commentaire = "_";
    }
    else this.commentaire = form.value['commentaire'].replace(/'/g,"''");

    this.rondierService.createZone(this.nom,this.commentaire,this.four).subscribe((response)=>{
      if (response == "Création de la zone OK"){
        this.popupService.alertSuccessForm("La zone de contrôle a bien été créé !");
      }
      else {
        this.popupService.alertSuccessForm('Erreur lors de la création de la zone de contrôle ....')
      }
    });

    this.resetFields(form);
  }

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']='';
    //form.controls['commentaire'].reset();
    form.value['commentaire']='_';
    form.controls['four'].reset();
    form.value['four'] = 0;
  }

  resetFourZone(form: NgForm) {
    form.controls['four'].reset();
  }

}
