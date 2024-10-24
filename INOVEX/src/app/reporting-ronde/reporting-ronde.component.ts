import { Component, ElementRef, OnInit, EventEmitter } from '@angular/core';
import {rondierService} from "../services/rondier.service";
import {ronde} from "../../models/ronde.models";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import {anomalie} from "../../models/anomalie.model";
import {elementsOfZone} from "../../models/elementsOfZone.model";
import {permisFeuValidation} from "../../models/permisfeu-validation.model";
import {user} from "../../models/user.model";
import { groupement } from 'src/models/groupement.model';
import { PopupService } from '../services/popup.service';
declare var $ : any;

@Component({
  selector: 'app-reporting-ronde',
  templateUrl: './reporting-ronde.component.html',
  styleUrls: ['./reporting-ronde.component.scss']
})
export class ReportingRondeComponent implements OnInit {

  public listRonde : ronde[];
  public listReprise : any[];
  public listZone : any[];
  public dateDeb : string | undefined;
  public listAnomalie : anomalie[];
  public listElementsOfZone : elementsOfZone[];
  public listElementsOfZoneControl : elementsOfZone[];
  public listPermisFeuValidation : permisFeuValidation[];
  public isAdmin;
  public isChefQuart;
  public numbers : number[]; 
  private nbfour : number;
  public filtreZone : string;
  public userLogged!: user;
  public idUsine : number;
  public usine : string;
  public isSuperAdmin : boolean;
  public dateRechercher: string;
  public quart: number;
  public listElementsOfUsine : any[];
  public listGroupements : groupement[];
  public listeZoneUnique : Map<String,number>;
  public listElementsUniques : any;

  constructor(private rondierService : rondierService, private elementRef : ElementRef, private popupService : PopupService) {
    this.listRonde = [];
    this.listZone = [];
    this.listReprise = [];
    this.listeZoneUnique = new Map();
    this.usine="";
    this.isSuperAdmin = false;
    this.idUsine = 0;
    this.dateRechercher = "";
    this.quart = 0;
    var dt = new Date();
    dt.setDate(dt.getDate());
    var dd = String(dt.getDate()).padStart(2, '0');
    var mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dt.getFullYear();
    var day = dd + '/' + mm + '/' + yyyy;
    this.dateDeb = day;
    //fin gestion date défaut
    this.listAnomalie = [];
    this.listElementsOfZone = [];
    this.listElementsOfZoneControl = [];
    this.listPermisFeuValidation = [];
    this.listElementsOfUsine = [];
    this.listGroupements = [];
    this.listElementsUniques = [];
    //contient des chiffres pour l'itération des fours
    this.numbers = [];
    this.nbfour = 0;
    //Récupération de l'utilisateur pour vérifier si il est admin => permettre suppression ronde si admin
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      // @ts-ignore
      this.isAdmin = userLoggedParse['isAdmin'];
      this.isChefQuart = userLoggedParse['isChefQuart'];
    }
    this.filtreZone ="";
  }

  ngOnInit(): void {

    window.parent.document.title = 'CAP Exploitation - Ronde';

    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      //Récupération de l'idUsine
      // @ts-ignore
      this.idUsine = this.userLogged['idUsine'];
      if(this.userLogged.hasOwnProperty('localisation')){
        //@ts-ignore
        this.usine = this.userLogged['localisation'];
        this.isSuperAdmin = true;
      }
    }

    this.listAnomalie = [];
    //this.listReporting = [];

    //Récupération de l'heure actuelle
    const date = new Date();
    const heure = date.getHours();

    //Choix du quart en cours
    if(heure > 5 && heure < 13){
      this.quart = 1;
    }
    else if(heure > 13 && heure < 21){
      this.quart = 2;
    }
    else this.quart = 3;

    this.afficherRonde(this.quart);
  }


  afficherRonde(quart:number) {
    this.listAnomalie=[];
    this.listElementsOfUsine=[];
    this.listeZoneUnique = new Map();
    this.listRonde = [];
    this.listZone = [];
    this.listElementsUniques= [];
    this.listGroupements = [];
    this.quart=quart;

    this.rondierService.listZoneAndAnomalieOfDay(this.dateDeb, quart).subscribe((response)=>{
      //@ts-ignore
      this.listZone = response.listZones
      for(const ronde of this.listZone){
        for(const zone of ronde['listZones']){
          this.listeZoneUnique.set(zone['nom'],zone['Id']);
        }
      }
      this.listZone=[];
      for(const zone of this.listeZoneUnique){
        this.listZone.push({"nom":zone[0],"id":zone[1]})
      }
    })  

    this.rondierService.getReprisesRonde().subscribe((response)=>{
      //@ts-ignore
      this.listReprise = response.data
    })
    //Récupération du nombre de four du site
    this.rondierService.nbLigne().subscribe((response) => {
      //@ts-ignore
      this.nbfour = response.data[0].nbLigne;
      this.numbers = Array(this.nbfour).fill(1).map((x, i) => i + 1);
    }); 

    if(this.dateDeb != undefined)
      this.rondierService.affichageRonde(this.dateDeb, quart).subscribe((response)=>{
        //@ts-ignore
        this.listRonde = response.data
        // console.log(this.listRonde)
      })

    this.rondierService.getElementsAndValuesOfDay(this.dateDeb, quart).subscribe((response)=>{
      //@ts-ignore
      this.listElementsOfUsine = response.data;
      var prompt = "";
      var prompt0 = "";
      $(document).ready(() =>{
        setTimeout(() =>{
          //Affichage des éléments
          for(var i = this.listElementsOfUsine.length-1; i>=0; i--){
            if(i != 0 && (this.listElementsOfUsine[i].nom != this.listElementsOfUsine[i-1].nom || this.listElementsOfUsine[i].zoneId != this.listElementsOfUsine[i-1].zoneId) || i == 0 && (this.listElementsOfUsine[i].nom != this.listElementsOfUsine[i+1].nom || this.listElementsOfUsine[i].zoneId != this.listElementsOfUsine[i+1].zoneId)){
              console.log(this.listElementsOfUsine[i].nom);
              if(this.idUsine == 7){
                prompt ='<tr class="table-warning '+this.listElementsOfUsine[i].zoneId+'-ZoneElements '+this.listElementsOfUsine[i].idGroupement+'-elements" style="display:none">'
                +'<td>'+this.listElementsOfUsine[i].nom+'</td>';
              }
              else {
                prompt ='<tr class="table-warning '+this.listElementsOfUsine[i].zoneId+'-ZoneElements '+'">'
                            +'<td>'+this.listElementsOfUsine[i].nom+'</td>';
              }
              for(const ronde of this.listRonde){
                prompt = prompt + '<td style="text-align: center;" class="'+ronde.Id+'" id="'+ronde.Id+'--'+this.listElementsOfUsine[i].Id+'"></td>'
              }
              if(this.listElementsOfUsine[i].idGroupement != null){
                var id = '#groupement--'+this.listElementsOfUsine[i].idGroupement
                $(id).after(prompt)
              }
              else{
                var id = '#zone--'+this.listElementsOfUsine[i].zoneId
                $(id).after(prompt)
              }
            }
          }
          //Affichage du premier élément
          if(this.idUsine == 7){
            prompt0 ='<tr class="table-warning '+this.listElementsOfUsine[0].zoneId+'-ZoneElements '+this.listElementsOfUsine[0].idGroupement+'-elements" style="display:none">'
                  +'<td>'+this.listElementsOfUsine[0].nom+'</td>';
          }
          else{
            prompt0 ='<tr class="table-warning '+this.listElementsOfUsine[0].zoneId+'-ZoneElements '+'">'
                  +'<td>'+this.listElementsOfUsine[0].nom+'</td>';
          }
          
          for(const ronde of this.listRonde){
            prompt0 = prompt0 + '<td style="text-align: center;" class="'+ronde.Id+'" id="'+ronde.Id+'--'+this.listElementsOfUsine[0].Id+'"></td>'
          }
          if(this.listElementsOfUsine[0].idGroupement != null){
            var id = '#groupement--'+this.listElementsOfUsine[0].idGroupement
            //console.log($(id).after(prompt0))
          }
          else{
            var id = '#zone--'+this.listElementsOfUsine[0].zoneId
            //console.log($(id).after(prompt0))
          }

          //Remplissage des valeurs
          for(var i =0; i<this.listElementsOfUsine.length; i++){
            var id = '#'+this.listElementsOfUsine[i].idRonde+'--'+this.listElementsOfUsine[i].Id
            var promptVal =  "";
            if(this.listElementsOfUsine[i].value == "/"){
              promptVal += '<p style="background-color: red;">NON SAISIE</p>'
            }
            else {
              promptVal += '<p>'+this.listElementsOfUsine[i].value+' <span style="color: rgb(84,149,216); font-weight : bold;">'+this.listElementsOfUsine[i].unit+'</span></p>'
            }
            promptVal += '<button id="'+this.listElementsOfUsine[i].idMesure+'--'+this.listElementsOfUsine[i].value+'" class="btn btn-warning btn-sm updateValue" ><i class="fa fa-pencil-square-o" id="'+this.listElementsOfUsine[i].idMesure+'--'+this.listElementsOfUsine[i].value+'" aria-hidden="true"></i></button>'
            if(this.listElementsOfUsine[i].value != this.listElementsOfUsine[i].defaultValue && this.listElementsOfUsine[i].defaultValue != ''){
              promptVal += '<p style="background-color: #ff726f;">Attention la valeur par défaut est :'+this.listElementsOfUsine[i].defaultValue+'</p>'
            }
            if( this.listElementsOfUsine[i].typeChamp == "1" &&(this.listElementsOfUsine[i].value < this.listElementsOfUsine[i].valeurMin || this.listElementsOfUsine[i].value > this.listElementsOfUsine[i].valeurMax)){
              promptVal += '<p style="background-color: #ff726f;" >Attention la valeur doit être comprise entre '+this.listElementsOfUsine[i].valeurMin+' et '+this.listElementsOfUsine[i].valeurMax+' </p>'
            }

            //Fonction pour modifier la valeur d'un élément
            $(id).append(promptVal).on('click','.updateValue', (event : any)=>{
              var id = event.target.id.split('--')[0];
              var value = event.target.id.split('--')[1];
              this.updateValueElement(id,value);
            })
              
          }
        },1000)
      })
      this.setFilters();
    })

    this.rondierService.getGroupementsOfOneDay(this.dateDeb, quart).subscribe((response)=>{
      //@ts-ignore
      this.listGroupements = response.data
      // console.log(this.listGroupements)
    })

    this.rondierService.getAnomaliesOfOneDay(this.dateDeb, quart).subscribe((response)=>{
      //@ts-ignore
      this.listAnomalie = response.data
      // console.log(this.listAnomalie)
    })
  }

  await(ms : number){
    return new Promise(resolve => {
      setTimeout(resolve,ms);
    });
  }

  //Quand on change de date, on affiche le quart correspondant au quart en cour à la date donnée.
  setPeriod(form: NgForm) {
    var dt = new Date(form.value['dateDeb']);
    dt.setDate(dt.getDate());
    var dd = String(dt.getDate()).padStart(2, '0');
    var mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dt.getFullYear();
    var day = dd + '/' + mm + '/' + yyyy;
    this.dateDeb = day;
    // (<HTMLDivElement>document.getElementById("tableDesRondes")).style.display = "block";
    this.ngOnInit();
  }

  //changer les dates pour saisir hier
  setYesterday(form: NgForm){
    var date = new Date();
    var yyyy = date.getFullYear();
    var dd = String(date.getDate() - 1).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    if(dd === '00'){
      dd = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(2, '0');
      mm = String(date.getMonth()).padStart(2, '0');
    }
    var day = yyyy + '-' + mm + '-' + dd;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = day;
    form.value['dateDeb'] = day;
    this.setPeriod(form);
  }

  //changer les dates pour saisir aujourd'hui
  setToday(form: NgForm){
    var date = new Date();
    var yyyy = date.getFullYear();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var day = yyyy + '-' + mm + '-' + dd;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = day;
    form.value['dateDeb'] = day;
    this.setPeriod(form);
  }

  deleteRonde(id : number){
    Swal.fire({
      title: 'Etes vous certain de vouloir supprimer cette ronde ?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Oui',
      denyButtonText: 'Non',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.rondierService.deleteRonde(id).subscribe((response)=>{
          if (response == "Suppression de la ronde OK"){
            this.popupService.alertSuccessForm("La ronde a bien été supprimé !");
            this.ngOnInit();
          }
        });
      }
    });
  }

  clotureRonde(id : number){
    this.rondierService.closeRonde(id).subscribe((response)=>{
      if (response == "Cloture de la ronde OK"){
        this.popupService.alertSuccessForm("La ronde a bien été cloturé !");
        this.ngOnInit();
      }
    });
  }

  updateValueElement(Id : number,Val : string){
    var value = prompt('Veuillez saisir une valeur',Val);
    if (value == null) {
      return; //break out of the function early
    }
    value = value.replace(/'/g,"''");
    this.rondierService.updateMesureRondier(Id,value).subscribe((response)=>{
      if (response == "Mise à jour de la valeur OK"){
        this.popupService.alertSuccessForm("La valeur a bien été mis à jour !");
        this.ngOnInit();
      }
    });
  }

  downloadImage(urlPhoto : string) {
    window.open(urlPhoto, '_blank');
  }

  //permet de vérifier si le four est en route
  checkFonctFour(fourNum : number, ronde : ronde){
    let fonctFour = "fonctFour"+fourNum;
    //@ts-ignore
    return ronde[fonctFour];
  }

  async setFilters(){
    //@ts-ignore
    var nameElt = document.getElementById("name").value;
    var typeElt= null;
    if(nameElt != ''){
      this.filtreZone= nameElt.toLowerCase();
      //@ts-ignore
      document.getElementById("type").value ="";
    }
    else{
      typeElt = document.getElementById("type");
      // @ts-ignore
      this.filtreZone = typeElt.options[typeElt.selectedIndex].value.toLowerCase();
    }
    $(".table-warning").hide();
    $(".table-light").hide();

    for(const zone of this.listZone){
      if(zone.nom.toLowerCase().includes(this.filtreZone) || zone.nom.toLowerCase() == this.filtreZone){
        // console.log(zone.id)
        if(this.idUsine != 7) $("."+zone.id+"-ZoneElements").show();
        $("#zone--"+zone.id).show();
        $("."+zone.id+"-Zone").show();

      }
    }
  }

  async resetFiltre(){
    this.filtreZone="";
    //@ts-ignore
    document.getElementById("name").value = "";
    this.afficherRonde(this.quart);
  }

  editAnomalie(rondeId : number, zoneId : number){
    var nvCommentaire;
    //@ts-ignore
    var commentaire = document.getElementById(rondeId+"--"+zoneId).innerHTML;
    if(commentaire == ""){
      nvCommentaire = prompt('Veuillez le nouveau commentaire','');
      if(nvCommentaire != null){
        nvCommentaire = nvCommentaire.replace(/'/g,"''")
        this.rondierService.createAnomalie(rondeId, nvCommentaire, zoneId).subscribe((response) =>{
          this.popupService.alertSuccessForm('Commentaire modifié');
          this.ngOnInit();
        })
      }
    }
    else{
      nvCommentaire = prompt('Veuillez modifier le commentaire',commentaire);
      if(nvCommentaire != null){
        nvCommentaire = nvCommentaire.replace(/'/g,"''")
        this.rondierService.updateAnomalie(rondeId,zoneId,nvCommentaire).subscribe((response) =>{
          this.popupService.alertSuccessForm('Commentaire modifié');
          this.ngOnInit();
        })
      }
      
    }
  }
  
  afficherGroupement(groupement : number){
    $('.'+String(groupement) + "-elements").toggle(1000);
    $('.'+groupement + "-btnMoins").toggle();
    $('.'+groupement + "-btnPlus").toggle();
  }

  afficherZone(zone : number){
    console.log($('.'+String(zone) + "-Zone"))
    $('.'+String(zone) + "-Zone").toggle(1000);
    $('.'+String(zone) + "-ZoneElements").hide(1000);
    $('.'+String(zone) + "-ZonebtnPlus").show(1000);
    $('.'+String(zone) + "-ZonebtnMoins").hide(1000);
    $('.'+zone + "-btnMoins").toggle();
    $('.'+zone + "-btnPlus").toggle();
  }

  repriseDeRonde(){
    Swal.fire({ 
      title: 'Veuillez choisir une date et une option', 
      html: ` <input type="date" id="date-input" class="swal2-input"> 
      <select id="option-select" class="swal2-select"> 
      <option value="" disabled selected>Choisissez un quart</option> 
      <option value="1">Matin</option> 
      <option value="2">Après-midi</option> 
      <option value="3">Nuit</option> 
      </select> `
      , 
      focusConfirm: false, 
      preConfirm: () => { 
        //@ts-ignore
        const date = Swal.getPopup().querySelector('#date-input').value; 
        //@ts-ignore
        const option = Swal.getPopup().querySelector('#option-select').value; 
        if (!date || !option) { 
          Swal.showValidationMessage(`Veuillez remplir les deux champs`); 
        } 
        return { date: date, option: option }; 
      } 
    })
    .then((result) => { 
      if (result.isConfirmed) { 
        console.log(`Date choisie: ${result.value.date}`); 
        console.log(`Option choisie: ${result.value.option}`); 
        this.rondierService.createRepriseDeRonde(result.value.date,result.value.option).subscribe((response)=>{
          this.ngOnInit();
        })
      } 
    }); 
  }

  //suppression d'une reprise
  deleteRepriseRonde(id : number){
    
    Swal.fire({title: "Etes vous sûr de vouloir supprimer ?" ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rondierService.deleteRepriseRonde(id).subscribe((response)=>{
          if (response == "Suppression de la reprise OK"){
            this.popupService.alertSuccessForm("La reprise a bien été supprimé !");
          }
          else {
            this.popupService.alertErrorForm('Erreur lors de la suppression....')
          }
        });
        this.ngOnInit();
      }  
      else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm('La suppression a été annulée.');
      }
    });
  }
}
