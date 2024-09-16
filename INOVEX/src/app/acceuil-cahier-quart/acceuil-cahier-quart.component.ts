import { Component, OnInit } from '@angular/core';
import { AltairService } from '../services/altair.service';
import { cahierQuartService } from '../services/cahierQuart.service';
import { Actualite } from 'src/models/actualite.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-acceuil-cahier-quart',
  templateUrl: './acceuil-cahier-quart.component.html',
  styleUrls: ['./acceuil-cahier-quart.component.scss']
})
export class AcceuilCahierQuartComponent implements OnInit {
  
  public listActu : Actualite[];
  public listLien : any[];
  private token: string;
  public listMaintenance : any[];

  constructor(private altairService : AltairService, private cahierQuartService : cahierQuartService, private router : Router){
    this.listActu = [];
    this.listLien = [];
    this.token = "";
    this.listMaintenance = [];
  }
  ngOnInit(): void {
    this.cahierQuartService.getActusQuart(0).subscribe((response)=>{
      // @ts-ignore
      this.listActu = response.data;
    });
    this.cahierQuartService.getActifsLiensExternes().subscribe((response)=>{
      // @ts-ignore
      this.listLien = response.data;
    });

    this.altairService.login().subscribe((response)=>{
      this.token = response.token

      this.altairService.getMaintenance(this.token).subscribe((response)=>{
        // this.listMaintenance= response.workorder;
      })
    })
  }

  finQuart() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  splitDescription(descr: string) {
    return descr.split('\n');
  }
  
}