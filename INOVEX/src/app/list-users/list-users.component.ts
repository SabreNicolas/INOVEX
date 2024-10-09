import { Component, OnInit } from '@angular/core';
import {user} from "../../models/user.model";
import {loginService} from "../services/login.service";
import Swal from "sweetalert2";
import {Md5} from "ts-md5";
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  public listUsers : user[];
  public loginLike : string;

  constructor(private loginService : loginService, private popupService : PopupService) {
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
        this.popupService.alertSuccessForm("Mot de passe mis à jour avec succès !");
      }
      else {
        this.popupService.alertErrorForm('Erreur lors de la mise à jour du mot de passe ....');
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
        this.popupService.alertSuccessForm("Les droits ont bien été mis à jour !");
      }
      else {
        this.popupService.alertErrorForm('Erreur lors de la mise à jour des droits');
      }
    });
    await this.wait(50);
    this.ngOnInit();
  }


  //suppression d'un user
  async deleteUser(id : number){
    this.loginService.deleteUser(id).subscribe((response)=>{
      if (response == "Suppression du user OK"){
        this.popupService.alertSuccessForm("L'utilisateur a bien été supprimé !");
      }
      else {
        this.popupService.alertErrorForm('Impossible de supprimer l\'utilisateur suite à l\'historique des quarts.');
      }
    });
    await this.wait(50);
    this.ngOnInit();
  }

  //changement des infos du user => loginGMAO ou email
  async changeInfos(login : string, info : string, infoValue : string){
    //Pour le poste, on met une liste de choix
    if(info != 'posteUser'){
      //@ts-ignore
      infoValue = prompt("Veuillez saisir le "+info+" de l'utilisateur",infoValue);
    }
    else{
      //choix des postes en dur
      let tabPoste = ['','Adjoint Chef de Quart','Chef de Quart','Intérimaire','Opérateur de Conduite','Rondier/Pontier'];
      
      //Construction des valeurs du menu select qui contient les postes
      let listPoste = {};
      tabPoste.forEach(poste => {
        //@ts-ignore
        listPoste[poste] = poste;
      });

      await Swal.fire({
        title: 'Veuillez choisir un poste',
        input: 'select',
        inputOptions: listPoste,
        showCancelButton: true,
        confirmButtonText: "Valider",
        allowOutsideClick: true,
      })
      .then((result) => {
        if(result.value != undefined){
          infoValue = String(result.value);
        }
        else infoValue = '';
      });
    }
    
    //@ts-ignore
    this.loginService.updateInfos(login,info,infoValue).subscribe((response)=>{
      if (response == "Mise à jour info OK"){
        this.popupService.alertSuccessForm('Les infos ont bien été mis à jour !');
      }
      else {
        this.popupService.alertErrorForm('Erreur lors de la mise à jour des infos');
      }
    });
    await this.wait(50);
    this.ngOnInit();
  }


}
