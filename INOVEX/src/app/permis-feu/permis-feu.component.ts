import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {badge} from "../../models/badge.model";
import {rondierService} from "../services/rondier.service";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";

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

  constructor(private rondierService : rondierService, private datePipe : DatePipe) {
    this.listBadge = [];
    this.dateHeureDeb = "";
    this.dateHeureFin = "";
    this.dateHeureFinFormatBDD = "";
    this.badgeId = 0;
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
    this.rondierService.createPermisFeu(this.dateHeureDeb,this.dateHeureFinFormatBDD,this.badgeId).subscribe((response)=>{
      if (response == "Création du permis de feu OK"){
        Swal.fire("Le permis de feu a bien été créé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la création du permis de feu ....',
        })
      }
    });
  }

  generateDateHeureFin(form : NgForm){
    let jour, mois, annee, heure, min;
    this.dateHeureDeb = this.datePipe.transform(form.value['dateHeureDeb'],'yyyy-MM-dd HH:mm');
    // @ts-ignore
    jour = +this.dateHeureDeb.substr(8,2) + 1;
    // @ts-ignore
    mois = this.dateHeureDeb.substr(5,2);
    // @ts-ignore
    annee = this.dateHeureDeb.substr(0,4);
    // @ts-ignore
    heure = this.dateHeureDeb.substr(11,2);
    // @ts-ignore
    min = this.dateHeureDeb.substr(14,2);
    this.dateHeureFin=jour+"/"+mois+"/"+annee+" "+heure+":"+min;
    // @ts-ignore
    this.dateHeureFinFormatBDD = this.datePipe.transform(new Date(annee,mois-1,jour,heure,min),'yyyy-MM-dd HH:mm');//Janvier est 0
  }

}
