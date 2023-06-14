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

  public listUsers : user[];
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

    //Permet de savoir si on est en mode édition ou création
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
    
    //Si on est en mode édition
    if(this.idEquipe > 0){
      //On récupère l'quipe concernée
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
          this.listAjout.push({Id : response.data[i]['idRondier'], Prenom : response.data[i]['prenomRondier'],Nom : response.data[i]['nomRondier'], Poste : response.data[i]['poste'], Zone : response.data[i]['idZone']});
        }
      })
    }

    //On récupère la liste des utilisateurs rondiers sans équipe
    this.cahierQuartService.getUsersRondierSansEquipe().subscribe((response)=>{
      // @ts-ignore
      this.listUsers = response.data;
      // this.list2.push()

        //On récupère les zones disponibles dans cette usine
        this.cahierQuartService.getZones().subscribe((response) =>{
          //@ts-ignore
          this.listZone = response.data;
        })
    })

  }

  //Fonction permettant de gérer le drag and drop
  onItemDropped(event : CdkDragDrop<any[]>){
    if((event.previousContainer.id === 'listRondier' && event.container.id === 'listAjout' ) || (event.previousContainer.id === 'listAjout' && event.container.id === 'listRondier' ) ){
      const droppedItem = event.previousContainer.data[event.previousIndex];
      event.previousContainer.data.splice(event.previousIndex,1);
      event.container.data.push(droppedItem);
    }
  }

  nouvelleEquipe(nomEquipe :string, quart :string){

    var quartNombre;

    //Boucle qui permet de vérifier que chaque utilisateur à bien un poste ou une zone de contrôle
    for(const user of this.listAjout){

      var rechercheZone = user.Nom +"_"+user.Prenom+"_zone";
      var idZone = parseInt((<HTMLInputElement>document.getElementById(rechercheZone)).value);
      if(Number.isNaN(idZone)){
        Swal.fire('Veuillez affecter une ronde à chaque personne !','La saisie a été annulée.','error');
        return
      }

      var recherchePoste = user.Nom +"_"+user.Prenom+"_poste";
      var idPoste = (<HTMLInputElement>document.getElementById(recherchePoste)).value;
      if(idPoste == ""){
        Swal.fire('Veuillez affecter un poste à chaque personne !','La saisie a été annulée.','error');
        return
      }
    }
    if(this.listAjout.length == 0){
      Swal.fire('Veuillez ajouter des personnes à l\'équipe !','La saisie a été annulée.','error');
      return
    }
    //On vérifie si il y a un nom d'équipe
    if(nomEquipe ===""){
      Swal.fire('Veuillez saisir un nom d\'équipe !','La saisie a été annulée.','error');
    }
    else {
      //Demande de confirmation de création d'équipe
      Swal.fire({title: 'Êtes-vous sûr(e) de créer cette équipe ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, créer',cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          //On change le quart en nombre
          if(quart === "matin"){
            quartNombre = 1;
          }
          else if(quart === "apres-midi"){
            quartNombre = 2;
          }
          else {
            quartNombre = 3;
          }
          //Si on est en mode édition d'une équipe on va dans la fonction update
          if (this.idEquipe > 0){
            this.update(quartNombre);
          }
          //Sinon on créé l'équipe
          else{
            this.cahierQuartService.nouvelleEquipe(nomEquipe,quartNombre).subscribe((response) => {
              //On vide les input pour une nouvelle création
              (<HTMLInputElement>document.getElementById("nomEquipe")).value ="";
             
              //On ajoute les rondier dans l'équipe
              var idEquipe = response['data'][0]['Id'];
              this.ajoutAffectationEquipe(idEquipe);
              
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

  //Fonction qui permet d'ajouter les rondiers un par un à une équipe
  ajoutAffectationEquipe(idEquipe : number){
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
  }

  //Fonction qui permet d'ajouter un utilisateur dans la table d'ajout
  ajoutUser(user :user){
    this.listAjout.push(user);

    let indexRomove = this.listUsers.findIndex( item => item.Nom === user.Nom && item.Prenom == user.Prenom);
    
    if(indexRomove != -1){
      this.listUsers.splice(indexRomove,1);
    }
    console.log(this.listAjout);
  }

  //Fonction qui permet de supprimer un utilisateur de la table d'ajout
  suppUser(user :user){
    this.listUsers.unshift(user);

    let indexRomove = this.listAjout.findIndex( item => item.Nom === user.Nom && item.Prenom == user.Prenom);
    
    if(indexRomove != -1){
      this.listAjout.splice(indexRomove,1);
    }
    console.log(this.listAjout);
  }

  //Fonction qui permet de mettre à jour les informations d'une équipe
  update(quartNombre : number){
    this.cahierQuartService.udpateEquipe(this.name,quartNombre,this.idEquipe).subscribe((response) => {      
      var idEquipe = this.idEquipe;
      this.updateAffectationEquipe(idEquipe);      
    })
  }
  
  //Fonction qui permet de changer les rondiers d'une équipe
  updateAffectationEquipe(idEquipe : number){
    this.cahierQuartService.deleteAffectationEquipe(idEquipe).subscribe((response) => {
      this.ajoutAffectationEquipe(idEquipe);
    })
  }
}


