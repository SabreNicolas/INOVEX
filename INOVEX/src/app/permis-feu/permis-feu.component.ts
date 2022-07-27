import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {badge} from "../../models/badge.model";
import {rondierService} from "../services/rondier.service";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

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
  public isPermisFeu : boolean = false;
  public zone : string;
  public numero : string;

  constructor(private rondierService : rondierService, private datePipe : DatePipe, private route : ActivatedRoute, private router : Router) {
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
        this.isPermisFeu = true;
      }
      else this.isPermisFeu = false;
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
        Swal.fire("Le permis de feu/zone de consignation a bien été créé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la création du permis de feu/zone de consignation ....',
        })
      }
    });
  }

  generateDateHeureFin(form : NgForm){
    this.dateHeureDeb = this.datePipe.transform(form.value['dateHeureDeb'], 'yyyy-MM-dd HH:mm');
    //SI permis de feu on calcule la date de fin = date de début + 24h
    if(this.isPermisFeu) {
      let jour, mois, annee, heure, min;
      // @ts-ignore
      jour = +this.dateHeureDeb.substr(8, 2) + 1;
      // @ts-ignore
      mois = this.dateHeureDeb.substr(5, 2);
      // @ts-ignore
      annee = this.dateHeureDeb.substr(0, 4);
      // @ts-ignore
      heure = this.dateHeureDeb.substr(11, 2);
      // @ts-ignore
      min = this.dateHeureDeb.substr(14, 2);
      this.dateHeureFin = jour + "/" + mois + "/" + annee + " " + heure + ":" + min;
      // @ts-ignore
      this.dateHeureFinFormatBDD = this.datePipe.transform(new Date(annee, mois - 1, jour, heure, min), 'yyyy-MM-dd HH:mm');//Janvier est 0
    }
  }

}
