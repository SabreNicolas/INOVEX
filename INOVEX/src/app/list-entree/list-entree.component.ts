import { Component, OnInit } from '@angular/core';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';
import {moralEntity} from "../../models/moralEntity.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-list-entree',
  templateUrl: './list-entree.component.html',
  styleUrls: ['./list-entree.component.scss']
})
export class ListEntreeComponent implements OnInit {

  public moralEntities : moralEntity[];
  public debCode : string;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;
  public listDays : string[];

  constructor(private moralEntitiesService : moralEntitiesService) {
    this.debCode = '';
    this.moralEntities = [];
    this.listDays = [];
  }

  ngOnInit(): void {
    this.moralEntitiesService.getMoralEntities(this.debCode).subscribe((response)=>{
      // @ts-ignore
      this.moralEntities = response.data;
      this.getValues();
    });
  }

  setFilters(){
    /* Début prise en compte des filtres*/
    var produitElt = document.getElementById("produit");
    // @ts-ignore
    var produitSel = produitElt.options[produitElt.selectedIndex].value;
    var collecteurElt = document.getElementById("collecteur");
    // @ts-ignore
    var collecteurSel = collecteurElt.options[collecteurElt.selectedIndex].value;
    this.debCode = produitSel+collecteurSel;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  setPeriod(form: NgForm){
    this.listDays = [];
    this.dateDeb = new Date(form.value['dateDeb']);
    this.dateFin = new Date(form.value['dateFin']);
    if(this.dateFin < this.dateDeb){
      form.controls['dateFin'].reset();
      form.value['dateFin']='';
      Swal.fire({
        icon: 'error',
        text: 'La date de Fin est inférieure à la date de Départ !',
      })
    }
    this.listDays = this.getDays(this.dateDeb, this.dateFin);
    this.getValues();
  }

  //récupérer les jours de la période
  getDays(start : Date, end : Date) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
      var dd = String(dt.getDate()).padStart(2, '0');
      var mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = dt.getFullYear();
      var day = dd + '/' + mm + '/' + yyyy;
      arr.push(day);
    }
    return arr;
  };


  //valider la saisie des tonnages
  validation(){
    this.listDays.forEach(date =>
        this.moralEntities.forEach(mr =>{
          var value = (<HTMLInputElement>document.getElementById(mr.Id+'-'+mr.productId+'-'+date)).value.replace(',','.');
          var valueInt : number = +value;
          if (valueInt >0){
            this.moralEntitiesService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),valueInt,mr.productId,mr.Id).subscribe((response)=>{
              if (response == "Création du Measures OK"){
                Swal.fire("Les valeurs ont été insérées avec succès !");
              }
              else {
                Swal.fire({
                  icon: 'error',
                  text: 'Erreur lors de l\'insertion des valeurs ....',
                })
              }
            });
          }
        })
    );
  }

  //TODO : afficher gif loading pendant la récup des données + change navbar width
  //récupérer les tonnages en BDD
  getValues(){
    this.listDays.forEach(date =>
        this.moralEntities.forEach(mr =>{
          this.moralEntitiesService.getEntry(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),mr.productId,mr.Id).subscribe((response)=>{
            if (response.data[0] != undefined && response.data[0].Value!= 0){
              (<HTMLInputElement>document.getElementById(mr.Id+'-'+mr.productId+'-'+date)).value = response.data[0].Value;
            }
          });
        })
    );
  }

  //changer les dates pour saisir hier
  setYesterday(form: NgForm){
    var date = new Date();
    var dd = String(date.getDate() - 1).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var day = yyyy + '-' + mm + '-' + dd;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = day;
    (<HTMLInputElement>document.getElementById("dateFin")).value = day;
    form.value['dateDeb'] = day;
    form.value['dateFin'] = day;
    this.setPeriod(form);
    form.controls['dateDeb'].reset();
    form.value['dateDeb']='';
    form.controls['dateFin'].reset();
    form.value['dateFin']='';
  }

  //changer les dates pour saisir la semaine en cours
  setCurrentWeek(form: NgForm){
    var date = new Date();
    //le début de la semaine par défaut est dimanche (0)
    var firstday = new Date(date.setDate(date.getDate() - date.getDay()+1));
    var lastday = new Date(date.setDate(date.getDate() - date.getDay()+7));
    var ddF = String(firstday.getDate()).padStart(2, '0');
    var mmF = String(firstday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyyF = firstday.getFullYear();
    var firstDayOfWeek = yyyyF + '-' + mmF + '-' + ddF;
    var ddL = String(lastday.getDate()).padStart(2, '0');
    var mmL = String(lastday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyyL = lastday.getFullYear();
    var LastDayOfWeek = yyyyL + '-' + mmL + '-' + ddL;

    (<HTMLInputElement>document.getElementById("dateDeb")).value = firstDayOfWeek;
    (<HTMLInputElement>document.getElementById("dateFin")).value = LastDayOfWeek;
    form.value['dateDeb'] = firstDayOfWeek;
    form.value['dateFin'] = LastDayOfWeek;
    this.setPeriod(form);
    form.controls['dateDeb'].reset();
    form.value['dateDeb']='';
    form.controls['dateFin'].reset();
    form.value['dateFin']='';
  }

  //changer les dates pour saisir le mois en cours
  setCurrentMonth(form: NgForm){
    var date = new Date();
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');

    var Fisrtday = yyyy + '-' + mm + '-' + '01';
    var Lastday = yyyy + '-' + mm + '-' + dd;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = Fisrtday;
    (<HTMLInputElement>document.getElementById("dateFin")).value = Lastday;
    form.value['dateDeb'] = Fisrtday;
    form.value['dateFin'] = Lastday;
    this.setPeriod(form);
    form.controls['dateDeb'].reset();
    form.value['dateDeb']='';
    form.controls['dateFin'].reset();
    form.value['dateFin']='';
  }


}
