import { Component, OnInit } from '@angular/core';
import {productsService} from "../services/products.service";
import Swal from 'sweetalert2';
import {NgForm} from "@angular/forms";
import {product} from "../../models/products.model";
import {moralEntitiesService} from "../services/moralentities.service";

@Component({
  selector: 'app-list-conso',
  templateUrl: './list-conso.component.html',
  styleUrls: ['./list-conso.component.scss']
})
export class ListConsoComponent implements OnInit {

  public listConsos : product[];
  public listDays : string[];
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;

  constructor(private productsService : productsService, private mrService : moralEntitiesService) {
    this.listConsos = [];
    this.listDays = [];
  }

  ngOnInit(): void {
    this.productsService.getConsos().subscribe((response)=>{
      // @ts-ignore
      this.listConsos = response.data;
      this.getValues();
    });
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
    this.listDays.forEach(day => {
      this.listConsos.forEach(con =>{
        var value = (<HTMLInputElement>document.getElementById(con.Id+'-'+day)).value.replace(',','.');
        var valueInt : number = +value;
        if (valueInt >0.0){
          this.mrService.createMeasure(day.substr(6,4)+'-'+day.substr(3,2)+'-'+day.substr(0,2),valueInt,con.Id,0).subscribe((response)=>{
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
      });
    });
  }


  //récupérer les tonnages en BDD
  getValues(){
    this.listDays.forEach(day => {
      this.listConsos.forEach(con => {
        this.productsService.getValueProducts(day.substr(6, 4) + '-' + day.substr(3, 2) + '-' + day.substr(0, 2),con.Id).subscribe((response) => {
          if (response.data[0] != undefined && response.data[0].Value != 0) {
            (<HTMLInputElement>document.getElementById(con.Id + '-' + day)).value = response.data[0].Value;
          }
          else (<HTMLInputElement>document.getElementById(con.Id + '-' + day)).value = '';
        });
      });
    });
  }

  //changer les dates pour saisir hier
  setYesterday(form: NgForm){
    var date = new Date();
    var dd = String(date.getDate() - 1).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    if(dd = '0'){
      dd = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(2, '0');
      mm = String(date.getMonth()).padStart(2, '0');
    }
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

  //mettre à 0 la value pour modificiation
  delete(Id : number, date : string){
    this.mrService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),0,Id,0).subscribe((response)=>{
      if (response == "Création du Measures OK"){
        Swal.fire("La valeur a bien été supprimé !");
        (<HTMLInputElement>document.getElementById(Id + '-' + date)).value = '';
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de la valeur ....',
        })
      }
    });
  }

}
