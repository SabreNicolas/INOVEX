import { Component } from '@angular/core';
import { anomalie } from 'src/models/anomalie.model';
import {rondierService} from "../services/rondier.service";

@Component({
  selector: 'app-list-anomalies',
  templateUrl: './list-anomalies.component.html',
  styleUrls: ['./list-anomalies.component.scss']
})
export class ListAnomaliesComponent {

  public listAnomalies : any[];

  constructor(private rondierService : rondierService) {
    this.listAnomalies = [];
  }

  ngOnInit(): void {
    this.rondierService.getAllAnomalies().subscribe((response)=>{
      // @ts-ignore
      this.listAnomalies = response.data;
    });


  }

  downloadImage(urlPhoto : string) {
    window.open(urlPhoto, '_blank');
  }
}
