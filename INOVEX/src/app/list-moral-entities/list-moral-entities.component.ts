import { Component, OnInit } from '@angular/core';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';
import {moralEntity} from "../../models/moralEntity.model";

@Component({
  selector: 'app-list-moral-entities',
  templateUrl: './list-moral-entities.component.html',
  styleUrls: ['./list-moral-entities.component.scss']
})
export class ListMoralEntitiesComponent implements OnInit {

  public moralEntities : moralEntity[] | undefined;

  constructor(private moralEntitiesService : moralEntitiesService) { }

  ngOnInit(): void {
    this.moralEntitiesService.getMoralEntities().subscribe((response)=>{
      // @ts-ignore
      this.moralEntities = response.data;
    });
  }

  //mise à jour du code d'un client
  setCode(idMR : number){
    // @ts-ignore
    while (!code){
      var code = prompt('Veuillez saisir un Code');
    }
    this.moralEntitiesService.setCode(code,idMR).subscribe((response)=>{
      if (response == "Mise à jour du code OK"){
        Swal.fire("Le Code a été mis à jour !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du Code ....',
        })
      }
    });
    this.ngOnInit();
  }

  //mise à jour du prix d'un client
  setPrice(idMR : number){
    // @ts-ignore
    while (!prix){
      var prix = prompt('Veuillez saisir un Prix');
    }
    this.moralEntitiesService.setPrix(prix.replace(',','.'),idMR).subscribe((response)=>{
      if (response == "Mise à jour du prix unitaire OK"){
        Swal.fire("Le Prix a été mis à jour !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du Prix ....',
        })
      }
    });
    this.ngOnInit();
  }

}
