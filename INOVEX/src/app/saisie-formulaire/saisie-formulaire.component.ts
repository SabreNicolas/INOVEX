import { Component, OnInit } from '@angular/core';
import { formulaire } from 'src/models/formulaire.model';
import { productsService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';
import {NgForm} from "@angular/forms";
import { dateService } from '../services/date.service';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-saisie-formulaire',
  templateUrl: './saisie-formulaire.component.html',
  styleUrls: ['./saisie-formulaire.component.scss']
})

export class SaisieFormulaireComponent implements OnInit {

  public listFormulaires : formulaire[];
  public idForm : number;
  public nomForm : string;
  public dateDeb : Date | undefined;
  public dateFin : Date | undefined;
  public listDays : string[];
  public listProducts : any[];
  public isAdmin : number;

  constructor(private productsService : productsService, private moralEntitiesService : moralEntitiesService, private route : ActivatedRoute,private dateService : dateService) {
    this.listFormulaires=[];
    this.idForm=0;
    this.nomForm="";
    this.listDays = [];
    this.listProducts = [];
    this.isAdmin = 0;

    //Permet de récupérer l'id du formulaire à saisir
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
    //On récupère la liste des produits du formulaire
    this.productsService.getProductsFormulaire(this.idForm).subscribe((response)=>{
      // @ts-ignore
      this.listProducts = response.data;
    })

    //Récupération de l'utilisateur pour vérifier si il est admin => permettre suppression ronde si admin
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      // @ts-ignore
      this.isAdmin = userLoggedParse['isAdmin'];
    }
  }

  //Mettre la periode du filtre
  setPeriod(form: NgForm){
    this.listDays = [];
    this.dateDeb = new Date((<HTMLInputElement>document.getElementById("dateDeb")).value);
    this.dateFin = new Date((<HTMLInputElement>document.getElementById("dateFin")).value);
    if(this.dateFin < this.dateDeb){
      this.dateService.mauvaiseEntreeDate(form);
    }
    this.listDays = this.dateService.getDays(this.dateDeb, this.dateFin);
    this.getValues();
  }

  //changer les dates pour saisir hier
  setYesterday(form: NgForm){
    this.dateService.setYesterday(form);
    this.setPeriod(form);
  }

  //changer les dates pour saisir la semaine en cours
  setCurrentWeek(form: NgForm){
    this.dateService.setCurrentWeek(form);
    this.setPeriod(form);
  }

  //changer les dates pour saisir le mois en cours
  setCurrentMonth(form: NgForm){
    this.dateService.setCurrentMonth(form);
    this.setPeriod(form);
  }

  //récupérer les tonnages en BDD
  getValues(){
    this.listDays.forEach(date => {
      this.listProducts.forEach(pr => {
        // console.log(pr.idProduct)
        this.productsService.getValueProducts(date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2), pr.idProduct).subscribe((response) => {
          if (response.data[0] != undefined && response.data[0].Value != 0) {
            (<HTMLInputElement>document.getElementById(pr.idProduct + '-' + date)).value = response.data[0].Value;
          }
          else (<HTMLInputElement>document.getElementById(pr.idProduct + '-' + date)).value = '';
        });
      });
    });
  }

  //valider les saisies
  validation(){
    this.listDays.forEach(date => {
      this.listProducts.forEach(pr =>{
        var value = (<HTMLInputElement>document.getElementById(pr.idProduct+'-'+date)).value.replace(',','.');
        var Value2 = value.replace(" ", "");
        var valueInt: number = +Value2;
        if (valueInt >0.0){
          this.moralEntitiesService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),valueInt,pr.idProduct,0).subscribe((response)=>{
            if (response == "Création du Measures OK"){
              Swal.fire("Les valeurs ont été insérées avec succès !");
            }
            else {
              Swal.fire({
                icon: 'error',
                text: 'Erreur lors de l\'insertion des valeurs ....',
              })
            }
          });
        }
      })
    });
  }
  
  //mettre à 0 la value pour modificiation
  delete(Id : number, date : string){
    this.moralEntitiesService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),0,Id,0).subscribe((response)=>{
      if (response == "Création du Measures OK"){
        Swal.fire("La valeur a bien été supprimé !");
        (<HTMLInputElement>document.getElementById(Id + '-' + date)).value = '';
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de la valeur ....',
        })
      }
    });
  }

  //Supprimer un formulaire
  async deleteFormulaire(){
    Swal.fire({title: 'Êtes-vous sûr(e) de vouloir supprimer ce formulaire ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
      }).then(async (result) => {
        if (result.isConfirmed) {
          //On supprime les produits du formulaire puis le formulaire
          this.productsService.deleteProductFormulaire(this.idForm).subscribe((response)=>{
            this.productsService.deleteFormulaire(this.idForm).subscribe((response)=>{
              this.idForm=0;
              this.ngOnInit();
            })
          }) 
        }
        else {
          // Pop-up d'annulation de la suppression
          Swal.fire('Annulé','La suprression a été annulée.','error');
        }
      });
    }

}