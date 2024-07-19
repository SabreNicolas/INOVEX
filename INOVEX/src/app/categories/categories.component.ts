import { Component, OnInit } from '@angular/core';
import {category} from "../../models/categories.model";
import {categoriesService} from "../services/categories.service";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public listCategories : category[];

  constructor(private categoriesService : categoriesService, private popupService : PopupService) {
    this.listCategories = [];
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((response)=>{
      // @ts-ignore
      this.listCategories = response.data;
    });
  }

  onSubmit(form : NgForm){

    this.categoriesService.nom = form.value['nom'];
    this.categoriesService.code = form.value['code'];
    this.categoriesService.parentId = form.value['parent'];
    this.categoriesService.createCategory().subscribe((response)=>{
      if (response == "Création de la catégorie OK"){
        this.popupService.alertSuccessForm("La catégorie a bien été créé !");
      }
      else {
        this.popupService.alertErrorForm('Erreur lors de la création de la catégorie ....')
      }
    });

    this.resetFields(form);
  }

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']='';
    form.controls['code'].reset();
    form.value['code']='';
    form.controls['parent'].reset();
    form.value['parent']='0';
  }

}
