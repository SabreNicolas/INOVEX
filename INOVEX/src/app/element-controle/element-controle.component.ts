import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {rondierService} from "../services/rondier.service";
import {zone} from "../../models/zone.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-element-controle',
  templateUrl: './element-controle.component.html',
  styleUrls: ['./element-controle.component.scss']
})
export class ElementControleComponent implements OnInit {

  public listZone : zone[];
  private nom : string;
  private zoneId : number;
  private valeurMin : number;
  private valeurMax : number;
  private typeChamp : number;
  private isFour : number; //1 pour oui et 0 pour non
  private isGlobal : number;//1 pour oui et 0 pour non
  private unit : string;
  private defaultValue : number;
  private isRegulateur : number;//1 pour oui et 0 pour non

  constructor(private rondierService : rondierService) {
    this.listZone = [];
    this.nom = "";
    this.zoneId = 0;
    this.valeurMin = 0;
    this.valeurMax = 0;
    this.typeChamp = 2;
    this.isFour = 0;
    this.isGlobal = 0;
    this.unit = "_";
    this.defaultValue = 0;
    this.isRegulateur = 0;
  }

  ngOnInit(): void {
    this.rondierService.listZone().subscribe((response)=>{
      // @ts-ignore
      this.listZone = response.data;
    });
  }

  //Création éléments contrôle
  onSubmit(form : NgForm) {
    this.nom = form.value['nom'];
    this.zoneId = form.value['zone'];
    if(form.value['valeurMin'].length > 0){
      this.valeurMin = (form.value['valeurMin'].replace(',','.'));
    }
    if(form.value['valeurMax'].length > 0){
      this.valeurMax = (form.value['valeurMax'].replace(',','.'));
    }
    this.typeChamp = form.value['champ'];
    if(form.value['unit'].length > 0){
      this.unit = form.value['unit'];
    }
    if(form.value['valeurDef'].length > 0){
      this.defaultValue = (form.value['valeurDef'].replace(',','.'));
    }
    //Gestion des boolean
    var four = document.getElementsByName('four');
    var regulateur = document.getElementsByName('regulateur');

    if ((<HTMLInputElement>four[0]).checked) {
      this.isFour = 1;
    }
    else this.isGlobal = 1;

    if ((<HTMLInputElement>regulateur[0]).checked) {
      this.isRegulateur = 1;
    }

    this.rondierService.createElement(this.zoneId, this.nom, this.valeurMin, this.valeurMax, this.typeChamp, this.isFour, this.isGlobal, this.unit, this.defaultValue, this.isRegulateur).subscribe((response)=>{
      if (response == "Création de l'élément OK"){
        Swal.fire("L'élément de contrôle a bien été créé !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la création de l\'élément de contrôle ....',
        })
      }
    });

    this.resetFields(form);
  }

  //TODO : reset le formulaire après saisie => pb si reset et pas de saisie alors erreur (si saisie OK)
  resetFields(form: NgForm){
    this.isRegulateur = 0;
    this.isFour = 0;
    this.isGlobal = 0;
    //form.reset();
    var four = document.getElementsByName('four');
    var regulateur = document.getElementsByName('regulateur');
    (<HTMLInputElement>four[0]).checked = false;
    (<HTMLInputElement>regulateur[0]).checked = false;
  }


}
