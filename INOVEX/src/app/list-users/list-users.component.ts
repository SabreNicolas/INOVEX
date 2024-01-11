import { Component, OnInit } from '@angular/core';
import {user} from "../../models/user.model";
import {loginService} from "../services/login.service";
import Swal from "sweetalert2";
import {Md5} from "ts-md5";

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  public listUsers : user[];
  public loginLike : string;

  constructor(private loginService : loginService) {
    this.listUsers = [];
    this.loginLike = "";
  }

  ngOnInit(): void {
    this.loginService.getAllUsers(this.loginLike).subscribe((response)=>{
      // @ts-ignore 
      this.listUsers = response.data;
    });
  }

  setFilters(){
    /* Début prise en compte des filtres*/
    var login = (<HTMLInputElement>document.getElementById('login')).value;
    this.loginLike = login.replace(/'/g,"''");
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  //reset le mot de passe utilisateur à 'temporaire'
  resetPwd(login : string){
    login = login.replace("'","''");
    this.loginService.updatePwd(login,Md5.hashStr('temporaire')).subscribe((response)=>{
      if (response == "Mise à jour du mot de passe OK"){
        Swal.fire("Mot de passe mis à jour avec succès !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du mot de passe ....',
        })
      }
    });
  }
  //Fonction pour attendre
  wait(ms : number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  //changement des droits rondier ou saisie ou qse ou rapports ou chef de quart ou admin
  async changeDroit(login : string, right : number, choix : string){
    this.loginService.updateDroit(login,right,choix).subscribe((response)=>{
      if (response == "Mise à jour du droit OK"){
        Swal.fire("Les droits ont bien été mis à jour !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour des droits',
        })
      }
    });
    await this.wait(50);
    this.ngOnInit();
  }


  //suppression d'un user
  async deleteUser(id : number){
    this.loginService.deleteUser(id).subscribe((response)=>{
      if (response == "Suppression du user OK"){
        Swal.fire("L'utilisateur a bien été supprimé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de l\'utilisateur....',
        })
      }
    });
    await this.wait(50);
    this.ngOnInit();
  }


}
