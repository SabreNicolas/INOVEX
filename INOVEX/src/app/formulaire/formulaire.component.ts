import { Component, OnInit } from '@angular/core';
import { productsService } from '../services/products.service';
import { product } from 'src/models/products.model';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent implements OnInit {

  public nom : string;
  public alias : string;
  public listProducts : product[];
  public listAjout : any[];
  public productAjout : string;
  public idForm : number;

  constructor(private productsService : productsService,private route : ActivatedRoute) { 
    this.nom = "";
    this.alias="";
    this.listProducts = [];
    this.listAjout = [];
    this.productAjout = "";
    this.idForm = 0;

    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe(params => {
      if(params.idForm != undefined){
        this.idForm = params.idForm;
      }
      else {
        this.idForm = 0;
      }
    });
  }

  ngOnInit(): void {
    //Si on est en mode edition
    if(this.idForm>0){
      //On récupère le formulaire en question et ses produits
      this.productsService.getOneFormulaire(this.idForm).subscribe((response)=>{
        //@ts-ignore
        this.nom=response.data[0].nom;

        this.productsService.getProductsFormulaire(this.idForm).subscribe((response)=>{
          //On ajoute les produits du formulaire dans listAjout pour l'edition
          //@ts-ignore
          for(let pr of response.data){
            this.productsService.getOneProduct(pr.idProduct).subscribe((response)=>{
              this.alias = pr.alias
              //@ts-ignore
              var ajout = { Name : response.data[0].Name, id : response.data[0].id, alias : this.alias}
              this.listAjout.push(ajout); 
              this.alias="";
              this.productAjout="";
            }); 
          }   
        })
      })
    }
    //On récupère les produits CAP Exploitation
    this.productsService.getAllProducts().subscribe((response)=>{
      // @ts-ignore
      this.listProducts = response.data;
    });
  }

  //Fonction qui permet d'ajouter un product dans la table d'ajout
  ajoutProduct(){
    //On a une data list donc la value n'est pas l'id du produit
    //On parcours la liste des produits CAP pour trouver l'id de celui-ci
    var idAjout=0;
    for(let pr of this.listProducts){
      if(pr.Name == this.productAjout){
        idAjout = pr.Id;
      }
    }
    //Si on a pas d'alias, on laisse le nom cap exploitation
    if(this.alias==""){
      this.alias = this.productAjout
    } 
    //on ajoute le produit dans listAjout
    var ajout = { Name : this.productAjout, id : idAjout, alias : this.alias}
    this.listAjout.push(ajout); 
    this.alias="";
    this.productAjout="";
    idAjout=0;   
  }

  //Fonction qui permet de supprimer un product de la table d'ajout
  suppProduct(id:number,Name:string,alias:string){
    let indexRomove = this.listAjout.findIndex( item => item.id === id && item.Name == Name && item.alias == alias);
    if(indexRomove != -1){
      this.listAjout.splice(indexRomove,1);
    }
  }

  //Fonction de création et d'édition de formulaire
  createFormulaire(){
    //Si on est en édition
    if(this.idForm>0){
      //On modifie le nom du formulaire
      this.productsService.updateFormulaire(this.nom,this.idForm).subscribe(async (response)=>{
        //On supprime les produits du formulaires
        this.productsService.deleteProductFormulaire(this.idForm).subscribe((response)=>{
          //On ajoute les nouveaux produits
          for(let pr of this.listAjout){
            this.productsService.createFormulaireAffectation(pr.alias,this.idForm,pr.id).subscribe((response)=>{
              if(response == "Affectation OK"){
                Swal.fire({text : 'Formulaire modifié !', icon :'success'});
                this.nom="";
                this.productAjout="";
                this.alias="";
              }
            })
          }
        })
      })
    }
    //Création
    else{
      //On créé le formulaire puis on ajoute ses produits
      this.productsService.createFormulaire(this.nom).subscribe((response)=>{
        var idForm = response['data'][0]['idForm'];
        for(let pr of this.listAjout){
          this.productsService.createFormulaireAffectation(pr.alias,idForm,pr.id).subscribe((response)=>{
            if(response == "Affectation OK"){
              Swal.fire({text : 'Nouveau formulaire créé', icon :'success'});
              this.nom="";
              this.productAjout="";
              this.alias="";
            }
          })
        }
      })
    }
  }
}
