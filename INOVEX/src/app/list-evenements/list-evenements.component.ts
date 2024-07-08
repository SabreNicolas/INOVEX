import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import Swal from "sweetalert2";
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-list-evenements',
  templateUrl: './list-evenements.component.html',
  styleUrls: ['./list-evenements.component.scss']
})
export class ListEvenementsComponent implements OnInit {

  public listEvenement : any[];
  public dateDebString : string;
  public dateFinString : string;

  constructor(public cahierQuartService : cahierQuartService,private popupService : PopupService) {
    this.listEvenement = [];
    this.dateDebString = "";
    this.dateFinString = "";
  }

  ngOnInit(): void {
    this.cahierQuartService.getAllEvenement().subscribe((response)=>{
      // @ts-ignore
      this.listEvenement = response.data;
    });
  }

  //suppression d'un évènement
  deleteEvenement(id : number){
    Swal.fire({title: "Etes vous sûr de vouloir supprimer cet évènement ?" ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService.deleteEvenement(id).subscribe((response)=>{
          if (response == "Suppression de l'evenement OK"){
            this.cahierQuartService.historiqueEvenementDelete(id).subscribe((response)=>{
              this.popupService.alertSuccessForm("L'evenement a bien été supprimé !");
            })
          }
          else {
            this.popupService.alertErrorForm("Erreur lors de la suppression de l'evenement....")
          }
        });
        this.ngOnInit();
      }  
      else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm('La suppression a été annulée.');
      }
    });
  }
}
