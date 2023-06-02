import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import {user} from "../../models/user.model";
import {zone} from "../../models/zone.model";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import Swal from 'sweetalert2';
@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.scss']
})
export class EquipeComponent implements OnInit {

  public listUsers : user[];
  public listAjout : user[];
  public listZone : zone[];

  constructor(private cahierQuartService :cahierQuartService) {
    this.listUsers = [];
    this.listAjout = [];
    this.listZone = [];
   }

  ngOnInit(): void {
    this.cahierQuartService.getUsersRondier().subscribe((response)=>{
      // @ts-ignore
      this.listUsers = response.data;
      // this.list2.push()
      var userLogged = localStorage.getItem('user');
        if (typeof userLogged === "string") {
            var userLoggedParse = JSON.parse(userLogged);

            //Récupération de l'idUsine
            // @ts-ignore
            var idUsine = userLoggedParse['Nom'];
        }
        this.cahierQuartService.getZones().subscribe((response) =>{
          //@ts-ignore
          this.listZone = response.data;
        })
    })
  }

  onItemDropped(event : CdkDragDrop<any[]>){
    if((event.previousContainer.id === 'listRondier' && event.container.id === 'listAjout' ) || (event.previousContainer.id === 'listAjout' && event.container.id === 'listRondier' ) ){
      const droppedItem = event.previousContainer.data[event.previousIndex];
      event.previousContainer.data.splice(event.previousIndex,1);
      event.container.data.push(droppedItem);
    }
    
    console.log("drop");
  }

  nouvelleEquipe(nomEquipe :string, quart :string){
    var quartNombre;
    if(nomEquipe ===""){
      Swal.fire('Veuillez saisir un nom d\'équipe !','La saisie a été annulée.','error');
    }
    else {
      Swal.fire({title: 'Êtes-vous sûr(e) de créer cette équipe ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          if(quart === "matin"){
            quartNombre = 1;
          }
          else if(quart === "apres-midi"){
            quartNombre = 2;
          }
          else {
            quartNombre = 3;
          }

          this.cahierQuartService.nouvelleEquipe(nomEquipe,quartNombre).subscribe((response) => {
            (<HTMLInputElement>document.getElementById("nomEquipe")).value ="";
           
            //Requête2
            var idEquipe = response['data'][0]['Id'];
            for(const user of this.listAjout){
              var idUser = user.Id;
              var rechercheZone = user.Nom +"_"+user.Prenom+"_zone";
              var idZone = parseInt((<HTMLInputElement>document.getElementById(rechercheZone)).value);
              var recherchePoste = user.Nom +"_"+user.Prenom+"_poste";
              var poste = (<HTMLInputElement>document.getElementById(recherchePoste)).value;

              if(idUser>0){
                this.cahierQuartService.nouvelleAffectationEquipe(idUser,idEquipe,idZone,poste).subscribe((response) => {
                  Swal.fire('Nouvelle équipe créée','success');
                  this.listAjout = [];
                });
              }
            }
            
          })
        } 
        else {
          // Pop-up d'annulation de la suppression
          Swal.fire('Annulé','La création a été annulée.','error');
        }
      });
    }
    
  }

}
