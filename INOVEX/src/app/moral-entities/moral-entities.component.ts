import {Component, Injectable, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';
import { dechetsCollecteurs } from 'src/models/dechetsCollecteurs.model';

@Component({
  selector: 'app-moral-entities',
  templateUrl: './moral-entities.component.html',
  styleUrls: ['./moral-entities.component.scss']
})

export class MoralEntitiesComponent implements OnInit {

  private code : string;
  private listTypeDechetsCollecteurs : dechetsCollecteurs[];
  public listTypeDechets : string[];
  public listCollecteurs : string[];

  constructor(private moralEntitiesService : moralEntitiesService) {
    this.code = '';
    this.listTypeDechetsCollecteurs = [];
    this.listTypeDechets = [];
    this.listCollecteurs = [];
  }

  ngOnInit(): void {
    //Récupération des types de déchets et des collecteurs
    this.moralEntitiesService.GetTypeDéchets().subscribe((response)=>{
      //@ts-ignore
      this.listTypeDechetsCollecteurs = response.data;

      //On boucle maintenant sur ce tableau pour scindé en déchets / collecteurs avec les codes associés
      this.listTypeDechetsCollecteurs.forEach(typeDechetsCollecteurs => {
        let typeDechets, collecteur;
        typeDechets = typeDechetsCollecteurs.Code.substring(0,3)+"-"+typeDechetsCollecteurs.Name.split(' ')[0];
        collecteur = typeDechetsCollecteurs.Code.substring(3)+"-"+typeDechetsCollecteurs.Name.split(' ')[1];
        if(!this.listTypeDechets.includes(typeDechets)){
          this.listTypeDechets.push(typeDechets);
        }
        if(!this.listCollecteurs.includes(collecteur)){
          this.listCollecteurs.push(collecteur);
        }
      });
    });
  }


  onSubmit(form : NgForm){

    if (form.value['adress']==''){
      this.moralEntitiesService.adress = '_';
    }
    else this.moralEntitiesService.adress = form.value['adress'];

    this.moralEntitiesService.nom = form.value['nom'];
    this.moralEntitiesService.unitPrice = +form.value['unitPrice'].toString().replace(',','.');
    this.code = form.value['produit']+form.value['collecteur'];
    this.moralEntitiesService.getLastCode(this.code).subscribe((response)=>{
      if (response.data.length > 0){
        var CodeCast : number = +response.data[0].Code;
        this.moralEntitiesService.code = String(CodeCast+1);
      }
      else {
        this.moralEntitiesService.code = this.code + '0001';
        
      }

      this.moralEntitiesService.createMoralEntity().subscribe((response)=>{
        if (response == "Création du client OK"){
          Swal.fire("Le client a bien été créé !");
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Erreur lors de la création du client ....',
          })
        }
      });
    });

    this.resetFields(form);
  }

  resetFields(form: NgForm){
    form.controls['nom'].reset();
    form.value['nom']='';
    form.controls['adress'].reset();
    form.value['adress']='';
    form.controls['unitPrice'].reset();
    form.value['unitPrice']='';
    form.controls['produit'].reset();
    form.controls['collecteur'].reset();
  }

}
