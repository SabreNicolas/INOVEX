import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {zone} from "../../models/zone.model";
import {rondierService} from "../services/rondier.service";
import {element} from "../../models/element.model";
import { PopupService } from '../services/popup.service';
import { groupement } from 'src/models/groupement.model';
import {NgForm} from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-elements',
  templateUrl: './list-elements.component.html',
  styleUrls: ['./list-elements.component.scss']
})
export class ListElementsComponent implements OnInit {

  @ViewChild('myCreateElementDialog') createElementDialog = {} as TemplateRef<any>;

  
  public listZone : zone[];
  public zoneId : number;
  public listElements : element[];
  public nom : string;
  public zoneIdSelect : any[];
  public listElement : element[];
  public ordreElem : number;
  public valeurMin : number;
  public valeurMax : number;
  public typeChamp : number;
  public unit : string;
  public defaultValue : number;
  private isRegulateur : number;//1 pour oui et 0 pour non
  private isCompteur : number;//1 pour oui et 0 pour non
  public listValues : string;
  public needListValues : boolean;
  public needBornes : boolean;
  public elementId : number;
  // @ts-ignore
  public element : element;
  // @ts-ignore
  public checkboxRegulateur : HTMLInputElement;
  // @ts-ignore
  public checkboxCompteur : HTMLInputElement;
  public listGroupements : groupement[];
  public idGroupement : number;
  public codeEquipement : string;
  public infoSup : boolean;
  public infoSupValue : string;
  public dialogRef = {};

  constructor(private rondierService : rondierService, private dialog : MatDialog, private popupService : PopupService) {
    this.listZone = [];
    this.zoneId = 0;
    this.listElements = [];
    this.nom = "";
    this.zoneIdSelect = [];
    this.listElement = [];
    this.ordreElem = 99;
    this.valeurMin = 0;
    this.valeurMax = 0;
    this.typeChamp = 2;
    this.unit = "_";
    this.defaultValue = 0;
    this.isRegulateur = 0;
    this.isCompteur = 0;
    this.needListValues = false;
    this.needBornes = false;
    this.listValues = "";
    this.elementId = 0;
    this.listGroupements = [];
    this.idGroupement = 0;
    this.codeEquipement ="";
    this.infoSup = false;
    this.infoSupValue = "";

  }

  ngOnInit(): void {
    this.rondierService.listZone().subscribe((response)=>{
      // @ts-ignore
      this.listZone = response.data;
      this.zoneId = this.listZone[0].Id
      this.setListElementsOfZone();
    });
    
  }

  ouvrirDialogCreerElement(){
    this.dialogRef = this.dialog.open(this.createElementDialog,{
      width:'60%',
      disableClose:true,
      autoFocus:true,
    })
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.ngOnInit();
    })
  }

  ouvrirDialogUpdateElement(id : number){
    this.elementId = id;
    this.dialogRef = this.dialog.open(this.createElementDialog,{
      width:'60%',
      disableClose:true,
      autoFocus:true,
    })
    this.rondierService.getOneElement(this.elementId).subscribe((response)=>{
      // @ts-ignore
      this.element = response.data[0];
      this.nom = this.element.nom;
      //this.zoneIdSelect[0] = this.element.zoneId;
      this.zoneIdSelect = [this.element.zoneId.toString()];
      this.getGroupement();
      this.valeurMin = this.element.valeurMin;
      this.valeurMax = this.element.valeurMax;
      this.typeChamp = this.element.typeChamp;
      this.unit = this.element.unit;
      this.defaultValue = this.element.defaultValue;
      this.isRegulateur = this.element.isRegulateur;
      this.isCompteur = this.element.isCompteur;
      this.listValues = this.element.listValues;
      this.codeEquipement = this.element.CodeEquipement;
      //@ts-ignore
      this.idGroupement= this.element.idGroupement;
      if(this.idGroupement == null){
        this.idGroupement = 0;
      }
      this.getElements();
      this.ordreElem = this.element.ordre-1;
      this.changeType(null);
      //Gestion du mode regulateur
      if (this.isRegulateur == 1) {
        this.checkboxRegulateur = <HTMLInputElement>document.getElementsByName('regulateur')[0];
        this.checkboxRegulateur.checked = true;
      }
      //Gestion du type compteur
      if (this.isCompteur == 1) {
        this.checkboxCompteur = <HTMLInputElement>document.getElementsByName('compteur')[0];
        this.checkboxCompteur.checked = true;
      }
      //Gestion de la pastille info sup
      if(this.element.infoSup.length > 0){
        this.infoSup = true;
        this.infoSupValue = this.element.infoSup;
      }
    });
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.ngOnInit();
    })
  }


  setListElementsOfZone(){
    this.rondierService.listElementofZone(this.zoneId).subscribe((response)=>{
      // @ts-ignore
      this.listElements = response.data;
    });
  }

  setFilters(){
    /* Début prise en compte des filtres*/
    var zoneElt = document.getElementById("zone");
    // @ts-ignore
    var zoneSel = zoneElt.options[zoneElt.selectedIndex].value;
    // @ts-ignore
    this.zoneId = zoneSel;
    /*Fin de prise en commpte des filtres */
    this.setListElementsOfZone();
  }

  //suppression d'un element de controle
  deleteElement(id : number){
    this.rondierService.deleteElement(id).subscribe((response)=>{
      if (response == "Suppression de l'élément OK"){
        this.popupService.alertSuccessForm("L'élément de contrôle a bien été supprimé !");
      }
      else {
        this.popupService.alertSuccessForm('Erreur lors de la suppression de l\'élément de contrôle....')
      }
    });
    this.ngOnInit();
  }

  getPreviousItem(index :number){
    if(index > 0){
      return this.listElements[index-1]['idGroupement'];
    }
    return 0;
  }

  //permet de savoir si il est nécessaire ou non d'afficher le champ de list des valeurs possibles
  changeType(form : NgForm | null){
    if(form != null) {
      this.typeChamp = form.value['champ'];
    }
    // @ts-ignore
    //si menu de sélection ou case à cocher on affiche le champ de list valeurs possibles
    if(this.typeChamp === "3" || this.typeChamp === "4"){
      this.needListValues = true;
    }
    else {
      this.needListValues = false;
      this.listValues = "";
    }

    // @ts-ignore
    //si cursur on affiche les valeurs min et max
    if(this.typeChamp === "1"){
      this.needBornes = true;
    }
    else {
      this.needBornes = false;
      this.valeurMin = 0;
      this.valeurMax = 0;
    }
  }

  //Récupération des éléments de la zone par ordre
  getElements(){
    this.rondierService.listElementofZone(this.zoneIdSelect[0]).subscribe((response)=>{
      // @ts-ignore
      this.listElement = response.data;
    });
  }

  getGroupement(){
    this.idGroupement = 0;
    if(this.zoneIdSelect.length == 1 ){
      this.rondierService.getGroupements(this.zoneIdSelect[0]).subscribe((response)=>{
        // @ts-ignore
        this.listGroupements = response.data;
        if(this.listGroupements.length < 1 ){
          this.idGroupement = 0;
        }

        this.getElements();
      });
    }
  }
  
  //Création éléments contrôle
  onSubmit(form : NgForm) {
    this.checkboxRegulateur = <HTMLInputElement>document.getElementsByName('regulateur')[0];
    this.checkboxCompteur = <HTMLInputElement>document.getElementsByName('compteur')[0];
    this.nom = form.value['nom'].replace(/'/g,"''");
    this.zoneIdSelect = form.value['zone'];
    if(this.zoneIdSelect.length < 2){
      this.ordreElem = form.value['ordreElem'];
    }
    if(form.value['unit'].length > 0){
      this.unit = form.value['unit'].replace(/'/g,"''");
    }
    if(form.value['valeurDef'].length > 0){
      this.defaultValue = (form.value['valeurDef'].replace(',','.').replace(/'/g,"''"));
    }
    if(this.needListValues){
      this.listValues = form.value['listValues'].replace(/'/g,"''");
    }
    if(this.needBornes){
      if(form.value['valeurMin'].length > 0){
        this.valeurMin = (form.value['valeurMin'].replace(',','.').replace(" ", "").replace(/'/g,"''"));
      }
      if(form.value['valeurMax'].length > 0){
        this.valeurMax = (form.value['valeurMax'].replace(',','.').replace(" ", "").replace(/'/g,"''"));
      }
    }
    //Gestion des boolean
    if (this.checkboxRegulateur.checked) {
      this.isRegulateur = 1;
    }
    else this.isRegulateur = 0;
    if (this.checkboxCompteur.checked) {
      this.isCompteur = 1;
    }
    else this.isCompteur = 0;
    //Si la case est coché pour la pastille on insère la valeur
    if(this.infoSup){
      this.infoSupValue = form.value['infoSupValue'].replace(/'/g,"''");
    }
    //Sinon on envoi une chaine vide
    else{
      this.infoSupValue = '';
    }
    //FIN Gestion des boolean
    this.codeEquipement = this.codeEquipement.replace(/'/g,"''");
    if (this.elementId > 0){
      this.update();
    }
    else{
      this.zoneIdSelect.forEach(zoneId =>{
        this.rondierService.updateOrdreElement(zoneId,this.ordreElem).subscribe((response)=>{
          // @ts-ignore
          if (response == "Mise à jour des ordres OK"){
            this.rondierService.createElement(zoneId, this.nom, this.valeurMin, this.valeurMax, this.typeChamp, this.unit, this.defaultValue, this.isRegulateur,this.listValues,this.isCompteur, Number(this.ordreElem)+1, this.idGroupement, this.codeEquipement, this.infoSupValue).subscribe((response)=>{
              if (response == "Création de l'élément OK"){
                this.idGroupement = 0 ;
                this.codeEquipement = "";
                this.nom = "";
                this.popupService.alertSuccessForm("L'élément de contrôle a bien été créé !");
                this.dialog.closeAll();
                this.resetFields();
              }
              
              else {
                this.popupService.alertErrorForm('Erreur lors de la création de l\'élément de contrôle ....');
              }
            });
          }
          else {
            this.popupService.alertErrorForm('Erreur lors de la création de l\'élément de contrôle ....');
          }
        });
      });
    }
  }


  //Mise à jour de l'element
  update(){
    //Permet de ne pas mettre à jour les ordres si on ne change pas la position dans la zone
    if(this.element.ordre != this.ordreElem + 1){
      this.rondierService.updateOrdreElement(this.zoneIdSelect[0],this.ordreElem).subscribe((response)=>{
        // @ts-ignore
        if (response == "Mise à jour des ordres OK"){
          this.updateElement(Number(this.ordreElem)+1);
        }
        else {
          this.popupService.alertErrorForm('Erreur lors de la création de l\'élément de contrôle ....')
        }
      });
    }
    else{
      this.updateElement(this.element.ordre);
    }
  }

  updateElement(ordre : number){
    this.rondierService.updateElement(this.elementId, this.zoneIdSelect[0], this.nom, this.valeurMin, this.valeurMax, this.typeChamp, this.unit, this.defaultValue, this.isRegulateur, this.listValues, this.isCompteur,ordre, this.idGroupement, this.codeEquipement, this.infoSupValue).subscribe((response)=>{
      if (response == "Mise à jour de l'element OK"){
        this.popupService.alertSuccessForm("L'élément de contrôle a bien été mis à jour !");
        this.dialog.closeAll();
      }
      else {
        this.popupService.alertErrorForm('Erreur lors de la mise à jour de l\'élément de contrôle ....')
      }
    });
  }

  resetFields(){
    this.listZone = [];
    this.zoneId = 0;
    this.listElements = [];
    this.nom = "";
    this.zoneIdSelect = [];
    this.listElement = [];
    this.ordreElem = 1;
    this.valeurMin = 0;
    this.valeurMax = 0;
    this.typeChamp = 2;
    this.unit = "_";
    this.defaultValue = 0;
    this.isRegulateur = 0;
    this.isCompteur = 0;
    this.needListValues = false;
    this.needBornes = false;
    this.listValues = "";
    this.elementId = 0;
    this.listGroupements = [];
    this.idGroupement = 0;
    this.codeEquipement ="";
    this.infoSup = false;
    this.infoSupValue = "";
  }
}