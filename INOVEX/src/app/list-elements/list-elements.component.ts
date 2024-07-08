import { Component, OnInit } from '@angular/core';
import {zone} from "../../models/zone.model";
import {rondierService} from "../services/rondier.service";
import {element} from "../../models/element.model";
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-list-elements',
  templateUrl: './list-elements.component.html',
  styleUrls: ['./list-elements.component.scss']
})
export class ListElementsComponent implements OnInit {

  public listZone : zone[];
  public zoneId : number;
  public listElements : element[];

  constructor(private rondierService : rondierService, private popupService : PopupService) {
    this.listZone = [];
    this.zoneId = 0;
    this.listElements = [];
    this.rondierService.listZone().subscribe((response)=>{
      // @ts-ignore
      this.listZone = response.data;
    });
  }

  ngOnInit(): void {
    this.rondierService.listElementofZone(this.zoneId).subscribe((response)=>{
      // @ts-ignore
      this.listElements = response.data;
    });
  }

  setFilters(){
    /* Début prise en compte des filtres*/
    var zoneElt = document.getElementById("zone");
    // @ts-ignore
    var zoneSel = zoneElt.options[zoneElt.selectedIndex].value;
    // @ts-ignore
    this.zoneId = zoneSel;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  //suppression d'un element de controle
  deleteElement(id : number){
    this.rondierService.deleteElement(id).subscribe((response)=>{
      if (response == "Suppression de l'élément OK"){
        this.popupService.alertSuccessForm("L'élément de contrôle a bien été supprimé !");
      }
      else {
        this.popupService.alertSuccessForm('Erreur lors de la suppression de l\'élément de contrôle....')
      }
    });
    this.ngOnInit();
  }

  getPreviousItem(index :number){
    if(index > 0){
      return this.listElements[index-1]['idGroupement'];
    }
    return 0;
  }
}
