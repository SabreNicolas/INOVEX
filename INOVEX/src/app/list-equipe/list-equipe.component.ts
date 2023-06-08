import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import { equipe } from "../../models/equipe.model";

@Component({
  selector: 'app-list-equipe',
  templateUrl: './list-equipe.component.html',
  styleUrls: ['./list-equipe.component.scss'],
})
export class ListEquipeComponent implements OnInit {
  
  public equipes : equipe[];
  public periode : string ;

  constructor(public cahierQuartService : cahierQuartService){
    this.equipes = [];
    this.periode = "";
  }

  ngOnInit(): void {

    //On récupère la liste des équipes
    this.cahierQuartService.getEquipes().subscribe((response) =>{
      
      var listEquipes = [];
      var rondiers =[]

      //TRAITEMENT DE LA REPONSE POUR MATCHER AVEC LE MODEL EQUIPE
      //On ajoute le premier Rondier du tableau
      rondiers.push({nomRondier :response.data[0]['nomRondier'], prenomRondier :response.data[0]['prenomRondier'], poste: response.data[0]['poste'], zone: response.data[0]['zone'] })
      for(var i =1;i<response.data.length;i++){

        //On vérifie la valeur du quart pour le transformer en string
        if(response.data[i-1]['quart'] == 1){
          this.periode = "Quart du Matin";
        }
        else if(response.data[i-1]['quart'] == 2){
          this.periode = "Quart de L'après-midi";
        }
        else if(response.data[i-1]['quart'] == 3){
          this.periode = "Quart de Nuit";
        }

        //Si on c'est un rondier de la même équipe que le précédent
        //On ajoute celui-ci dans le tableau des rondiers
        if(response.data[i]['equipe']===response.data[i-1]['equipe']){
          rondiers.push({nomRondier :response.data[i]['nomRondier'], prenomRondier :response.data[i]['prenomRondier'], poste: response.data[i]['poste'], zone: response.data[i]['zone'] })
        }
        //Sinon on ajoute les informations de l'équipe, on vide la tableau rondier et on ajoute le premier rondier de la nouvelle équipe
        else{
          listEquipes.push({id:response.data[i-1]['id'], equipe: response.data[i-1]['equipe'], quart: this.periode, nomChefQuart: response.data[i-1]['nomChefQuart'], prenomChefQuart : response.data[i-1]['prenomChefQuart'], rondiers : rondiers});
          rondiers =[];
          rondiers.push({nomRondier :response.data[i]['nomRondier'], prenomRondier :response.data[i]['prenomRondier'], poste: response.data[i]['poste'], zone: response.data[i]['zone'] })
        }
      }

      //On vérifie la valeur du quart pour le transformer en string
      if(response.data[response.data.length-1]['quart'] == 1){
        this.periode = "Quart du Matin";
      }
      else if(response.data[response.data.length-1]['quart'] == 2){
        this.periode = "Quart de L'après-midi";
      }
      else if(response.data[response.data.length-1]['quart'] == 3){
        this.periode = "Quart de Nuit";
      }
      //On ajoute les informations sur la dernière équipe
      listEquipes.push({id:response.data[i-1]['id'],equipe: response.data[response.data.length-1]['equipe'], quart: this.periode, nomChefQuart: response.data[response.data.length-1]['nomChefQuart'], prenomChefQuart :response.data[response.data.length-1]['prenomChefQuart'], rondiers : rondiers});

      this.equipes = listEquipes;
    })
  }

  //Fonction qui permet d'agrandir une card contenant les informations sur une équipe
  toggleCardSize(equipe: equipe) {
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id+"_overlay").classList.add("show"));
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id).classList.add("expanded"))
    console.log((<HTMLElement>document.getElementById(equipe.equipe)))
  }
  
  //Fonction qui permet de fermer une card
  closeCard(equipe: equipe) {
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id).classList.toggle("expanded"))
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id+"_overlay").classList.toggle("show"));
  }

 
}


