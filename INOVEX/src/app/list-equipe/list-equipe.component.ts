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
  constructor(public cahierQuartService : cahierQuartService){
    this.equipes = [];
  }

  ngOnInit(): void {
    this.cahierQuartService.getEquipes().subscribe((response) =>{
      var listEquipes = [];

      var rondiers =[]
      rondiers.push({nomRondier :response.data[0]['nomRondier'], prenomRondier :response.data[0]['prenomRondier'], poste: response.data[0]['poste'], zone: response.data[0]['zone'] })
      for(var i =1;i<response.data.length;i++){
        if(response.data[i]['equipe']===response.data[i-1]['equipe']){
          rondiers.push({nomRondier :response.data[i]['nomRondier'], prenomRondier :response.data[i]['prenomRondier'], poste: response.data[i]['poste'], zone: response.data[i]['zone'] })
        }
        else{
          listEquipes.push({id:response.data[i-1]['id'], equipe: response.data[i-1]['equipe'], quart: response.data[i-1]['quart'], nomChefQuart: response.data[i-1]['nomChefQuart'], prenomChefQuart : response.data[i-1]['prenomChefQuart'], rondiers : rondiers});
          rondiers =[];
          rondiers.push({nomRondier :response.data[i]['nomRondier'], prenomRondier :response.data[i]['prenomRondier'], poste: response.data[i]['poste'], zone: response.data[i]['zone'] })
        }
      }
      listEquipes.push({id:response.data[i-1]['id'],equipe: response.data[response.data.length-1]['equipe'], quart: response.data[response.data.length-1]['quart'], nomChefQuart: response.data[response.data.length-1]['nomChefQuart'], prenomChefQuart :response.data[response.data.length-1]['prenomChefQuart'], rondiers : rondiers});

      this.equipes = listEquipes;
      console.log(this.equipes)
    })
  }

  toggleCardSize(equipe: equipe) {
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id+"_overlay").classList.add("show"));
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id).classList.add("expanded"))
    console.log((<HTMLElement>document.getElementById(equipe.equipe)))
  }
  
  closeCard(equipe: equipe) {
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id).classList.toggle("expanded"))
    //@ts-ignore
    (<HTMLElement>document.getElementById(equipe.id+"_overlay").classList.toggle("show"));
  }

 
}


