import { Component, OnInit } from '@angular/core';
import {user} from "../../models/user.model";
import {Md5} from "ts-md5";
import {NgForm} from "@angular/forms";
import {loginService} from "../services/login.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-gestion-user',
  templateUrl: './gestion-user.component.html',
  styleUrls: ['./gestion-user.component.scss']
})
export class GestionUserComponent implements OnInit {

  public badOldPwd : boolean;
  public pwdNotMatch : boolean;
  //données dans localStorage
  public storedLogin : string;
  public storedPwdMD5 : string;
  public userLogged : user | undefined;
  //données dans l'interface de saisie
  public pwd1 : string;
  public pwd2 : string;
  public oldPwd : string;

  hideOld : boolean = true;
  hide1 : boolean = true;
  hide2 : boolean = true;

  constructor(private loginService : loginService) {
    this.badOldPwd = true;
    this.pwdNotMatch = true;
    this.storedLogin = "";
    this.storedPwdMD5 = "";
    this.pwd1 = "";
    this.pwd2 = "";
    this.oldPwd = "";
  }

  ngOnInit(): void {
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      // @ts-ignore
      this.storedLogin = this.userLogged['login'];
      // @ts-ignore
      this.storedPwdMD5 = this.userLogged['pwd'];
    }
  }

  onSubmit(form : NgForm) {
    var pwd = form.value['pwd1'];
    var MD5pwd = Md5.hashStr(pwd);
    this.storedLogin = this.storedLogin.replace("'","''");
    this.loginService.updatePwd(this.storedLogin,MD5pwd).subscribe((response)=>{
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

    this.resetFields(form);
  }

  resetFields(form: NgForm){
    form.controls['pwdOld'].reset();
    form.value['pwdOld']='';
    form.controls['pwd1'].reset();
    form.value['pwd1']='';
    form.controls['pwd2'].reset();
    form.value['pwd2']='';
  }


  changeVisibilityOld() {
    this.hideOld = !this.hideOld;
  }

  changeVisibility1() {
    this.hide1 = !this.hide1;
  }

  changeVisibility2() {
    this.hide2 = !this.hide2;
  }

  checkOldPwd(form : NgForm){
    this.oldPwd = form.value['pwdOld'];
    // @ts-ignore
    if(Md5.hashStr(this.oldPwd) == this.storedPwdMD5){
      this.badOldPwd = false;
    }
    else this.badOldPwd = true;
  }

  checkMatchPwd(form : NgForm){
    this.pwd1 = form.value['pwd1'];
    this.pwd2 = form.value['pwd2'];
    // @ts-ignore
    if(this.pwd1 == this.pwd2){
      this.pwdNotMatch = false;
    }
    else this.pwdNotMatch = true;
  }


}
