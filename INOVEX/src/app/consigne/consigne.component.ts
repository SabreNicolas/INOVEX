import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {rondierService} from "../services/rondier.service";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-consigne',
  templateUrl: './consigne.component.html',
  styleUrls: ['./consigne.component.scss']
})
export class ConsigneComponent implements OnInit {

  private desc : string;
  private type : number;
  private dateDebut : Date | undefined;
  private stringDateDebut : string | null;
  private dateFin : Date | undefined;
  private stringDateFin : string | null;

  constructor(private rondierService : rondierService, private datePipe : DatePipe) {
    this.desc = "";
    this.type = 1;
    this.stringDateFin = "";
    this.stringDateDebut ="";
  }

  ngOnInit(): void {
  }

  onSubmit(form : NgForm) {
    this.desc = form.value['desc'];
    this.desc = this.desc.replace("'", " ").toLowerCase();
    this.desc = this.desc.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, " ");
    this.dateFin = new Date(form.value['dateFin']);
    this.dateDebut = new Date(form.value['dateDebut']);
    this.stringDateFin = this.datePipe.transform(this.dateFin,'yyyy-MM-dd HH:mm');
    this.stringDateDebut = this.datePipe.transform(this.dateDebut,'yyyy-MM-dd HH:mm');
    this.type = form.value['type'];
    if(this.dateDebut != undefined && this.dateDebut > this.dateFin){
      Swal.fire({
        icon: 'error',
        text: 'La date de début et la date de fin ne correspondent pas !',
      })
    }
    else {
      this.rondierService.createConsigne(this.desc,this.type,this.stringDateFin,this.stringDateDebut).subscribe((response)=>{
        if (response == "Création de la consigne OK"){
          Swal.fire("La consigne a bien été créé !");
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la création de la consigne ....',
          })
        }
      });
      this.resetFields(form);
    }
  }

  resetFields(form: NgForm){
    form.controls['desc'].reset();
    form.controls['dateFin'].reset();
    form.controls['type'].reset();
    form.controls['dateDebut'].reset();
  }

}
