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

  constructor(private rondierService : rondierService) {
    this.nom ="";
    this.commentaire="";
  }

  ngOnInit(): void {
  }

  //création de la zone de controle
  onSubmit(form : NgForm) {
    this.nom = form.value['nom'];
    if(form.value['commentaire'].length < 1){
      this.commentaire = "_";
    }
    else this.commentaire = form.value['commentaire'];
    this.rondierService.createZone(this.nom,this.commentaire).subscribe((response)=>{
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
    form.controls['commentaire'].reset();
    form.value['commentaire']='';
  }

}
