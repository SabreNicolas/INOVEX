import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //création du badge
  onSubmit(form : NgForm) {
    alert("lol");
  }

}
