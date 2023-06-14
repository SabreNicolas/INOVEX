import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cahierQuart',
  templateUrl: './cahierQuart.component.html',
  styleUrls: ['./cahierQuart.component.scss']
})
export class cahierQuart implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.parent.document.title = 'CAP Exploitation - Cahier de Quart';

  }

}
