import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import { ActivatedRoute } from '@angular/router';
import { addDays, format, subDays } from 'date-fns';
import {rondierService} from "../services/rondier.service";
import { zone } from 'src/models/zone.model';
import Swal from 'sweetalert2';
declare var $ : any;

@Component({
  selector: 'app-recap-ronde-precedente',
  templateUrl: './recap-ronde-precedente.component.html',
  styleUrls: ['./recap-ronde-precedente.component.scss']
})
export class RecapRondePrecedenteComponent {

  public listAction : any[];
  public listEvenement : any[];
  public listZone : any[];
  public listConsigne : any[];
  public listActu : any[];
  public dateDebString : string;
  public dateFinString : string;
  public quartPrecedent : number;
  public quart : number;
  public idEquipe : number;
  public nomEquipe : string;
  public listRondier : any[];

  constructor(public cahierQuartService : cahierQuartService,private route : ActivatedRoute,private rondierService : rondierService,) {
    this.listAction = [];
    this.listConsigne = [];
    this.listZone = [];
    this.listEvenement = [];
    this.listActu = [];
    this.dateDebString = "";
    this.dateFinString = "";
    this.quartPrecedent = 0;
    this.quart = 0;
    this.idEquipe = 0;
    this.nomEquipe = "";
    this.listRondier = [];

    this.route.queryParams.subscribe(params => {
      if(params.quart != undefined){
        this.quart = params.quart;
      }
      else {
        this.quart = 0;
      }
    });
  }

  ngOnInit(): void {
    //Récupération de la date de début et de la date de fin en fonction du quart 
    if(this.quart == 1){
      this.dateDebString = format(subDays(new Date(),1),'yyyy-MM-dd') + ' 21:00:00.000'
      this.dateFinString = format(new Date(),'yyyy-MM-dd') + ' 05:00:00.000'
      this.quartPrecedent = 3;
    }
    else if(this.quart == 2){
      this.dateDebString = format(new Date(),'yyyy-MM-dd') + ' 05:00:00.000'
      this.dateFinString = format(new Date(),'yyyy-MM-dd') + ' 13:00:00.000'
      this.quartPrecedent = 1
    }
    else{
      this.dateDebString = format(new Date(),'yyyy-MM-dd') + ' 13:00:00.000'
      this.dateFinString = format(new Date(),'yyyy-MM-dd') + ' 21:00:00.000'
      this.quartPrecedent = 2
    }

    //Récupération des action pour la ronde précédente
    this.cahierQuartService.getActionsRonde(this.dateDebString, this.dateFinString).subscribe((response)=>{
      // @ts-ignore
      this.listAction = response.data;
    });

    //Récupération des évènement pour la ronde précédente
    this.cahierQuartService.getEvenementsRonde(this.dateDebString, this.dateFinString).subscribe((response)=>{
      // @ts-ignore
      this.listEvenement = response.data;
    });

    //Récupération des actus pour la ronde précédente
    this.cahierQuartService.getActusRonde(this.dateDebString, this.dateFinString).subscribe((response)=>{
      // @ts-ignore
      this.listActu = response.data;
    });
    
    //Récupération des zones pour la ronde précédente
    this.cahierQuartService.getZonesCalendrierRonde(this.dateDebString, this.dateFinString).subscribe((response)=>{
      // @ts-ignore
      this.listZone = response.BadgeAndElementsOfZone;
    });
    
    //On récupére la liste des consignes de la ronde précédente
    this.rondierService.listConsignes().subscribe((response) => {
      //@ts-ignore
      this.listConsigne = response.data;
    });

    //Récupération de l'id de l'équipe pour la ronde si l'équipe est déjà crée
    this.cahierQuartService.getEquipeQuart(this.quartPrecedent,format(new Date(this.dateDebString),'yyyy-MM-dd')).subscribe((response)=>{
      // @ts-ignore
      this.idEquipe = response.data[0].id;
      //Si on est en mode édition
      if(this.idEquipe > 0){
        //On récupère l'équipe concernée
        this.cahierQuartService.getOneEquipe(this.idEquipe).subscribe((response) =>{
          this.nomEquipe = response.data[0]['equipe'];
          if(response.data[0]['idRondier'] != null){
            for(var i = 0;i<response.data.length;i++){
              this.listRondier.push({Id : response.data[i]['idRondier'], Prenom : response.data[i]['prenomRondier'],Nom : response.data[i]['nomRondier'], Poste : response.data[i]['poste']});
            }
          }
        })
      }
    });

  }

  downloadFile(consigne : string){
    window.open(consigne, '_blank');
  }

  priseDeQuart(){
    //Demande de confirmation de création d'équipe
    Swal.fire({title: 'Avez vous pris connaissance des infos du quart précedent ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui',cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "https://fr-couvinove300.prod.paprec.fr:8101/cahierQuart/recapRonde?quart="+this.quart
      }
      else {
        // Pop-up d'annulation de la suppression
        Swal.fire('Annulé','La prise de quart a été annulée.','error');
      }
    }); 
  }

}
