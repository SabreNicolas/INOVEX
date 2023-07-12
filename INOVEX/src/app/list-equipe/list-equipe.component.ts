import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import { equipe } from "../../models/equipe.model";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-equipe',
  templateUrl: './list-equipe.component.html',
  styleUrls: ['./list-equipe.component.scss'],
})
export class ListEquipeComponent implements OnInit {
  
  public equipes : equipe[];
  public periode : string ;

  constructor(public cahierQuartService : cahierQuartService){
    this.equipes = [];
    this.periode = "";
  }

  ngOnInit(): void {
    //On récupère la liste des équipes
    this.cahierQuartService.getEquipes().subscribe((response) =>{  
      this.equipes = response.tabEquipes;
    })
  }

  //Fonction qui permet d'agrandir une card contenant les informations sur une équipe
  toggleCardSize(equipe: equipe) {
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id+"_overlay").classList.add("show"));
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id).classList.add("expanded"))
    console.log((<HTMLElement>document.getElementById(equipe.equipe)))
  }
  
  //Fonction qui permet de fermer une card
  closeCard(equipe: equipe) {
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id).classList.toggle("expanded"))
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id+"_overlay").classList.toggle("show"));
  }

  deleteEquipe(idEquipe : number){
    Swal.fire({title: 'Êtes-vous sûr(e) de vouloir supprimer cette équipe ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.cahierQuartService.deleteAffectationEquipe(idEquipe).subscribe((response) => {
            this.cahierQuartService.deleteEquipe(idEquipe).subscribe((response) => {
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


