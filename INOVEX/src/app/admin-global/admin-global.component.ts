import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-global',
  templateUrl: './admin-global.component.html',
  styleUrls: ['./admin-global.component.scss']
})
export class AdminGlobalComponent implements OnInit {

  public isSuperAdmin : boolean;

  constructor() { 
    this.isSuperAdmin = false;
  }

  ngOnInit(): void {
    window.parent.document.title = 'CAP Exploitation - Admin';

    //La création de produit est uniquement possible par les superAdmin
    //dans le but d'avoir un référentiel produit unique
    //La création d'un produit, le cré pour l'ensemble des sites
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      //Si une localisation est stocké dans le localstorage, c'est que c'est un superAdmin et qu'il a choisi le site au début
      if(userLoggedParse.hasOwnProperty('localisation')){
        this.isSuperAdmin = true;
      }
    }
  }

  download(file : string){
    window.open(file, '_blank');
  }

}
