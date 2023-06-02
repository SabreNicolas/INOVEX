import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-list-equipe',
  templateUrl: './list-equipe.component.html',
  styleUrls: ['./list-equipe.component.scss'],
})
export class ListEquipeComponent implements OnInit {
  
  constructor(private location : Location){}

  ngOnInit(): void {
    const currentLocation = this.location.path();
    console.log(currentLocation);
  }


}


