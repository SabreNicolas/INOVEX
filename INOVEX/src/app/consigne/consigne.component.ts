import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {rondierService} from "../services/rondier.service";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { cahierQuartService } from '../services/cahierQuart.service';

@Component({
  selector: 'app-consigne',
  templateUrl: './consigne.component.html',
  styleUrls: ['./consigne.component.scss']
})
export class ConsigneComponent implements OnInit {

  public desc : string;
  public type : number;
  public dateDebut : Date | undefined;
  private stringDateDebut : string | null;
  public dateFin : Date | undefined;
  private stringDateFin : string | null;
  private idConsigne : number;

  constructor(private rondierService : rondierService,public cahierQuartService : cahierQuartService, private datePipe : DatePipe,private route : ActivatedRoute) {
    this.desc = "";
    this.type = 1;
    this.stringDateFin = "";
    this.stringDateDebut ="";
    this.idConsigne = 0;

    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe(params => {
      if(params.idConsigne != undefined){
        this.idConsigne = params.idConsigne;
      }
      else {
        this.idConsigne = 0;
      }
    });
  }

  ngOnInit(): void {
    if(this.idConsigne != 0){
      this.cahierQuartService.getOneConsigne(this.idConsigne).subscribe((response)=>{
        this.dateDebut = response.data[0]['date_heure_debut'];
        this.desc = response.data[0]['commentaire']
        this.type = response.data[0]['type']
        this.dateFin = response.data[0]['date_heure_fin']
      })
    }
  }

  createConsigne(form : NgForm) {
    this.desc = form.value['desc'];
    this.desc = this.desc.replace("'", " ");
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
      if(this.idConsigne > 0){
        this.rondierService.updateConsigne(this.desc,this.type,this.stringDateFin,this.stringDateDebut,this.idConsigne).subscribe((response)=>{
          if (response == "Modification de la consigne OK"){
            Swal.fire("La consigne a bien été modifiée !");
          }
          else {
            Swal.fire({
              icon: 'error',
              text: 'Erreur lors de la création de la consigne ....',
            })
          }
        });
      }
      else{
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
  }

  resetFields(form: NgForm){
    form.controls['desc'].reset();
    form.controls['dateFin'].reset();
    form.controls['type'].reset();
    form.controls['dateDebut'].reset();
  }

}
