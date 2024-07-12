import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import {Actualite} from "../../models/actualite.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-actus',
  templateUrl: './list-actus.component.html',
  styleUrls: ['./list-actus.component.scss']
})
export class ListActusComponent implements OnInit {

  public listActu : Actualite[];
  public dateDebString : string;
  public dateFinString : string;

  constructor(public cahierQuartService : cahierQuartService,) {
    this.listActu = [];
    this.dateDebString = "";
    this.dateFinString = "";
  }
  
  ngOnInit(): void {
    this.cahierQuartService.getAllActu().subscribe((response)=>{
      // @ts-ignore
      this.listActu = response.data;
    });
  }

  terminerActu(id:number, isValide : number){
    console.log(isValide)
    if(isValide == 1){
      this.cahierQuartService.invaliderActu(id).subscribe((response)=>{
        this.ngOnInit();
      });
    }
    else{
      this.cahierQuartService.validerActu(id).subscribe((response)=>{
        this.ngOnInit();
      });
    }
    
  }
}
