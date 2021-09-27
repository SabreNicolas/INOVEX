import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-global',
  templateUrl: './admin-global.component.html',
  styleUrls: ['./admin-global.component.scss']
})
export class AdminGlobalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // @ts-ignore
    while (mdp != "admin") {
      var mdp = prompt("Veuillez saisir le mot de passe pour accéder à l'interface d'Administration :");
    }
  }

}
