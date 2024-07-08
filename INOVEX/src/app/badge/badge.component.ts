import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {rondierService} from "../services/rondier.service";
import {permisFeu} from "../../models/permisFeu.model";
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  private uid : string;

  constructor(private rondierService : rondierService, private popupService : PopupService) {
    this.uid = "";
  }

  ngOnInit(): void {
  }

  //création du badge
  onSubmit(form : NgForm) {
    this.uid = form.value['idBadge'];
    this.rondierService.createBadge(this.uid).subscribe((response)=>{
      if (response == "Création du badge OK"){
        this.rondierService.lastIdBadge().subscribe((response)=>{
          // @ts-ignore
          this.popupService.alertSuccessForm("Badge créé avec succés, il porte le numéro : "+response.data[0].Id,10000);
        });
      }
      else {
        this.popupService.alertSuccessForm('Erreur lors de la création du badge .... Identifiant déjà utilisé')
      }
    });

    this.resetFields(form);
  }

  resetFields(form: NgForm){
    form.controls['idBadge'].reset();
    form.value['idBadge']='';
  }

}
