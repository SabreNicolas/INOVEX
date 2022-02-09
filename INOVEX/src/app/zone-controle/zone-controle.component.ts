import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-zone-controle',
  templateUrl: './zone-controle.component.html',
  styleUrls: ['./zone-controle.component.scss']
})
export class ZoneControleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //création zone de controle
  onSubmit(form : NgForm) {
    alert("lol");
  }

}
