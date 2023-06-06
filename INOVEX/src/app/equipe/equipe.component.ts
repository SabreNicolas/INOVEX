import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import {user} from "../../models/user.model";
import {zone} from "../../models/zone.model";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.scss']
})
export class EquipeComponent implements OnInit {

  public listUsers : any[];
  public listAjout : any[];
  public listZone : zone[];
  public idEquipe : number;
  public name : string;
  public periode : string;
  public quart : number;

  constructor(private cahierQuartService :cahierQuartService,private route : ActivatedRoute) {
    this.listUsers = [];
    this.listAjout = [];
    this.listZone = [];
    this.name = "";
    this.idEquipe = 0;
    this.periode = "matin";
    this.quart = 0;

    this.route.queryParams.subscribe(params => {
      if(params.idEquipe != undefined){
        this.idEquipe = params.idEquipe;
      }
      else {
        this.idEquipe = 0;
      }
    });
   }

  ngOnInit(): void {
    
    if(this.idEquipe > 0){
      this.cahierQuartService.getOneEquipe(this.idEquipe).subscribe((response) =>{
        this.name = response.data[0]['equipe'];
        this.quart = response.data[0]['quart'];
        if(response.data[0]['quart'] == 1){
          this.periode = "matin";
        }
        else if(response.data[0]['quart'] == 2){
          this.periode = "apres-midi";
        }
        else {
          this.periode = "nuit";
        }
        
        for(var i = 0;i<response.data.length;i++){
          this.listAjout.push({Prenom : response.data[i]['prenomRondier'],Nom : response.data[i]['nomRondier'], Poste : response.data[i]['poste'], Zone : response.data[i]['idZone']});
        }
        console.log(response.data);
      })
    }

    this.cahierQuartService.getUsersRondierSansEquipe().subscribe((response)=>{
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

    for(const user of this.listAjout){
      var rechercheZone = user.Nom +"_"+user.Prenom+"_zone";
      var idZone = parseInt((<HTMLInputElement>document.getElementById(rechercheZone)).value);
      if(idZone ===0){
        Swal.fire('Veuillez affecter une ronde à chaque personne !','La saisie a été annulée.','error');
        return
      }
    }
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
          if (this.idEquipe > 0){
            this.update(quartNombre);
          }
          else{
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
          
        } 
        else {
          // Pop-up d'annulation de la suppression
          Swal.fire('Annulé','La création a été annulée.','error');
        }
      });
    }
    
  }

  ajoutUser(user :user){
    this.listAjout.push(user);

    let indexRomove = this.listUsers.findIndex( item => item.Nom === user.Nom && item.Prenom == user.Prenom);
    
    if(indexRomove != -1){
      this.listUsers.splice(indexRomove,1);
    }
  }

  suppUser(user :user){
    this.listUsers.unshift(user);

    let indexRomove = this.listAjout.findIndex( item => item.Nom === user.Nom && item.Prenom == user.Prenom);
    
    if(indexRomove != -1){
      this.listAjout.splice(indexRomove,1);
    }
  }

  update(quartNombre : number){
    console.log(this.quart);
    this.cahierQuartService.udpateEquipe(this.name,quartNombre,this.idEquipe).subscribe((response) => {
              (<HTMLInputElement>document.getElementById("nomEquipe")).value ="";
             
              //Requête2
              var idEquipe = response['data'][0]['Id'];
              // for(const user of this.listAjout){
              //   var idUser = user.Id;
              //   var rechercheZone = user.Nom +"_"+user.Prenom+"_zone";
              //   var idZone = parseInt((<HTMLInputElement>document.getElementById(rechercheZone)).value);
              //   var recherchePoste = user.Nom +"_"+user.Prenom+"_poste";
              //   var poste = (<HTMLInputElement>document.getElementById(recherchePoste)).value;
  
              //   if(idUser>0){
              //     this.cahierQuartService.updateAffectationEquipe(idUser,idEquipe,idZone,poste).subscribe((response) => {
              //       Swal.fire('Nouvelle équipe créée','success');
              //       this.listAjout = [];
              //     });
              //   }
              // }
              
            })
  }
}


