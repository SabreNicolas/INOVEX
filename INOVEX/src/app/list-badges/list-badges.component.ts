import { Component, OnInit } from '@angular/core';
import {rondierService} from "../services/rondier.service";
import {badge} from "../../models/badge.model";
import {badgeAffect} from "../../models/badgeAffect.model";
import Swal from "sweetalert2";
import {permisFeu} from "../../models/permisFeu.model";

@Component({
  selector: 'app-list-badges',
  templateUrl: './list-badges.component.html',
  styleUrls: ['./list-badges.component.scss']
})
export class ListBadgesComponent implements OnInit {

  public listBadgeLibre : badge[];
  public listBadgeUser : badgeAffect[];
  public listBadgeZone : badgeAffect[];
  //contient les permis de feu et zone de consignation => si isPermisFeu = 0 alors zone de consignation
  public listPermisFeu : permisFeu[];


  constructor(private rondierService : rondierService) {
    this.listBadgeLibre = [];
    this.listBadgeUser = [];
    this.listBadgeZone = [];
    this.listPermisFeu = [];
  }


  ngOnInit(): void {
    this.rondierService.listBadgeNonAffect().subscribe((response)=>{
      // @ts-ignore
      this.listBadgeLibre = response.data;
      this.rondierService.listBadgeUser().subscribe((response)=>{
        // @ts-ignore
        this.listBadgeUser = response.data;
        this.rondierService.listBadgeZone().subscribe((response)=>{
          // @ts-ignore
          this.listBadgeZone = response.data;

          this.rondierService.listPermisFeu().subscribe((response)=>{
            // @ts-ignore
            this.listPermisFeu = response.data;
          });
        });
      });
    });
  }

  setActivation(badgeId : number, enabled : number){
    this.rondierService.updateEnabled(badgeId,enabled).subscribe((response)=>{
      if (response == "Mise à jour de l'activation OK"){
        Swal.fire("L'état d'activation a été mis à jour !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors du changement de l\'état d\'activation ....',
        })
      }
    });
    this.ngOnInit();
  }

  resetAffectation(badgeId : number){
    this.rondierService.updateAffectLibre(badgeId).subscribe((response)=>{
      if (response == "Mise à jour de l'affectation OK"){
        Swal.fire("L'affectation a été retiré avec succés !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur.... Impossible de retirer l\'affectation du badge',
        })
      }
    });
    this.ngOnInit();
  }

  deleteBadge(badgeId: number){
    Swal.fire({
      title: 'Êtes-vous sûr(e) ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    })
    .then((result) => {
      if (result.isConfirmed) {
        //Appel api pour supprimer le badge
        this.rondierService.deleteBadge(badgeId).subscribe((response)=>{
          if (response == "Suppression du badge OK"){
            Swal.fire("Le badge a été supprimé !");
            this.ngOnInit();
          }
          else {
            Swal.fire({
              icon: 'error',
              text: 'Erreur.... Impossible de supprimer le badge du badge',
            })
          }
        });
        // Pop-up de supprssion effectuée
        Swal.fire(
          'Supprimé !',
          'Votre élément a été supprimé.',
          'success'
        );
      } 
      else {
        // Pop-up d'annulation de la suppression
        Swal.fire(
          'Annulé',
          'La suppression a été annulée.',
          'error'
        );
      }
    });
  }

}
