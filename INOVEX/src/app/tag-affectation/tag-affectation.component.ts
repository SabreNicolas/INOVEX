import { Component, OnInit } from '@angular/core';
import { product } from 'src/models/products.model';
import {productsService} from "../services/products.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-tag-affectation',
  templateUrl: './tag-affectation.component.html',
  styleUrls: ['./tag-affectation.component.scss']
})
export class TagAffectationComponent implements OnInit {

  public tag : string;
  public productId : number;
  public listProducts : product[];

  constructor(private productsService : productsService) { 
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
    this.productsService.setTAG(this.tag,this.productId).subscribe((response)=>{
      if (response == "Mise à jour du TAG OK"){
        Swal.fire("Le TAG a bien été affecté !");
        this.ngOnInit();
      }
      else {
        Swal.fire({
          icon: 'error',
          text: "Erreur lors de l'affectation du TAG ....",
        })
      }
    });
  }

}
