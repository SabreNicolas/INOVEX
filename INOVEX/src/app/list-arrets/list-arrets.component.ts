import { Component, OnInit } from '@angular/core';
import {arretsService} from "../services/arrets.service";
import {arret} from "../../models/arrets.model";
import {NgForm} from "@angular/forms";
import {sumArret} from "../../models/sumArret.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-arrets',
  templateUrl: './list-arrets.component.html',
  styleUrls: ['./list-arrets.component.scss']
})
export class ListArretsComponent implements OnInit {

  public listArrets : arret[];
  public sumArrets : sumArret[];
  public stringDateDebut : string;
  public stringDateFin : string;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;

  constructor(private arretsService : arretsService) {
    this.listArrets = [];
    this.sumArrets = [];
    this.stringDateDebut = '';
    this.stringDateFin = '';
  }

  ngOnInit(): void {
    this.arretsService.getArrets(this.stringDateDebut,this.stringDateFin).subscribe((response)=>{
      // @ts-ignore
      this.listArrets = response.data;
    });

    this.arretsService.getArretsType(this.stringDateDebut,this.stringDateFin).subscribe((response)=>{
      // @ts-ignore
      this.sumArrets = response.data;
      this.arretsService.getArretsSum1(this.stringDateDebut,this.stringDateFin).subscribe((response)=>{
        // @ts-ignore
        this.sumArrets.push(response.data[0]);
      });
      this.arretsService.getArretsSum2(this.stringDateDebut,this.stringDateFin).subscribe((response)=>{
        // @ts-ignore
        this.sumArrets.push(response.data[0]);
      });
      this.arretsService.getArretsSum(this.stringDateDebut,this.stringDateFin).subscribe((response)=>{
        // @ts-ignore
        this.sumArrets.push(response.data[0]);
      });
    });
  }

  setPeriod(form: NgForm) {
    this.dateDeb = new Date(form.value['dateDeb']);
    this.dateFin = new Date(form.value['dateFin']);
    if (this.dateFin < this.dateDeb) {
      form.controls['dateFin'].reset();
      form.value['dateFin'] = '';
      Swal.fire({
        icon: 'error',
        text: 'La date de Fin est inférieure à la date de Départ !',
      })
    }
    else {
      var mmF = String(this.dateDeb.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyyF = this.dateDeb.getFullYear();
      var ddF = String(this.dateDeb.getDate()).padStart(2, '0');
      this.stringDateDebut = yyyyF + '-' + mmF + '-' + ddF;
      var mmL = String(this.dateFin.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyyL = this.dateFin.getFullYear();
      var ddL = String(this.dateFin.getDate()).padStart(2, '0');
      this.stringDateFin = yyyyL + '-' + mmL + '-' + ddL;
      this.ngOnInit();
    }
  }


  //changer les dates pour afficher le mois en cours
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

  //changer les dates pour afficher le mois en dernier
  setLastMonth(form: NgForm){
    var date = new Date();
    var mm = String(date.getMonth()).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dd = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(2, '0');

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

  //Suppression d'un arret
  delete(id : number){
    this.arretsService.deleteArret(id).subscribe((response)=>{
      if (response == "Suppression de l'arrêt OK"){
        Swal.fire("L'arrêt a bien été supprimé !");
        this.ngOnInit();
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de l\'arrêt ....',
        })
      }
    });
  }

}
