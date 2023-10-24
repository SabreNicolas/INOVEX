import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import { equipe } from "../../models/equipe.model";
import Swal from 'sweetalert2';
import { consigne } from 'src/models/consigne.model';
import { rondierService } from '../services/rondier.service';

@Component({
  selector: 'app-list-equipe',
  templateUrl: './list-equipe.component.html',
  styleUrls: ['./list-equipe.component.scss'],
})
export class ListEquipeComponent implements OnInit {
  
  public equipes : equipe[];
  public consignes : consigne[];

  constructor(public cahierQuartService : cahierQuartService, public rondierService : rondierService){
    this.equipes = [];
    this.consignes = [];
  }

  ngOnInit(): void {
    //On récupère la liste des équipes
    this.cahierQuartService.getEquipes().subscribe((response) =>{  
      this.equipes = response.tabEquipes;
    });

    //On récupére la liste des consignes en cours de validité
    this.rondierService.listConsignes().subscribe((response) => {
      //@ts-ignore
      this.consignes = response.data;
    });

  }

  //Fonction qui permet d'agrandir une card contenant les informations sur une équipe
  toggleCardSize(equipe: equipe) {

    if(equipe.rondiers.length == 0){
      document.location.href = ('https://fr-couvinove300.prod.paprec.fr:8100/cahierQuart/newEquipe?idEquipe=' + equipe.id);
    }
    else {
      //@ts-ignore
      (<HTMLElement>document.getElementById(equipe.id+"_overlay").classList.add("show"));
      var exp = document.getElementById(String(equipe.id));
      if(exp != null)
      exp.classList.add("expanded");
      //@ts-ignore
      (<HTMLElement>document.getElementById(equipe.id+"_chefQuart").classList.remove("hide"))
    }
  }
  
  //Fonction qui permet de fermer une card
  closeCard(equipe: equipe) {    
    var chef = document.getElementById(equipe.id+"_chefQuart");
    if(chef != null)
    chef.classList.add("hide");
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id).classList.remove("expanded"))
    var over = document.getElementById(equipe.id+"_overlay");
    if(over != null )over.classList.remove("show");
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


