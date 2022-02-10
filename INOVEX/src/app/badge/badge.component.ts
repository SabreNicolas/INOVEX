import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {rondierService} from "../services/rondier.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  private uid : string;

  constructor(private rondierService : rondierService) {
    this.uid = "";
  }

  ngOnInit(): void {
  }

  //création du badge
  onSubmit(form : NgForm) {
    this.uid = form.value['idBadge'];
    this.rondierService.createBadge(this.uid).subscribe((response)=>{
      if (response == "Création du badge OK"){
        Swal.fire("Le badge a bien été créé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la création du badge ....',
        })
      }
    });

    this.resetFields(form);
  }

  resetFields(form: NgForm){
    form.controls['idBadge'].reset();
    form.value['idBadge']='';
  }

}
