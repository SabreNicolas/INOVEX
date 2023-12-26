import { Component, OnInit } from '@angular/core';
import { formulaire } from 'src/models/formulaire.model';
import { productsService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { dateService } from '../services/date.service';
import {moralEntitiesService} from "../services/moralentities.service";

@Component({
  selector: 'app-list-formulaires',
  templateUrl: './list-formulaires.component.html',
  styleUrls: ['./list-formulaires.component.scss']
})
export class ListFormulairesComponent implements OnInit {

  public listFormulaires : formulaire[];

  constructor(private productsService : productsService, private moralEntitiesService : moralEntitiesService, private route : ActivatedRoute,private dateService : dateService) {
    this.listFormulaires=[];
  }

  ngOnInit(): void {
    //On récupère la liste des formulaires
    this.productsService.getFormulaires().subscribe((response)=>{
      // @ts-ignore
      this.listFormulaires = response.data;
    })
  }
  
}
