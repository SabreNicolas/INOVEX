import { Component, OnInit } from '@angular/core';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';
import { category } from 'src/models/categories.model';
import { product } from 'src/models/products.model';

@Component({
  selector: 'app-correspondance-sortants',
  templateUrl: './correspondance-sortants.component.html',
  styleUrls: ['./correspondance-sortants.component.scss']
})
export class CorrespondanceSortantsComponent implements OnInit {
  public listSortants : any[];
  public debCode : string;
  public nomFichier : string;
  public listCategories : category[];


  constructor(private productsService : productsService, private categoriesService : categoriesService, private moralEntitiesService : moralEntitiesService) {
    this.debCode = '';
    this.listSortants = [];
    this.nomFichier ="";
    this.listCategories = [];
  }


  ngOnInit(): void {
    this.productsService.getSortantsAndCorrespondance(this.debCode).subscribe((response)=>{
      // @ts-ignore
      this.listSortants = response.data;
      console.log(this.listSortants)
    });
    this.categoriesService.getCategoriesSortants().subscribe((response)=>{
      // @ts-ignore
      this.listCategories = response.data;
    });
    }
    
    setFilters(){
      var codeCat = document.getElementById("categorie");
      // @ts-ignore
      var codeCatSel = codeCat.options[codeCat.selectedIndex].value;
      this.debCode = codeCatSel;
      /*Fin de prise en commpte des filtres */
      this.ngOnInit();
    }

    //Fonction pour attendre
    wait(ms : number) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }



    //Mise à jour du nom de l'import ou du produit
    edition(productId : number, productImport : string){
      //On récupère la correspondance pour voir si elle est déjà existante
      var verifProductImport = productImport;
      if(productImport == null){
        //@ts-ignore
        productImport = prompt('Veuillez saisir le nom du produit dans le logiciel de pesée','');
      }
      //@ts-ignore
      else productImport = prompt('Veuillez saisir le nom du produit dans le logiciel de pesée',productImport);
    
      // if(productImport == null || nomImport == null) return;
      productImport = productImport.replace(/'/g,"''");
      if(productImport == ""){
        productImport="_";
      }
      // Si on a une correspondance, on met à jour celle ci
      // @ts-ignore
      if(verifProductImport != null){
        this.moralEntitiesService.updateCorrespondanceSortant(productId,productImport).subscribe((response) => {
          Swal.fire({
            icon: 'success',
            text: 'Correspondance modifiée',
          });
          this.ngOnInit();
        })
      }
      //Sinon on la crée
      else {
        this.moralEntitiesService.createImport_tonnageSortant(productId, productImport).subscribe((response) => {
          Swal.fire({
            icon: 'success',
            text: 'Correspondance ajoutée',
          });
          this.ngOnInit();
        })
      }
    }
  }
