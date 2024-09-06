import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";
import { category } from 'src/models/categories.model';
import { idUsineService } from "src/app/services/idUsine.service";
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-compteurs',
  templateUrl: './compteurs.component.html',
  styleUrls: ['./compteurs.component.scss']
})
export class CompteursComponent implements OnInit {

  public listCategories : category[];
  public Code : string;
  public typeId : number;
  public estUnique : boolean;
  public idUsine : number;

  constructor(private productsService : productsService, private popupService : PopupService, private categoriesService : categoriesService, private idUsineService : idUsineService) {
    this.listCategories = [];
    this.Code = "";
    this.typeId = 4; // 4 for compteur
    this.estUnique = false;
    this.idUsine = this.idUsineService.getIdUsine();
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((response)=>{
      // @ts-ignore
      this.listCategories = response.data;
    });
  }

  //Fonction pour attendre
  wait(ms : number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  async onSubmit(form : NgForm){
    if (form.value['unit'] == null){
      this.productsService.unit = '';
    }
    else this.productsService.unit = form.value['unit'];

    if (form.value['tag'] == null){
      this.productsService.tag = '';
    }
    else this.productsService.tag = form.value['tag'];

    this.productsService.nom = form.value['nom'];
    this.Code = form.value['categorie'];

    let lastCodeUsine = 0, lastCodeGlobal = 0;
    //On va chercher pour chaque site le dernierCode et on stocke le plus grand de tout les sites confondu pour avoir une uniformité
    this.categoriesService.sites.forEach(site => {
      this.productsService.getLastCode(this.Code,site.id).subscribe((response)=>{
        if (response.data.length > 0){
          var CodeCast : number = +response.data[0].Code;
          lastCodeUsine = CodeCast+1;
        }
        else {
          lastCodeUsine = Number(this.Code + '0001');
        }
        //Si le code de l'usine est plus grand que celui déjà stocké, on le stocke
        if(lastCodeUsine > lastCodeGlobal){
          lastCodeGlobal = lastCodeUsine;
          this.productsService.code = String(lastCodeGlobal);
        }
      });
    });

    await this.wait(500);

    //Si la case produit unique n'est pas coché => on va créer le produit pour l'ensemble des sites
    if(!form.value['isReferentiel']){
      //On va créer le compteur pour l'ensemble des sites = > Référentiel produit unique
      this.categoriesService.sites.forEach(site => {
        this.createCompteur(site.id);
      });
    }
    //sinon on va le créer pour le site actif uniquement
    else{
      this.createCompteur(this.idUsine);
    }

    this.resetFields(form);
  }

  createCompteur(siteId : number){
    this.productsService.createProduct(this.typeId, siteId).subscribe((response)=>{
      if (response == "Création du produit OK"){
        this.popupService.alertSuccessForm("Le compteur a bien été créé !");
      }
      else {
        this.popupService.alertSuccessForm('Erreur lors de la création du compteur ....')
      }
    });
  }

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']='';
    form.controls['unit'].reset();
    form.value['unit']='';
    form.controls['tag'].reset();
    form.value['tag']='';
    form.controls['isReferentiel'].reset();
    form.value['isReferentiel']='';
  }

}