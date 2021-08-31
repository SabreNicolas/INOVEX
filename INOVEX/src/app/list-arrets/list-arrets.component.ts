import { Component, OnInit } from '@angular/core';
import {arretsService} from "../services/arrets.service";
import {arret} from "../../models/arrets.model";
import {NgForm} from "@angular/forms";
import {sumArret} from "../../models/sumArret.model";

@Component({
  selector: 'app-list-arrets',
  templateUrl: './list-arrets.component.html',
  styleUrls: ['./list-arrets.component.scss']
})
export class ListArretsComponent implements OnInit {

  public listArrets : arret[];
  public sumArrets : sumArret[];
  public stringDateDebut : string;

  constructor(private arretsService : arretsService) {
    this.listArrets = [];
    this.sumArrets = [];
    this.stringDateDebut = '';
  }

  ngOnInit(): void {
    this.arretsService.getArrets(this.stringDateDebut.substr(6, 4) + '-' + this.stringDateDebut.substr(3, 2)).subscribe((response)=>{
      // @ts-ignore
      this.listArrets = response.data;
    });

    this.arretsService.getArretsType(this.stringDateDebut.substr(6, 4) + '-' + this.stringDateDebut.substr(3, 2)).subscribe((response)=>{
      // @ts-ignore
      this.sumArrets = response.data;
      this.arretsService.getArretsSum(this.stringDateDebut.substr(6, 4) + '-' + this.stringDateDebut.substr(3, 2)).subscribe((response)=>{
        // @ts-ignore
        this.sumArrets.push(response.data[0]);
      });
    });
  }

  setPeriod(form: NgForm){
    var date = new Date(form.value['dateDeb']);
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');
    this.stringDateDebut = dd + '/' + mm + '/' + yyyy;
    this.ngOnInit();
  }

  //changer les dates pour visualiser le mois en dernier
  setLastMonth(form: NgForm){
    var date = new Date();
    var mm = String(date.getMonth()).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');

    var Lastday = yyyy + '-' + mm;
    (<HTMLInputElement>document.getElementById("dateDeb")).value = Lastday;
    form.value['dateDeb'] = Lastday;
    this.setPeriod(form);
  }

}
