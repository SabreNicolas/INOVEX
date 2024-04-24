import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import { equipe } from "../../models/equipe.model";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-enregistrement-equipe',
  templateUrl: './list-enregistrement-equipe.component.html',
  styleUrls: ['./list-enregistrement-equipe.component.scss']
})

export class ListEnregistrementEquipeComponent implements OnInit {

  public equipes : any[];

  constructor(public cahierQuartService : cahierQuartService,){
    
    this.equipes = [];

  }

  ngOnInit(): void {
    //On récupère la liste des équipes
    this.cahierQuartService.getEquipesEnregistrees().subscribe((response) =>{  
      this.equipes = response.tabEnregistrementEquipes;
      console.log(this.equipes)
    });

  }

  deleteEquipe(idEquipe : number){
    Swal.fire({title: 'Êtes-vous sûr(e) de vouloir supprimer cette équipe ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.cahierQuartService.deleteEnregistrementAffectationEquipe(idEquipe).subscribe((response) => {
            this.cahierQuartService.deleteEnregistrementEquipe(idEquipe).subscribe((response) => {
              this.ngOnInit();
              Swal.fire('Confirmé','La suprression a été effectuée.','success');
            })
          })
        } 
        else {
          // Pop-up d'annulation de la suppression
          Swal.fire('Annulé','La suprression a été annulée.','error');
        }
      });
  }

}
