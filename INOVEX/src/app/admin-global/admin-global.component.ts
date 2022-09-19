import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-global',
  templateUrl: './admin-global.component.html',
  styleUrls: ['./admin-global.component.scss']
})
export class AdminGlobalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.parent.document.title = 'INOVEX - Admin';
  }

  download(file : string){
    window.open(file, '_blank');
  }

}
