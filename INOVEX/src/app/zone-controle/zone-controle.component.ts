import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import {rondierService} from "../services/rondier.service";

@Component({
  selector: 'app-zone-controle',
  templateUrl: './zone-controle.component.html',
  styleUrls: ['./zone-controle.component.scss']
})
export class ZoneControleComponent implements OnInit {

  private nom : string;
  private commentaire : string;
  private four1 : number;
  private four2 : number;

  constructor(private rondierService : rondierService) {
    this.nom ="";
    this.commentaire="";
    this.four1 = 0;
    this.four2 = 0;
  }

  ngOnInit(): void {
  }

  //création de la zone de controle
  onSubmit(form : NgForm) {
    this.nom = form.value['nom'];
    //Gestion Four
    if(form.value['choixFour'] ===1) {
      this.four1 = 1;
      this.four2 = 0;
    }
    else if(form.value['choixFour'] ===2) {
      this.four2 = 1;
      this.four1 = 0;
    }
    else {
      this.four2 = 0;
      this.four1 = 0;
    }
    //Gestion commentaire
    if(form.value['commentaire'].length < 1){
      this.commentaire = "_";
    }
    else this.commentaire = form.value['commentaire'];


    this.rondierService.createZone(this.nom,this.commentaire,this.four1,this.four2).subscribe((response)=>{
      if (response == "Création de la zone OK"){
        Swal.fire("La zone de contrôle a bien été créé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la création de la zone de contrôle ....',
        })
      }
    });

    this.resetFields(form);
  }

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']='';
    form.controls['choixFour'].reset();
  }

}
