import { Component, OnInit } from '@angular/core';
import { rondierService } from '../services/rondier.service';
import { groupement } from '../../models/groupement.model';
@Component({
  selector: 'app-list-groupements',
  templateUrl: './list-groupements.component.html',
  styleUrls: ['./list-groupements.component.scss']
})
export class ListGroupementsComponent implements OnInit {

  public listGroupement  :groupement[];

  constructor(public rondierService : rondierService) { 
    this.listGroupement = [];
  }

  ngOnInit(): void {
    this.rondierService.getAllGroupements().subscribe((response) =>{
      //@ts-ignore
      this.listGroupement =response.data;
    })
  }
  getPreviousItem(index :number){
    if(index > 0){
      return this.listGroupement[index-1]['zoneId'];
    }
    return 0;
  }
}
