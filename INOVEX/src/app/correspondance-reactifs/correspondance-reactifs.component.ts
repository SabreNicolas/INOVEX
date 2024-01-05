import { Component, OnInit } from '@angular/core';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';
import { category } from 'src/models/categories.model';

@Component({
  selector: 'app-correspondance-reactifs',
  templateUrl: './correspondance-reactifs.component.html',
  styleUrls: ['./correspondance-reactifs.component.scss']
})
export class CorrespondanceReactifsComponent implements OnInit {
  public listReactifsAvecCorrespondance : any[];
  public listReactifs : any[];
  public nomAjout : string;
  public produitACreer: number;


  constructor(private productsService : productsService, private categoriesService : categoriesService, private moralEntitiesService : moralEntitiesService) {
    this.listReactifsAvecCorrespondance = [];
    this.listReactifs = [];
    this.nomAjout ="";
    this.produitACreer =0;
  }


  ngOnInit(): void {
      this.productsService.getReactifsAndCorrespondance().subscribe((response)=>{
        // @ts-ignore
        this.listReactifsAvecCorrespondance = response.data;
        console.log(this.listReactifsAvecCorrespondance)
      });

      this.productsService.getReactifs().subscribe((response)=>{
        // @ts-ignore
        this.listReactifs = response.data;
      });
    }

    //Fonction pour attendre
    wait(ms : number) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    editionProductImport(idCorrespondance : number){
      var idCorrespondanceString = idCorrespondance + ""
      var typeElt = document.getElementById(idCorrespondanceString);
      // @ts-ignore
      var productId = typeElt.options[typeElt.selectedIndex].value;
      this.moralEntitiesService.updateProductImportCorrespondanceReactif(idCorrespondance, productId).subscribe((response) => {
        Swal.fire({
           icon: 'success',
           text: 'Correspondance modifiée',
         });
         this.ngOnInit();
       })
    }

    //Mise à jour du nom de l'import ou du produit
    editionNomImport(productId : number, productImport : string){
      //On récupère la correspondance pour voir si elle est déjà existante
      //@ts-ignore
      productImport = prompt('Veuillez saisir le nom du produit dans le logiciel de pesée',productImport);
    
      // if(productImport == null || nomImport == null) return;
      productImport = productImport.replace(/'/g,"''");
      if(productImport == ""){
        productImport="_";
      }
      // Si on a une correspondance, on met à jour celle ci
      // @ts-ignore
      this.moralEntitiesService.updateNomImportCorrespondanceReactif(productId,productImport).subscribe((response) => {
       Swal.fire({
          icon: 'success',
          text: 'Correspondance modifiée',
        });
        this.ngOnInit();
      })
    }

    createCorrespondance(productImport : string, productId : number){
      productImport = productImport.replace(/'/g,"''")
      this.moralEntitiesService.createImport_tonnageReactif(productId, productImport).subscribe((response) => {
        Swal.fire({
          icon: 'success',
          text: 'Correspondance ajoutée',
        });
        this.ngOnInit();
      })
    }

  supprimer(idCorrespondance : number){
    Swal.fire({title: 'Êtes-vous sûr(e) de vouloir supprimer cette zone et tout ses éléments ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
      }).then((result) => {
      if (result.isConfirmed) {
        this.moralEntitiesService.deleteCorrespondanceReactif(idCorrespondance).subscribe((response) => {
          if (response == "Suppression de la correspondance OK"){
            Swal.fire("La correspondance a été supprimée !");
            this.ngOnInit();
          }
          else {
            Swal.fire({
              icon: 'error',
              text: 'Erreur lors de Suppression ....',
            })
          }
        });
      } 
      else {
        // Pop-up d'annulation de la suppression
        Swal.fire('Annulé','La suprression a été annulée.','error');
      }
    });
  }
}
