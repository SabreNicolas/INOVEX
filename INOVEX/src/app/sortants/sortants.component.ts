import { Component, OnInit } from '@angular/core';
import {category} from "../../models/categories.model";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";

@Component({
  selector: 'app-sortants',
  templateUrl: './sortants.component.html',
  styleUrls: ['./sortants.component.scss']
})
export class SortantsComponent implements OnInit {

  public listCategories : category[];
  public Code : string;
  public typeId : number;

  constructor(private productsService : productsService, private categoriesService : categoriesService) {
    this.listCategories = [];
    this.Code = "";
    this.typeId = 5; // 5 for sortants
  }

  ngOnInit(): void {
    this.categoriesService.getCategoriesSortants().subscribe((response)=>{
      // @ts-ignore
      this.listCategories = response.data;
    });
  }

  onSubmit(form : NgForm){
    if (form.value['unit']==''){
      this.productsService.unit = '/';
    }
    else this.productsService.unit = form.value['unit'];

    if (form.value['tag']==''){
      this.productsService.tag = '/';
    }
    else this.productsService.tag = form.value['tag'];

    this.productsService.nom = form.value['nom'];
    this.Code = form.value['categorie'];

    this.productsService.getLastCode(this.Code).subscribe((response)=>{
      if (response.data.length > 0){
        var CodeCast : number = +response.data[0].Code;
        this.productsService.code = String(CodeCast+1);
      }
      else {
        this.productsService.code = this.Code + '0001';

      }

      this.productsService.createProduct(this.typeId).subscribe((response)=>{
        if (response == "Création du produit OK"){
          Swal.fire("Le sortant a bien été créé !");
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la création du sortant ....',
          })
        }
      });
    });

    this.resetFields(form);
  }

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']='';
    form.controls['unit'].reset();
    form.value['unit']='';
    form.controls['tag'].reset();
    form.value['tag']='';
  }

}
