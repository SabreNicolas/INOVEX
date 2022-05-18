import { Component, OnInit } from '@angular/core';
import {rondierService} from "../services/rondier.service";
import {ronde} from "../../models/ronde.models";
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import {mesureRonde} from "../../models/mesureRonde.model";

@Component({
  selector: 'app-reporting-ronde',
  templateUrl: './reporting-ronde.component.html',
  styleUrls: ['./reporting-ronde.component.scss']
})
export class ReportingRondeComponent implements OnInit {

  public listRonde : ronde[];
  public dateDeb : String;
  public listReporting : mesureRonde[];

  constructor(private rondierService : rondierService) {
    this.listRonde = [];
    this.dateDeb = "";
    this.listReporting = [];
  }

  ngOnInit(): void {
    // @ts-ignore
    this.rondierService.listRonde(this.dateDeb).subscribe((response)=>{
      // @ts-ignore
      this.listRonde = response.data;
    });
    this.listReporting = [];
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

  getReporting(id : number){
    this.rondierService.reportingRonde(id).subscribe((response)=>{
      // @ts-ignore
      this.listReporting = response.data;
    });
  }

  deleteRonde(id : number){
    this.rondierService.deleteRonde(id).subscribe((response)=>{
      if (response == "Suppression de la ronde OK"){
        Swal.fire("La ronde a bien été supprimé !");
        this.ngOnInit();
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
    this.rondierService.updateMesureRondier(r.Id,value).subscribe((response)=>{
      if (response == "Mise à jour de la valeur OK"){
        Swal.fire("La valeur a bien été mis à jour !");
        this.ngOnInit();
        this.getReporting(r.rondeId);
      }
    });
  }


}
