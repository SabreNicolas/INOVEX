import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import {product} from "../../models/products.model";
import { moralEntitiesService } from '../services/moralentities.service';
import { productsService } from '../services/products.service';

@Component({
  selector: 'app-list-qse',
  templateUrl: './list-qse.component.html',
  styleUrls: ['./list-qse.component.scss']
})
export class ListQseComponent implements OnInit {

  public listQse : product [];
  public listDays : string;


  constructor(private productsService : productsService, private moralEntitiesService: moralEntitiesService) { 
    this.listQse = [];
    this.listDays = '';
  }

  ngOnInit(): void {
    this.productsService.getQse().subscribe((response)=>{
      // @ts-ignore
      this.listQse = response.data;
    })
  }

  // permet d'actualiser la date choisi
  setPeriod(form: NgForm){
    this.listDays = '';
    var date = new Date(form.value['dateDeb']);
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');
    this.listDays = dd + '/' + mm + '/' + yyyy;
    this.getValues();
  }

  //changer les dates pour saisir le mois précédent
  setLastMonth(form: NgForm){
    var date = new Date();
    var mm = String(date.getMonth()).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    var Lastday = yyyy + '-' + mm;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = Lastday;
    form.value['dateDeb'] = Lastday;
    this.setPeriod(form);
  }

   //récupérer les valeurs en BDD
  getValues() {
    this.listQse.forEach(cp => {
      this.moralEntitiesService.getEntry(this.listDays.substr(6, 4) + '-' + this.listDays.substr(3, 2) + '-' + this.listDays.substr(0, 2), cp.Id, 0).subscribe((response) => {
        if (response.data[0] != undefined && response.data[0].Value != 0) {
          (<HTMLInputElement>document.getElementById(cp.Code + '-' + this.listDays)).value = response.data[0].Value;
        }
        else (<HTMLInputElement>document.getElementById(cp.Code + '-' + this.listDays)).value = '';
      });
    });
  }

  //valider les saisies
  validation(){
    this.listQse.forEach(cp =>{
      let value = (<HTMLInputElement>document.getElementById(cp.Code+'-'+this.listDays)).value.replace(',','.');
      let valueInt : number = +value;
      if (valueInt >0.0){
        this.moralEntitiesService.createMeasure(this.listDays.substr(6,4)+'-'+this.listDays.substr(3,2)+'-'+this.listDays.substr(0,2),valueInt,cp.Id, 0).subscribe((response)=>{
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
  }

  //mettre à 0 la value pour modificiation
  delete(Id : number, date : string, Code: string){
    this.moralEntitiesService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),0,Id, 0).subscribe((response)=>{
      if (response == "Création du Measures OK"){
        Swal.fire("La valeur a bien été supprimé !");
        (<HTMLInputElement>document.getElementById(Code + '-' + date)).value = '';
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

