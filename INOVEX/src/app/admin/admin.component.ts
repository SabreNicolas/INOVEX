import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // @ts-ignore
    while (mdp != "admin") {
      var mdp = prompt("Veuillez saisir le mot de passe pour accéder à l'interface d'Administration :");
    }
  }

}
