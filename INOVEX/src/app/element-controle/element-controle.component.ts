import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-element-controle',
  templateUrl: './element-controle.component.html',
  styleUrls: ['./element-controle.component.scss']
})
export class ElementControleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //Création éléments contrôle
  onSubmit(form : NgForm) {
    alert("lol");
  }
}
