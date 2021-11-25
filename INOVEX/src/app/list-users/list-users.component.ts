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
    this.loginLike = login;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  //reset le mot de passe utilisateur à 'temporaire'
  resetPwd(login : string){
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

  //changement droit rondier
  changeRondier(login : string, right : number){
    this.loginService.updateRondier(login,right).subscribe((response)=>{
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
    this.ngOnInit();
  }

  //changement droit saisie
  changeSaisie(login : string, right : number){
    this.loginService.updateSaisie(login,right).subscribe((response)=>{
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
    this.ngOnInit();
  }

  //changement droit qse
  changeQSE(login : string, right : number){
    this.loginService.updateQSE(login,right).subscribe((response)=>{
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
    this.ngOnInit();
  }

  //changement droit rapport
  changeRapport(login : string, right : number){
    this.loginService.updateRapport(login,right).subscribe((response)=>{
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
    this.ngOnInit();
  }

  //changement droit admin
  changeAdmin(login : string, right : number){
    this.loginService.updateAdmin(login,right).subscribe((response)=>{
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
    this.ngOnInit();
  }

}
