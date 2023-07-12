import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { maintenance } from 'src/models/maintenance.model';
import {user} from "../../models/user.model";

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

  constructor() {
    this.usine="";
    this.isSuperAdmin = false;
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
      if(this.userLogged.hasOwnProperty('localisation')){
        //@ts-ignore
        this.usine = this.userLogged['localisation'];
        this.isSuperAdmin = true;
      }
    }
  }
}
