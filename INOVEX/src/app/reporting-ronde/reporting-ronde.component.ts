import { Component, ElementRef, OnInit } from '@angular/core';
import {rondierService} from "../services/rondier.service";
import {ronde} from "../../models/ronde.models";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import {mesureRonde} from "../../models/mesureRonde.model";
import {anomalie} from "../../models/anomalie.model";
import {elementsOfZone} from "../../models/elementsOfZone.model";
import {permisFeuValidation} from "../../models/permisfeu-validation.model";
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-reporting-ronde',
  templateUrl: './reporting-ronde.component.html',
  styleUrls: ['./reporting-ronde.component.scss']
})
export class ReportingRondeComponent implements OnInit {

  public listRonde : ronde[];
  public dateDeb : String | undefined;
  public listAnomalie : anomalie[];
  public listElementsOfZone : elementsOfZone[];
  public listPermisFeuValidation : permisFeuValidation[];
  public isAdmin;
  public numbers : number[]; 
  private nbfour : number;

  constructor(private rondierService : rondierService, private elementRef : ElementRef) {
    this.listRonde = [];
    /*//mettre hier comme date par défaut
    var dt = new Date();
    dt.setDate(dt.getDate());
    var dd = String(dt.getDate() - 1).padStart(2, '0');
    var mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dt.getFullYear();
    var day = dd + '/' + mm + '/' + yyyy;
    this.dateDeb = day;
    //fin gestion date défaut*/
    this.listAnomalie = [];
    this.listElementsOfZone = [];
    this.listPermisFeuValidation = [];
    //contient des chiffres pour l'itération des fours
    this.numbers = [];
    this.nbfour = 0;
    //Récupération de l'utilisateur pour vérifier si il est admin => permettre suppression ronde si admin
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      // @ts-ignore
      this.isAdmin = userLoggedParse['isAdmin'];
    }
  }

  ngOnInit(): void {

    this.listAnomalie = [];
    //this.listReporting = [];
    // retourne 3 rondes par jour, 1 pour le matin, 1 pour l'aprem et 1 pour la nuit
    if(this.dateDeb != undefined){
      // @ts-ignore
      this.rondierService.listRonde(this.dateDeb).subscribe((response)=>{
        // @ts-ignore
        this.listRonde = response.data;
        //Récupération des zones et de leurs éléments
        this.rondierService.listZonesAndElements().subscribe((response)=>{
          // @ts-ignore
          this.listElementsOfZone = response.BadgeAndElementsOfZone;
          this.listRonde.forEach(async ronde =>{
            await this.await(500);
            //Récupération des éléments et leurs valeurs sur la ronde
            this.rondierService.reportingRonde(ronde.Id).subscribe((response)=>{
              // @ts-ignore
              response.data.forEach(reporting =>{
                let champValue = document.getElementById(ronde.Id+"-"+reporting.elementId);
                let champError = document.getElementById(ronde.Id+"-"+reporting.elementId+"-Error");
                //SI on a un mode regulateur on affiche le champ et on affiche le mode
                if(reporting.modeRegulateur != "undefined"){
                  let champRegul = document.getElementById(ronde.Id+"-"+reporting.elementId+"-Regulateur");
                  //let champValue = document.getElementById(ronde.Id+"-"+reporting.elementId);
                  // @ts-ignore
                  champRegul.style.display = "block";
                  // @ts-ignore
                  champRegul.innerText = reporting.modeRegulateur;
                }
                let champValueContenu, champValueError;
                //On affiche la valeur uniquement si elle a été saisie
                if(reporting.value != "/"){
                  champValueContenu = ""+reporting.value + " " + reporting.unit + " ";
                  //On vérifie que la valeur est réglementaire (entre les bornes ou correspond à la valeur par défaut)
                  //Si curseur (type 1) => doit etre compris entre les bornes
                  if((reporting.typeChamp == "1") && (Number(reporting.value) < reporting.valeurMin || Number(reporting.value) > reporting.valeurMax)){
                    //On utilise champValue pour afficher le message
                    console.log(Number(reporting.value) + " "+ reporting.valeurMin+" "+reporting.valeurMax)
                    // @ts-ignore
                    champError.style.backgroundColor = "#ff726f";
                    // @ts-ignore
                    champValueError = "ATTENTION, doit être compris entre "+reporting.valeurMin+" "+reporting.unit+" & "+reporting.valeurMax+" "+reporting.unit;
                  }
                  //Si pas curseur (différent de type 1) => doit etre égal à la valeur par défaut
                  if(reporting.typeChamp !== "1" && reporting.value != reporting.defaultValue && reporting.defaultValue.length > 0){
                    //On utilise champValue pour afficher le medssage
                    // @ts-ignore
                    champError.style.backgroundColor = "#ff726f";
                    // @ts-ignore
                    champValueError = "ATTENTION, la valeur par défaut est : "+reporting.defaultValue+" "+reporting.unit;
                  }
                }
                //Sinon on surligne en rouge et on précise que ce n'est pas saisie
                else {
                  // @ts-ignore
                  champValue.style.backgroundColor = "red";
                  // @ts-ignore
                  champValueContenu = "NON SAISIE ";
                }
                // @ts-ignore
                champValue.innerHTML = champValueContenu;
                //On affiche le message d'erreur si nécessaire
                if( (reporting.typeChamp == "1" && (Number(reporting.value) < reporting.valeurMin || Number(reporting.value) > reporting.valeurMax)) || (reporting.typeChamp !== "1" && reporting.value !== reporting.defaultValue && reporting.defaultValue.length > 0)){
                  // @ts-ignore
                  champError.innerHTML = champValueError;
                  // @ts-ignore
                  champError.style.display = "block"
                }

                //Création du button d'update de la valeur si utilisateur admin
                if(this.isAdmin){
                  const button = document.createElement("button");
                  button.className = "btn btn-warning btn-sm";
                  button.id = "update"+reporting.Id;
                  const i = document.createElement("i");
                  i.className = "fa fa-pencil-square-o";
                  button.appendChild(i);
                  button.addEventListener('click', (e) =>{
                    this.updateValueElement(reporting.Id,reporting.value);
                  });
                  // @ts-ignore
                  champValue.appendChild(button);
                }
                //FIN Création du button edit
              });
              //Récupération des anomalies sur la ronde
              this.rondierService.listAnomalies(ronde.Id).subscribe((response)=>{
                // @ts-ignore
                response.data.forEach(anomalie =>{
                  this.listAnomalie.push(anomalie);
                });
              });
            });
          });
        });

        //Récupération des validations de permis de feu
        this.rondierService.listPermisFeuValidation(this.dateDeb).subscribe((response)=>{
          // @ts-ignore
          this.listPermisFeuValidation = response.data;
        });

        //Récupération du nombre de four du site
        this.rondierService.nbLigne().subscribe((response)=>{
          //@ts-ignore
          this.nbfour = response.data[0].nbLigne;
          this.numbers = Array(this.nbfour).fill(1).map((x,i) => i+1);
        });

      });
    }
    
  }

  await(ms : number){
    return new Promise(resolve => {
      setTimeout(resolve,ms);
    });
  }

  setPeriod(form: NgForm) {
    var dt = new Date(form.value['dateDeb']);
    dt.setDate(dt.getDate());
    var dd = String(dt.getDate()).padStart(2, '0');
    var mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dt.getFullYear();
    var day = dd + '/' + mm + '/' + yyyy;
    this.dateDeb = day;
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
            Swal.fire("La ronde a bien été supprimé !");
            this.ngOnInit();
          }
        });
      }
    });
  }

  clotureRonde(id : number){
    this.rondierService.closeRonde(id).subscribe((response)=>{
      if (response == "Cloture de la ronde OK"){
        Swal.fire("La ronde a bien été cloturé !");
        this.ngOnInit();
      }
    });
  }

  updateValueElement(Id : number,Val : string){
    var value = prompt('Veuillez saisir une valeur',Val);
    if (value == null) {
      return; //break out of the function early
    }
    this.rondierService.updateMesureRondier(Id,value).subscribe((response)=>{
      if (response == "Mise à jour de la valeur OK"){
        Swal.fire("La valeur a bien été mis à jour !");
        this.ngOnInit();
      }
    });
  }

  /*downloadImage(anomalie : anomalie){
    // Obtain a blob: URL for the image data.
    var binary = '';
    // @ts-ignore
    var arrayBufferView = new Uint8Array(anomalie.photo.data);
    console.log(arrayBufferView);
    var len =  arrayBufferView.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(  arrayBufferView[ i ] );
    }
    var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL( blob );
    console.log(blob);
    console.log(imageUrl);
    var img = document.getElementById( "image" );
    // @ts-ignore
    img.src = imageUrl;
  }*/

  downloadImage(urlPhoto : string) {
    window.open(urlPhoto, '_blank');
  }

  //permet de vérifier si le four est en route
  checkFonctFour(fourNum : number, ronde : ronde){
    let fonctFour = "fonctFour"+fourNum;
    //@ts-ignore
    return ronde[fonctFour];
  }


}
