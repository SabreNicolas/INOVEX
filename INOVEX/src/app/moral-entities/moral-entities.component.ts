import {Component, Injectable, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-moral-entities',
  templateUrl: './moral-entities.component.html',
  styleUrls: ['./moral-entities.component.scss']
})

export class MoralEntitiesComponent implements OnInit {

  constructor(private moralEntitiesService : moralEntitiesService) { }

  ngOnInit(): void {
  }


  onSubmit(form : NgForm){

    if (form.value['adress']==''){
      this.moralEntitiesService.adress = '_';
    }
    else this.moralEntitiesService.adress = form.value['adress'];

    this.moralEntitiesService.nom = form.value['nom'];
    this.moralEntitiesService.code = form.value['code'];
    this.moralEntitiesService.unitPrice = form.value['unitPrice'].replace(',','.');

    this.moralEntitiesService.createMoralEntity().subscribe((response)=>{
      if (response == "Création du client OK"){
        Swal.fire("Le client a bien été créé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la création du client ....',
        })
      }
    });

    this.resetFields(form);
  }

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']='';
    form.controls['code'].reset();
    form.value['code']='';
    form.controls['adress'].reset();
    form.value['adress']='';
    form.controls['unitPrice'].reset();
    form.value['unitPrice']='';
  }

}
