import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {zone} from "../../models/zone.model";
import {rondierService} from "../services/rondier.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-mode-operatoire',
  templateUrl: './mode-operatoire.component.html',
  styleUrls: ['./mode-operatoire.component.scss']
})
export class ModeOperatoireComponent implements OnInit {

  public listZone : zone[];
  fileToUpload: File | null = null;
  private nom : string;
  private zoneId : number;

  constructor(private rondierService : rondierService) {
    this.listZone = [];
    this.nom = "";
    this.zoneId = 0;
  }

  ngOnInit(): void {
    this.rondierService.listZone().subscribe((response)=>{
      // @ts-ignore
      this.listZone = response.data;
    });
  }

  //Création mode opératoire
  onSubmit(form : NgForm) {
    this.nom = form.value['nom'];
    this.zoneId = form.value['zone'];
    this.rondierService.createModeOP(this.nom,this.fileToUpload,this.zoneId).subscribe((response)=>{
      if (response == "Création du modeOP OK"){
        Swal.fire("Le mode opératoire a bien été créé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la création du mode opératoire ....',
        })
      }
    });

    this.resetFields(form);
  }

  //Stockage du fichier chaque fois qu'un fichier est upload
  saveFile(event : Event) {
    // @ts-ignore
    this.fileToUpload = (<HTMLInputElement>event.target).files[0];
  }

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']="";
    form.controls['zone'].reset();
    form.value['zone']="";
  }

}
