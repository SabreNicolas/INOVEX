import { Component, OnInit } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { cahierQuartService } from '../services/cahierQuart.service';
import * as XLSX from 'xlsx';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  styleUrls: ['./recherche.component.scss']
})


export class RechercheComponent implements OnInit {

  public evenement : boolean;
  public consigne : boolean;
  public actu : boolean;
  public action : boolean;
  public titre : string;
  public dateDeb : string;
  public dateFin : string;
  public resultTableau : any[];
  public equipementGMAO : string;
  public groupementGMAO : string;
  public importance : number;

  constructor(public cahierQuartService : cahierQuartService, private popupService : PopupService){

    this.evenement = false;
    this.consigne = false;
    this.actu = false;
    this.action = false;
    this.titre ="";
    this.dateDeb = "";
    this.dateFin = "";
    this.resultTableau = [];
    this.equipementGMAO = "";
    this.groupementGMAO = "";
    this.importance = 3;
  }
  
  ngOnInit(): void {

  }


  recherche(){

    this.resultTableau = [];

    //Il faut choisir une date de début
    if(this.dateDeb != undefined){
      var dateDebString = format(parseISO(this.dateDeb),'yyyy-MM-dd HH:mm');
    }
    else {
      this.popupService.alertErrorForm('Veuillez choisir une date de début. La saisie a été annulée.');
      return;
    }

    //Il faut choisir une dat de fin
    if(this.dateFin != undefined){
      var dateFinString = format(parseISO(this.dateFin),'yyyy-MM-dd HH:mm');
    }
    else {
      this.popupService.alertErrorForm('Veuillez choisir une date de Fin. La saisie a été annulée.');
      return;
    }

    //Il faut des dates cohérentes
    if(this.dateFin < this.dateDeb){
      this.popupService.alertErrorForm('Les dates ne correspondent pas. La saisie a été annulée.');
      return;
    }
    
    //Si l'action est cochée on les récupère
    if(this.action){
      this.cahierQuartService.getActionsEntreDeuxDates(dateDebString, dateFinString, this.titre).subscribe((response) => {
        for(const ligne of response.data){
          this.resultTableau.push(ligne)
        }
      })
    }
    
    //Si l'actu est cochée on les récupère
    if(this.actu){
      this.cahierQuartService.getActusEntreDeuxDates(dateDebString, dateFinString, this.titre, this.importance).subscribe((response) => {
        for(const ligne of response.data){
          this.resultTableau.push(ligne)
        }
      })
    }

    //Si l'évènement est cochée on les récupère
    if(this.evenement){
      this.cahierQuartService.getEvenementsEntreDeuxDates(dateDebString, dateFinString, this.titre, this.groupementGMAO, this.equipementGMAO, this.importance).subscribe((response) => {
        for(const ligne of response.data){
          this.resultTableau.push(ligne)
          console.log(ligne)
        }
      })
    }

    //Si consigne est cochée on les récupère
    if(this.consigne){
      this.cahierQuartService.getConsignesRecherche(dateDebString, dateFinString, this.titre).subscribe((response) => {
        for(const ligne of response.data){
          this.resultTableau.push(ligne)
        }
      })
    }
  }


  //Export de la table dans fichier EXCEL
  exportExcel(){
    /* table id is passed over here */
    let element = document.getElementById('tableResultats');
    console.log(element)
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element,{raw:false,dateNF:'mm/dd/yyyy HH:mm:ss'}); //Attention les jours sont considérés comme mois !!!!

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historique');

    /* save to file */
    XLSX.writeFile(wb, 'Historique_cahier_quart.xlsx');
  }

}
