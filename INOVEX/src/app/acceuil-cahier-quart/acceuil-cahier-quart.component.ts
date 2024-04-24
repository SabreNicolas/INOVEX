import { Component, OnInit } from '@angular/core';
import { AltairService } from '../services/altair.service';
import { cahierQuartService } from '../services/cahierQuart.service';
import { Actualite } from 'src/models/actualite.model';
@Component({
  selector: 'app-acceuil-cahier-quart',
  templateUrl: './acceuil-cahier-quart.component.html',
  styleUrls: ['./acceuil-cahier-quart.component.scss']
})
export class AcceuilCahierQuartComponent implements OnInit {
  
  public listActu : Actualite[];

  constructor(private altairService : AltairService, private cahierQuartService : cahierQuartService){
    this.listActu = [];

  }
  ngOnInit(): void {
    this.cahierQuartService.getActusActives().subscribe((response)=>{
      // @ts-ignore
      this.listActu = response.data;
    });
  }
}
