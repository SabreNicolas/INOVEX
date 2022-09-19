import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {user} from "../../models/user.model";
import {rondierService} from "../services/rondier.service";

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent implements OnInit {

  private userLogged : user | undefined;
  public nom : string;
  public prenom : string;
  public MD5pwd : string;
  public login : string;
  public isRondier : number; //0 ou 1
  public isSaisie : number;//0 ou 1
  public isQSE : number;//0 ou 1
  public isRapport : number;//0 ou 1
  public isAdmin : number;//0 ou 1

  constructor(private router : Router, private rondierService : rondierService) {
    this.nom = '';
    this.prenom = '';
    this.MD5pwd ='';
    this.login = '';
    this.isRondier = 0;
    this.isSaisie = 0;
    this.isQSE = 0;
    this.isRapport = 0;
    this.isAdmin = 0;
  }

  ngOnInit(): void {
    window.parent.document.title = 'INOVEX';
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      // @ts-ignore
      this.nom = this.userLogged['Nom'];
      // @ts-ignore
      this.prenom = this.userLogged['Prenom'];
      // @ts-ignore
      this.MD5pwd = this.userLogged['pwd'];
      // @ts-ignore
      this.login = this.userLogged['login'];
      // @ts-ignore
      this.isRondier = this.userLogged['isRondier'];
      // @ts-ignore
      this.isQSE = this.userLogged['isQSE'];
      // @ts-ignore
      this.isRapport = this.userLogged['isRapport'];
      // @ts-ignore
      this.isSaisie = this.userLogged['isSaisie'];
      // @ts-ignore
      this.isAdmin = this.userLogged['isAdmin'];
    }

  }

  navigate(route : string){
    let newRelativeUrl = this.router.createUrlTree([route]);
    let baseUrl = window.location.href.replace(this.router.url, '');

    window.open(baseUrl + newRelativeUrl, '_blank');
  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

}
