import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {badge} from "../../models/badge.model";
import {rondierService} from "../services/rondier.service";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-permis-feu',
  templateUrl: './permis-feu.component.html',
  styleUrls: ['./permis-feu.component.scss']
})
export class PermisFeuComponent implements OnInit {

  public listBadge : badge[];
  public dateHeureDeb : string | null;
  public dateHeureFin : string;
  public dateHeureFinFormatBDD : string | null;
  public badgeId : number;
  public isPermisFeu : number = 0;
  public zone : string;
  public numero : string;

  constructor(private rondierService : rondierService,private popupService : PopupService, private datePipe : DatePipe, private route : ActivatedRoute, private router : Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; //permet de recharger le component au changement de paramètre
    this.listBadge = [];
    this.dateHeureDeb = "";
    this.dateHeureFin = "";
    this.dateHeureFinFormatBDD = "";
    this.badgeId = 0;
    this.zone = "";
    this.numero = "";
    this.route.queryParams.subscribe(params => {
      if(params.isPermisFeu.includes('true')){
        this.isPermisFeu = 1;
      }
      else this.isPermisFeu = 0;
    });
  }

  ngOnInit(): void {
    this.rondierService.listBadgeNonAffect().subscribe((response)=>{
      // @ts-ignore
      this.listBadge = response.data;
    });
  }

  //Création permis de feu
  onSubmit(form : NgForm) {
    this.badgeId = form.value['badge'];
    this.zone = form.value['zone'];
    this.numero = form.value['num'];
    //SI zone de consignation on récupère la date de fin depuis le champ (sinon déjà récupéré
    if(!this.isPermisFeu){
      this.dateHeureFinFormatBDD = this.datePipe.transform(form.value['dateHeureFin'], 'yyyy-MM-dd HH:mm');
    }
    this.rondierService.createPermisFeu(this.dateHeureDeb,this.dateHeureFinFormatBDD,this.badgeId,this.zone,this.isPermisFeu,this.numero).subscribe((response)=>{
      if (response == "Création du permis de feu OK"){
        this.popupService.alertSuccessForm("Le permis de feu/zone de consignation a bien été créé !");
      }
      else {
        this.popupService.alertErrorForm('Erreur lors de la création du permis de feu/zone de consignation ....')
      }
    });
  }

  generateDateHeureFin(form : NgForm){
    this.dateHeureDeb = this.datePipe.transform(form.value['dateHeureDeb'], 'yyyy-MM-dd HH:mm');
    //SI permis de feu on calcule la date de fin = date de début + 24h
    if(this.isPermisFeu) {
      //@ts-ignore
      const date = new Date(this.dateHeureDeb);
      const dateFuture = new Date(date.getTime() + (24*60*60*1000))
     
      const annee = dateFuture.getFullYear();
      const mois = ("0" + (dateFuture.getMonth() + 1)).slice(-2);
      const jour = ("0" + dateFuture.getDate()).slice(-2);
      const heures = ("0" + dateFuture.getHours()).slice(-2);
      const minutes = ("0" + dateFuture.getMinutes()).slice(-2);

      this.dateHeureFin = `${jour}/${mois}/${annee} ${heures}:${minutes}`;

      // @ts-ignore
      this.dateHeureFinFormatBDD = this.datePipe.transform(new Date(annee, mois - 1, jour, heures, minutes), 'yyyy-MM-dd HH:mm');//Janvier est 0
    }
  }

}
