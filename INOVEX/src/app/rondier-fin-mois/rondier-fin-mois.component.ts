import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {element} from "../../models/element.model";
import {rondierService} from "../services/rondier.service";
import {productsService} from "../services/products.service";
import Swal from "sweetalert2";
import {product} from "../../models/products.model";

@Component({
  selector: 'app-rondier-fin-mois',
  templateUrl: './rondier-fin-mois.component.html',
  styleUrls: ['./rondier-fin-mois.component.scss']
})
export class RondierFinMoisComponent implements OnInit {

  public listCompteursRondier : element[];
  public listCompteurs : product[];
  public listDays : string[];

  constructor(private productsService : productsService, private rondierService : rondierService) {
    this.listDays = [];
    this.listCompteursRondier = [];
    this.listCompteurs = [];
  }

  ngOnInit(): void {
    //Récupération compteurs Rondier
    this.rondierService.listElementCompteur().subscribe((response)=>{
      // @ts-ignore
      this.listCompteursRondier = response.data;
      //Récupération compteurs INOVEX
      this.productsService.getCompteurs('','').subscribe((response)=>{
        // @ts-ignore
        this.listCompteurs = response.data;
        this.getValues();
      });
    });
  }

  setPeriod(form: NgForm){
    this.listDays = [];
    var date = new Date(form.value['dateDeb']);
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');
    this.listDays.push(dd + '/' + mm + '/' + yyyy);
    this.getValues();
  }

  //changer les dates pour saisir le mois précédent
  setLastMonth(form: NgForm){
    var date = new Date();
    var mm : String;
    var yyyy : number;
    if (date.getMonth() === 0){
      mm = "12";
      yyyy = date.getFullYear()-1;
    }
    else {
      mm = String(date.getMonth()).padStart(2, '0'); //January is 0!
      yyyy = date.getFullYear();
    }

    var Lastday = yyyy + '-' + mm;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = Lastday;
    form.value['dateDeb'] = Lastday;
    this.setPeriod(form);
  }

  //récupérer les valeurs en BDD
  getValues() {
    this.listCompteursRondier.forEach(cp => {
      this.listDays.forEach(day => {
        this.rondierService.valueElementDay(cp.Id,day).subscribe((response) => {
          if (response.data[0] != undefined && response.data[0].value != 0) {
            (<HTMLInputElement>document.getElementById(cp.Id + '-' + day)).value = response.data[0].value;
          } else (<HTMLInputElement>document.getElementById(cp.Id + '-' + day)).value = '';
        });
      });
    });
  }

  //valider les saisies
  validation(){
    this.listCompteursRondier.forEach(cp =>{
      this.listDays.forEach(day => {
          this.listCompteurs.forEach(compteur => {
            //On insère dans la table saisieMenseulle de INOVEX uniquement si les noms correspondent
            if(cp.nom.toLowerCase() === compteur.Name.toLowerCase()){
              var value = (<HTMLInputElement>document.getElementById(cp.Id + '-' + day)).value.replace(',', '.');
              var valueInt: number = +value;
              if (valueInt > 0.0) {
                this.productsService.createMeasure(day.substr(6, 4) + '-' + day.substr(3, 2) + '-' + day.substr(0, 2), valueInt, compteur.Code).subscribe((response) => {
                  if (response == "Création du saisiemensuelle OK") {
                    Swal.fire("Les valeurs ont été insérées avec succès !");
                  } else {
                    Swal.fire({
                      icon: 'error',
                      text: 'Erreur lors de l\'insertion des valeurs ....',
                    })
                  }
                });
              }
            }
          });
      });
    });
  }

  //mettre à 0 la value pour modificiation
  delete(Id : number, date : string){
    /*this.productsService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),0,Code).subscribe((response)=>{
      if (response == "Création du saisiemensuelle OK"){
        Swal.fire("La valeur a bien été supprimé !");
        (<HTMLInputElement>document.getElementById(Code + '-' + date)).value = '';
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de la valeur ....',
        })
      }
    });*/
    alert("delete");
  }

}
