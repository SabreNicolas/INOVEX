import { Component, OnInit } from '@angular/core';
import { rapport } from 'src/models/rapport.model';
import { rapportsService } from '../services/rapports.service';

@Component({
  selector: 'app-list-rapports',
  templateUrl: './list-rapports.component.html',
  styleUrls: ['./list-rapports.component.scss']
})
export class ListRapportsComponent implements OnInit {

  public listRapports : rapport[];

  constructor(private rapportsService : rapportsService) {
    this.listRapports = [];
   }

  ngOnInit(): void {
    window.parent.document.title = 'CAP Exploitation - Rapports';

    //récupération des rapports
    this.rapportsService.getRapports().subscribe((response)=>{
      // @ts-ignore
      this.listRapports = response.data;
    });
  }

  download(url : string){
    alert(url);
    window.location.assign(url);
  }

}
