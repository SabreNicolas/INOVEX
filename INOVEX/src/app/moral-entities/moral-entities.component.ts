import {Component, Injectable, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';
import { dechetsCollecteurs } from 'src/models/dechetsCollecteurs.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-moral-entities',
  templateUrl: './moral-entities.component.html',
  styleUrls: ['./moral-entities.component.scss']
})

export class MoralEntitiesComponent implements OnInit {

  private code : string;
  public mrId: number;
  // @ts-ignore
  public MR : moralEntity;
  public produit : string;
  public collecteur : string;
  public name : string;
  public address : string;
  public unitPrice : number;
  public CAP : string;
  public codeDechet : string;
  public nomClient : string;
  public prenomClient : string;
  public mailClient : string;
  private listTypeDechetsCollecteurs : dechetsCollecteurs[];
  public listTypeDechets : string[];
  public listCollecteurs : string[];

  constructor(private moralEntitiesService : moralEntitiesService, private route : ActivatedRoute) {
    this.code = '';
    this.produit = "201";
    this.collecteur = "01";
    this.mrId = 0;
    this.name = '';
    this.address = '';
    this.unitPrice = 1;
    this.CAP = '';
    this.codeDechet = '';
    this.nomClient = '';
    this.prenomClient = '';
    this.mailClient = '';
    this.listTypeDechetsCollecteurs = [];
    this.listTypeDechets = [];
    this.listCollecteurs = [];

    this.route.queryParams.subscribe(params => {
      if(params.mr != undefined){
        this.mrId = params.mr;
      }
      else {
        this.mrId = 0;
      }
    });
  }

  ngOnInit(): void {
    //SI on se trouve en edition, on recupere le moralEntitie pour pre-remplir les champs
    if (this.mrId > 0){
      this.moralEntitiesService.getOneMoralEntity(this.mrId).subscribe((response)=>{
        // @ts-ignore
        this.MR = response.data[0];
        this.name = this.MR.Name;
        this.address = this.MR.Address;
        this.unitPrice = this.MR.UnitPrice;
        this.CAP = this.MR.numCAP;
        this.codeDechet = this.MR.codeDechet;
        this.nomClient = this.MR.nomClient;
        this.prenomClient = this.MR.prenomClient;
        this.mailClient = this.MR.mailClient;
        if (this.MR.Code.length > 5){
          this.produit = this.MR.Code.substr(0,3)+"-"+this.MR.Code.substr(5,2);
        }
        else this.produit = this.MR.Code.substr(0,3);
        this.collecteur = this.MR.Code.substr(3,2);
      });
    }

    //Récupération des types de déchets et des collecteurs
    this.moralEntitiesService.GetTypeDéchets().subscribe((response)=>{
      //@ts-ignore
      this.listTypeDechetsCollecteurs = response.data;

      //On boucle maintenant sur ce tableau pour scindé en déchets / collecteurs avec les codes associés
      this.listTypeDechetsCollecteurs.forEach(typeDechetsCollecteurs => {
        let typeDechets, collecteur;
        //GESTION cas spécifique DIB/DEA
        if(typeDechetsCollecteurs.Code.length > 5){
          typeDechets = typeDechetsCollecteurs.Code.substring(0,3)+"-"+typeDechetsCollecteurs.Code.substring(5)+"_"+typeDechetsCollecteurs.Name.split(' ')[0];
          collecteur = typeDechetsCollecteurs.Code.substring(3,5)+"_"+typeDechetsCollecteurs.Name.split(' ')[1];
        }
        else {
          typeDechets = typeDechetsCollecteurs.Code.substring(0,3)+"_"+typeDechetsCollecteurs.Name.split(' ')[0];
          collecteur = typeDechetsCollecteurs.Code.substring(3)+"_"+typeDechetsCollecteurs.Name.split(' ')[1];
        }
        //SI Contient DIB quoi qu'il arrive on met 202-01_DIB
        if(typeDechetsCollecteurs.Name.split(' ')[0] == "DIB"){
          typeDechets = "202-01_DIB";
        }
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
    if (this.address == '' || this.address == null){
      this.moralEntitiesService.adress = '_';
    }
    else this.moralEntitiesService.adress = this.address;

    this.moralEntitiesService.nom = this.name;
    this.moralEntitiesService.unitPrice = +this.unitPrice.toString().replace(',','.');

    //GESTION DE LA DIFFERENCE DE CODE POUR DIB ET DEA
    if(this.produit.length > 3){
      this.code = this.produit.substr(0,3)+this.collecteur+this.produit.substr(4,2);
    }
    else{
      this.code = this.produit+this.collecteur;
    }
    //FIN GESTION DE LA DIFFERENCE DE CODE

    this.moralEntitiesService.code = this.code;

    //DEBUT AJOUT INFOS SUPP
    if (this.CAP == '' || this.CAP == null){
      this.moralEntitiesService.numCAP = '_';
    }
    else this.moralEntitiesService.numCAP = this.CAP;

    if (this.codeDechet == '' || this.codeDechet == null){
      this.moralEntitiesService.codeDechet = '_';
    }
    else this.moralEntitiesService.codeDechet = this.codeDechet;

    if (this.nomClient == '' || this.nomClient == null){
      this.moralEntitiesService.nomClient = '_';
    }
    else this.moralEntitiesService.nomClient = this.nomClient;

    if (this.prenomClient == '' || this.prenomClient == null){
      this.moralEntitiesService.prenomClient = '_';
    }
    else this.moralEntitiesService.prenomClient = this.prenomClient;

    if (this.mailClient == '' || this.mailClient == null){
      this.moralEntitiesService.mailClient = '_';
    }
    else this.moralEntitiesService.mailClient = this.mailClient;
    //FIN INFOS SUPP

    //Mise à jour du client si édition
    if (this.mrId > 0){
      this.update();
    }
    else{
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
    }


    /*this.moralEntitiesService.getLastCode(this.code).subscribe((response)=>{
      if (response.data.length > 0){
        var CodeCast : number = +response.data[0].Code;
        this.moralEntitiesService.code = String(CodeCast+1);
      }
      else {
        this.moralEntitiesService.code = this.code + '0001';
      }

      //Mise à jour du client si édition
      if (this.mrId > 0){
        this.update();
      }
      else{
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
      }
    });*/

    this.resetFields(form);
  }

  //Mise à jour du MR
  update(){
    this.moralEntitiesService.updateMoralEntity(this.mrId).subscribe((response)=>{
      if (response == "Mise à jour du MR OK"){
        Swal.fire("Le client a bien été mis à jour !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du client ....',
        })
      }
    });
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
    form.controls['numCAP'].reset();
    form.value['numCAP']='';
    form.controls['codeDechet'].reset();
    form.value['codeDechet']='';
    form.controls['nomClient'].reset();
    form.value['nomClient']='';
    form.controls['prenomClient'].reset();
    form.value['prenomClient']='';
    form.controls['mailClient'].reset();
    form.value['mailClient']='';
    this.code = '';
  }

}
