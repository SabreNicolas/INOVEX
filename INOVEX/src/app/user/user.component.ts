import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {loginService} from "../services/login.service";
import {Md5} from "ts-md5";
import Swal from "sweetalert2";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public nom : string;
  public prenom : string;
  public pwd : string;
  public MD5pwd : string;
  public login : string;
  public isRondier : number; //0 ou 1
  public isSaisie : number;//0 ou 1
  public isQSE : number;//0 ou 1
  public isRapport : number;//0 ou 1
  public isAdmin : number;//0 ou 1
  public loginUsed : boolean;

  constructor(private loginService : loginService) {
    this.nom = '';
    this.prenom = '';
    this.pwd = 'temporaire';
    this.MD5pwd = Md5.hashStr(this.pwd);
    this.login = '';
    this.isRondier = 0;
    this.isSaisie = 0;
    this.isQSE = 0;
    this.isRapport = 0;
    this.isAdmin = 0;
    this.loginUsed = false;

  }

  ngOnInit(): void {
  }

  //création de l'utilisateur
  onSubmit(form : NgForm) {
    this.nom = form.value['nom'];
    this.prenom = form.value['prenom'];
    this.login = form.value['identifiant'];

    //GESTION DES DROITS
    var rondier = document.getElementsByName('rondier');
    var saisie = document.getElementsByName('saisie');
    var qse = document.getElementsByName('qse');
    var rapport = document.getElementsByName('rapports');
    var admin = document.getElementsByName('admin');
    if ((<HTMLInputElement>rondier[0]).checked) {
      this.isRondier = 1;
    }
    else this.isRondier = 0;
    if ((<HTMLInputElement>saisie[0]).checked) {
      this.isSaisie = 1;
    }
    else this.isSaisie = 0;
    if ((<HTMLInputElement>qse[0]).checked) {
      this.isQSE = 1;
    }
    else this.isQSE = 0;
    if ((<HTMLInputElement>rapport[0]).checked) {
      this.isRapport = 1;
    }
    else this.isRapport = 0;
    if ((<HTMLInputElement>admin[0]).checked) {
      this.isAdmin = 1;
    }
    else this.isAdmin = 0;

    this.loginService.createUser(this.nom,this.prenom,this.login,this.MD5pwd,this.isRondier,this.isSaisie, this.isQSE, this.isRapport,this.isAdmin).subscribe((response)=>{
      if (response == "Création de l'utilisateur OK"){
        Swal.fire("L'utilisateur a bien été créé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la création de l\'utilisateur ....',
        })
      }
    });

  this.resetFields(form);
}

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']='';
    form.controls['prenom'].reset();
    form.value['prenom']='';
    form.controls['identifiant'].reset();
    form.value['identifiant']='';
  }

  verifLogin(form : NgForm){
    var login = form.value['identifiant'];
    this.loginService.getLogin(login).subscribe((response)=>{
      // @ts-ignore
      if(response.data.length > 0) {
        this.loginUsed = true;
      }
      else {
        this.loginUsed = false;
        this.login = login;
      }
    });
  }

}


