import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {user} from "../../models/user.model";
declare var $ : any;
@Component({
  selector: 'app-saisie-global',
  templateUrl: './saisie-global.component.html',
  styleUrls: ['./saisie-global.component.scss']
})
export class SaisieGlobalComponent implements OnInit {

  public userLogged!: user;
  public idUsine : number;
  public usine : string;
  public isSuperAdmin : boolean;
  public isSaisie : boolean;

  constructor(private router: Router) {
    this.usine="";
    this.isSuperAdmin = false;
    this.isSaisie = false;
    this.idUsine = 0;    
  }

  ngOnInit(): void {
    window.parent.document.title = 'CAP Exploitation - Saisie';

    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      //Récupération de l'idUsine
      // @ts-ignore
      this.idUsine = this.userLogged['idUsine'];
      this.isSaisie = this.userLogged['isSaisie'];
      if(this.userLogged.hasOwnProperty('localisation')){
        //@ts-ignore
        this.usine = this.userLogged['localisation'];
        this.isSuperAdmin = true;
      }
    }

    var loc = document.location.href;
    console.log(loc)
    var tabLoc = loc.split('/');
    if(tabLoc[tabLoc.length - 1] == 'token'){
      console.log($('#token'))
      $('#token').hide()
    }
  }

  toogle(event : any){
    console.log($("#"+event))
    
    $("#"+event).css('text-decoration','underline')
    $("#"+event).css('color','BLUE')
  }
}
