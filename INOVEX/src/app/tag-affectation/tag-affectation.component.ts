import { Component, OnInit } from '@angular/core';
import { product } from 'src/models/products.model';
import {productsService} from "../services/products.service";
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-tag-affectation',
  templateUrl: './tag-affectation.component.html',
  styleUrls: ['./tag-affectation.component.scss']
})
export class TagAffectationComponent implements OnInit {

  public tag : string;
  public productId : number;
  public listProducts : product[];

  constructor(private productsService : productsService, private popupService : PopupService) { 
    this.tag = "";
    this.productId = 0;
    this.listProducts = [];
  }

  ngOnInit(): void {
    this.productsService.getProductsWithoutTAG().subscribe((response)=>{
      // @ts-ignore
      this.listProducts = response.data;
    });
  }

  onSubmit(){
    this.productsService.setElement(this.tag,this.productId,"TAG").subscribe((response)=>{
      if (response == "Mise à jour du TAG OK"){
        this.popupService.alertSuccessForm("Le TAG a bien été affecté !");
        this.ngOnInit();
      }
      else {
        this.popupService.alertErrorForm("Erreur lors de l'affectation du TAG ....")
      }
    });
  }

}
