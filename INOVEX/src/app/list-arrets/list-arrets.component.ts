import { Component, OnInit } from '@angular/core';
import {arretsService} from "../services/arrets.service";
import {arret} from "../../models/arrets.model";
import {NgForm} from "@angular/forms";
import {sumArret} from "../../models/sumArret.model";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {depassement} from "../../models/depassement.model";
import {sumDepassement} from "../../models/sumDepassement.model";

@Component({
  selector: 'app-list-arrets',
  templateUrl: './list-arrets.component.html',
  styleUrls: ['./list-arrets.component.scss']
})
export class ListArretsComponent implements OnInit {

  public listArretsDepassements : any[];
  public sumArretsDepassements : any[];
  public stringDateDebut : string;
  public stringDateFin : string;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;
  public isArret : boolean = false; // 'true' si on saisie des arrêts et 'false' si dépassements

  constructor(private arretsService : arretsService, private route : ActivatedRoute, private router : Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; //permet de recharger le component au changement de paramètre
    this.listArretsDepassements = [];
    this.sumArretsDepassements = [];
    this.stringDateDebut = '';
    this.stringDateFin = '';
    this.route.queryParams.subscribe(params => {
      if(params.isArret.includes('true')){
        this.isArret = true;
      }
      else this.isArret = false;
    });
  }

  ngOnInit(): void {
    if (this.isArret == true) {
      this.arretsService.getArrets(this.stringDateDebut, this.stringDateFin).subscribe((response) => {
        // @ts-ignore
        this.listArretsDepassements = response.data;
      });

      this.arretsService.getArretsType(this.stringDateDebut, this.stringDateFin).subscribe((response) => {
        // @ts-ignore
        this.sumArretsDepassements = response.data;
        this.arretsService.getArretsSum1(this.stringDateDebut, this.stringDateFin).subscribe((response) => {
          // @ts-ignore
          this.sumArretsDepassements.push(response.data[0]);
        });
        this.arretsService.getArretsSum2(this.stringDateDebut, this.stringDateFin).subscribe((response) => {
          // @ts-ignore
          this.sumArretsDepassements.push(response.data[0]);
        });
        this.arretsService.getArretsSum(this.stringDateDebut, this.stringDateFin).subscribe((response) => {
          // @ts-ignore
          this.sumArretsDepassements.push(response.data[0]);
        });
      });
    }

    /**
     * Dépassements 1/2 heures
     */
    else {
      this.arretsService.getDepassements(this.stringDateDebut, this.stringDateFin).subscribe((response) => {
        // @ts-ignore
        this.listArretsDepassements = response.data;
      });

      this.arretsService.getDepassementsSum1(this.stringDateDebut, this.stringDateFin).subscribe((response) => {
        // @ts-ignore
        this.sumArretsDepassements = response.data;
        this.arretsService.getDepassementsSum2(this.stringDateDebut, this.stringDateFin).subscribe((response) => {
          // @ts-ignore
          this.sumArretsDepassements.push(response.data[0]);
        });
        this.arretsService.getDepassementsSum(this.stringDateDebut, this.stringDateFin).subscribe((response) => {
          // @ts-ignore
          this.sumArretsDepassements.push(response.data[0]);
        });
      });
    }
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
    if (this.isArret == true) {
      this.arretsService.deleteArret(id).subscribe((response) => {
        if (response == "Suppression de l'arrêt OK") {
          Swal.fire("L'arrêt a bien été supprimé !");
          this.ngOnInit();
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la suppression de l\'arrêt ....',
          })
        }
      });
    }

    /**
     * Dépassements 1/2 heures
     */
    else {
      this.arretsService.deleteDepassement(id).subscribe((response) => {
        if (response == "Suppression du DEP OK") {
          Swal.fire("Le dépassement a bien été supprimé !");
          this.ngOnInit();
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la suppression du dépassement ....',
          })
        }
      });
    }
  }

}
