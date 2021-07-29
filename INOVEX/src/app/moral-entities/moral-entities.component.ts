import {Component, Injectable, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import {moralEntitiesService} from "../services/moralentities.service";

@Component({
  selector: 'app-moral-entities',
  templateUrl: './moral-entities.component.html',
  styleUrls: ['./moral-entities.component.scss']
})

export class MoralEntitiesComponent implements OnInit {

  constructor(private moralEntitiesService : moralEntitiesService) { }

  ngOnInit(): void {
  }

  //TODO : rendre obligatoire tout sauf adresse
  onSubmit(form : NgForm){
    alert("Valider frerot");

    if (form.value['adress']==''){
      this.moralEntitiesService.adress = '_';
    }
    else this.moralEntitiesService.adress = form.value['adress'];

    this.moralEntitiesService.nom = form.value['nom'];
    this.moralEntitiesService.code = form.value['code'];
    this.moralEntitiesService.unitPrice = form.value['unitPrice'];

    this.moralEntitiesService.createMoralEntity().subscribe((response)=>{
      alert(response);
    });

  }

}
