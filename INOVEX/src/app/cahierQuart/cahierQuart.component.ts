import { Component, OnInit } from '@angular/core';
import { user } from 'src/models/user.model';

@Component({
  selector: 'app-cahierQuart',
  templateUrl: './cahierQuart.component.html',
  styleUrls: ['./cahierQuart.component.scss']
})
export class cahierQuart implements OnInit {

  public idUsine : number;
  public userLogged!: user;

  constructor() {

    this.idUsine = 0;
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      // @ts-ignore
      this.idUsine = this.userLogged['idUsine'];
    }
  }

  ngOnInit(): void {
    window.parent.document.title = 'CAP Exploitation - Cahier de Quart';

  }

}
