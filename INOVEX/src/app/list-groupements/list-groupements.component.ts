import { Component, OnInit } from '@angular/core';
import { rondierService } from '../services/rondier.service';
import { groupement } from '../../models/groupement.model';
import Swal from 'sweetalert2';


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

  deleteGroupement(idGroupement : number){
    Swal.fire({title: 'Êtes-vous sûr(e) de vouloir supprimer ce groupement ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.rondierService.deleteGroupement(idGroupement).subscribe((response)=>{
            Swal.fire('Confirmé','La suprression a été effectuée.','success');
            this.ngOnInit();
          })
        } 
        else {
          // Pop-up d'annulation de la suppression
          Swal.fire('Annulé','La suprression a été annulée.','error');
        }
      });
  }
}

