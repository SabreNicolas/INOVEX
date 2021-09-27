import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {productsService} from "../services/products.service";
import {categoriesService} from "../services/categories.service";
import { category } from 'src/models/categories.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compteurs',
  templateUrl: './compteurs.component.html',
  styleUrls: ['./compteurs.component.scss']
})
export class CompteursComponent implements OnInit {

  public listCategories : category[];
  public Code : string;
  public typeId : number;

  constructor(private productsService : productsService, private categoriesService : categoriesService) {
    this.listCategories = [];
    this.Code = "";
    this.typeId = 4; // 4 for compteur
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((response)=>{
      // @ts-ignore
      this.listCategories = response.data;
    });
  }

  onSubmit(form : NgForm){
    if (form.value['unit']==''){
      this.productsService.unit = '/';
    }
    else this.productsService.unit = form.value['unit'];

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
          Swal.fire("Le compteur a bien été créé !");
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la création du compteur ....',
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
  }

}
