import { Component, OnInit } from '@angular/core';
import {rondierService} from "../services/rondier.service";
import {consigne} from "../../models/consigne.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-consignes',
  templateUrl: './list-consignes.component.html',
  styleUrls: ['./list-consignes.component.scss']
})
export class ListConsignesComponent implements OnInit {

  public listConsignes : consigne[];

  constructor(private rondierService : rondierService) {
    this.listConsignes = [];
  }

  ngOnInit(): void {
    this.rondierService.listConsignes().subscribe((response)=>{
      // @ts-ignore
      this.listConsignes = response.data;
    });
  }

  //suppression d'une consigne
  deleteConsigne(id : number){
    this.rondierService.deleteConsigne(id).subscribe((response)=>{
      if (response == "Suppression de la consigne OK"){
        Swal.fire("La consigne a bien été supprimé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de la consigne....',
        })
      }
    });
    this.ngOnInit();
  }

}
