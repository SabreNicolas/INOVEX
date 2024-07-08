import { Component, OnInit } from '@angular/core';
import {rondierService} from "../services/rondier.service";
import {consigne} from "../../models/consigne.model";
import Swal from "sweetalert2";
import { cahierQuartService } from '../services/cahierQuart.service';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-list-consignes',
  templateUrl: './list-consignes.component.html',
  styleUrls: ['./list-consignes.component.scss']
})
export class ListConsignesComponent implements OnInit {

  public listConsignes : any[];

  constructor(private rondierService : rondierService,public cahierQuartService : cahierQuartService, private popupService : PopupService) {
    this.listConsignes = [];
  }

  ngOnInit(): void {
    this.rondierService.listAllConsignes().subscribe((response)=>{
      // @ts-ignore
      this.listConsignes = response.data;
    });
  }

  //suppression d'une consigne
  deleteConsigne(id : number){
    this.rondierService.deleteConsigne(id).subscribe((response)=>{
      if (response == "Suppression de la consigne OK"){
        this.cahierQuartService.historiqueConsigneDelete(id).subscribe((response)=>{
          this.popupService.alertSuccessForm("La consigne a bien été supprimé !");
        })
      }
      else {
        this.popupService.alertErrorForm('Erreur lors de la suppression de la consigne....')
      }
    });
    this.ngOnInit();
  }

  downloadFile(consigne : string){
    window.open(consigne, '_blank');
  }

}
