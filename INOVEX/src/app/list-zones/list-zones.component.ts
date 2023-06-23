import { Component, OnInit } from '@angular/core';
import {rondierService} from "../services/rondier.service";
import {zone} from "../../models/zone.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-zones',
  templateUrl: './list-zones.component.html',
  styleUrls: ['./list-zones.component.scss']
})
export class ListZonesComponent implements OnInit {

  public listZone : zone[];

  constructor(private rondierService : rondierService) {
    this.listZone = [];
  }

  ngOnInit(): void {
    this.rondierService.listZone().subscribe((response)=>{
      // @ts-ignore
      this.listZone = response.data;
    });
  }

  //mis à jour du commentaire d'une zone
  setComment(zone : zone){
    var commentaire = prompt('Veuillez saisir un Commentaire',String(zone.commentaire));
    if (commentaire != null){
      // @ts-ignore
      this.rondierService.updateCommentaire(zone.Id,commentaire).subscribe((response)=>{
        if (response == "Mise à jour du commentaire OK"){
          Swal.fire("Le Commentaire a été mis à jour !");
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la mise à jour du Commentaire ....',
          })
        }
      });
      this.ngOnInit();
    }
  }

  //mis à jour du nom d'une zone
  setName(zone : zone){
    var nom = prompt('Veuillez saisir un Nom',String(zone.nom));
    if (nom != null){
      // @ts-ignore
      this.rondierService.updateNomZone(zone.Id,nom).subscribe((response)=>{
        if (response == "Mise à jour du nom OK"){
          Swal.fire("Le Nom a été mis à jour !");
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la mise à jour du Nom ....',
          })
        }
      });
      this.ngOnInit();
    }
  }

  deleteZone(id : number){
    
    Swal.fire({title: 'Êtes-vous sûr(e) de vouloir supprimer cette zone et tout ses éléments ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.rondierService.deleteZone(id).subscribe((response)=>{
            if (response == "Suppression OK"){
              Swal.fire("La zone a été supprimée !");
              this.ngOnInit();
            }
            else {
              Swal.fire({
                icon: 'error',
                text: 'Erreur lors de Suppression ....',
              })
            }
          });
        } 
        else {
          // Pop-up d'annulation de la suppression
          Swal.fire('Annulé','La suprression a été annulée.','error');
        }
      });
  }
  
}
