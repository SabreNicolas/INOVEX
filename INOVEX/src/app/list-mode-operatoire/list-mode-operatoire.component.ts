import { Component, OnInit } from '@angular/core';
import {modeOP} from "../../models/modeOP.models";
import {rondierService} from "../services/rondier.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-mode-operatoire',
  templateUrl: './list-mode-operatoire.component.html',
  styleUrls: ['./list-mode-operatoire.component.scss']
})
export class ListModeOperatoireComponent implements OnInit {

  public listModeOP : modeOP[];

  constructor(private rondierService : rondierService) {
    this.listModeOP = [];
  }

  ngOnInit(): void {
    this.rondierService.listModeOP().subscribe((response)=>{
      // @ts-ignore
      this.listModeOP = response.data;
    });
  }

  //suppression d'un mode opératoire
  deleteModeOP(modeOP : modeOP){
    //On récupére le nom du fichier dans l'url pour le supprimer du stockage multer
    this.rondierService.deleteModeOP(modeOP.Id,modeOP.fichier.split("/fichiers/")[1]).subscribe((response)=>{
      if (response == "Suppression du modeOP OK"){
        Swal.fire("Le mode opératoire a bien été supprimé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression du mode opératoire....',
        })
      }
    });
    this.ngOnInit();
  }

  //Affichage d'un mode opératoire
  downloadModeOP(urlModeOp : string){
    window.open(urlModeOp, '_blank');
  }

}
