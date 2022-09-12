import { Component, OnInit } from '@angular/core';
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
  public listReporting : mesureRonde[];
  public listAnomalie : anomalie[];
  public listElementsOfZone : elementsOfZone[];
  public listPermisFeuValidation : permisFeuValidation[];
  public isAdmin;
  public test : SafeUrl | undefined;

  constructor(private rondierService : rondierService, private sanitizer: DomSanitizer) {
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
    this.listReporting = [];
    this.listAnomalie = [];
    this.listElementsOfZone = [];
    this.listPermisFeuValidation = [];
    //Récupération de l'utilisateur pour vérifier si il est admin => permettre suppression ronde si admin
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      // @ts-ignore
      this.isAdmin = userLoggedParse['isAdmin'];
    }
  }

  ngOnInit(): void {
    window.parent.document.title = 'INOVEX - Rondier';

    this.listAnomalie = [];
    this.listReporting = [];
    // @ts-ignore
    // retourne 3 rondes par jour, 1 pour le matin, 1 pour l'aprem et 1 pour la nuit
    this.rondierService.listRonde(this.dateDeb).subscribe((response)=>{
      // @ts-ignore
      this.listRonde = response.data;
      //Récupération des zones et de leurs éléments
      this.rondierService.listZonesAndElements().subscribe((response)=>{
        // @ts-ignore
        this.listElementsOfZone = response.BadgeAndElementsOfZone;
        this.listRonde.forEach(ronde =>{
          //Récupération des éléments et leurs valeurs sur la ronde
          this.rondierService.reportingRonde(ronde.Id).subscribe((response)=>{
            // @ts-ignore
            response.data.forEach(reporting =>{
              this.listReporting.push(reporting);
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

  updateValueElement(r : mesureRonde){
    var value = prompt('Veuillez saisir une valeur',r.value);
    if (value == null) {
      return; //break out of the function early
    }
    this.rondierService.updateMesureRondier(r.Id,value).subscribe((response)=>{
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

  downloadImage(anomalie : anomalie) {
    // @ts-ignore
    var byteArray = new Uint8Array(anomalie.photo.data);
    var blob = new Blob([byteArray], {type: "image/png"});
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  }


}
