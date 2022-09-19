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
  deleteModeOP(id : number){
    this.rondierService.deleteModeOP(id).subscribe((response)=>{
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
  downloadModeOP(modeOp : modeOP){
    // @ts-ignore
    var byteArray = new Uint8Array(modeOp.fichier.data);
    var blob = new Blob([byteArray], {type: "application/pdf"});
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  }

}
