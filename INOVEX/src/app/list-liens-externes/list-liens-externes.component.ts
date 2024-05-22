import { Component } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-liens-externes',
  templateUrl: './list-liens-externes.component.html',
  styleUrls: ['./list-liens-externes.component.scss']
})
export class ListLiensExternesComponent {

  public listLien : any[];
  public nom : string;
  public url : string;

  constructor(public cahierQuartService : cahierQuartService,) {
    this.listLien = [];
    this.nom = "";
    this.url = "";
  }
  
  ngOnInit(): void {
    this.cahierQuartService.getAllLiensExternes().subscribe((response)=>{
      // @ts-ignore
      this.listLien = response.data;
    });
  }

  activerLien(id:number, isActif : number){
    if(isActif == 1){
      this.cahierQuartService.desactiverLien(id).subscribe((response)=>{
        this.ngOnInit();
      });
    }
    else{
      this.cahierQuartService.activerLien(id).subscribe((response)=>{
        this.ngOnInit();
      });
    }
  }
  
  //suppression d'un lien
  deleteLienExterne(id : number){
    this.cahierQuartService.deleteLienExterne(id).subscribe((response)=>{
      if (response == "Suppression du lien OK"){
        Swal.fire("Le lien a bien été supprimé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression du lien....',
        })
      }
    });
    this.ngOnInit();
  }
}
