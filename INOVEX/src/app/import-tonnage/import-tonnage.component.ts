import { Component, OnInit } from '@angular/core';
import {moralEntitiesService} from "../services/moralentities.service";
import Swal from 'sweetalert2';
import {moralEntity} from "../../models/moralEntity.model";
import { dechetsCollecteurs } from 'src/models/dechetsCollecteurs.model';
import { user } from 'src/models/user.model';

@Component({
  selector: 'app-import-tonnage',
  templateUrl: './import-tonnage.component.html',
  styleUrls: ['./import-tonnage.component.scss']
})
export class ImportTonnageComponent implements OnInit {

  public moralEntities : moralEntity[];
  public debCode : string;
  public listId : number[];
  private userLogged : user | undefined;
  public isAdmin : number;//0 ou 1
  private listTypeDechetsCollecteurs : dechetsCollecteurs[];
  public listTypeDechets : string[];
  public listCollecteurs : string[];
  public nomImport : string;

  constructor(private moralEntitiesService : moralEntitiesService) {
    this.debCode = '';
    this.listId = [];
    this.isAdmin = 0;
    this.moralEntities = [];
    this.listTypeDechetsCollecteurs = [];
    this.listTypeDechets = [];
    this.listCollecteurs = [];
    this.nomImport ="";
  }

  ngOnInit(): void {
    //Verification droit admin du user pour disabled ou non le btn d'edition des clients
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      // @ts-ignore
      this.isAdmin = this.userLogged['isAdmin'];
    }

    this.moralEntitiesService.getMoralEntitiesSansCorrespondance(this.debCode).subscribe((response)=>{
      // @ts-ignore
      this.moralEntities = response.data;
      console.log(this.moralEntities);
      //Récupération des types de déchets et des collecteurs
      this.moralEntitiesService.GetTypeDéchets().subscribe((response)=>{
        //@ts-ignore
        this.listTypeDechetsCollecteurs = response.data;

        //On boucle maintenant sur ce tableau pour scindé en déchets / collecteurs avec les codes associés
        this.listTypeDechetsCollecteurs.forEach(typeDechetsCollecteurs => {
          let typeDechets, collecteur, regroupType;

          //ON regroupe les noms DIB et DEA en 1 seul
          if(typeDechetsCollecteurs.Name.split(' ')[0] == 'DIB' || typeDechetsCollecteurs.Name.split(' ')[0] =='DEA'){
            regroupType = 'DIB/DEA';
          }
          else regroupType = typeDechetsCollecteurs.Name.split(' ')[0];
          typeDechets = typeDechetsCollecteurs.Code.substring(0,3)+"_"+regroupType;

          //GESTION cas spécifique DIB/DEA
          if(typeDechetsCollecteurs.Code.length > 5){
            collecteur = typeDechetsCollecteurs.Code.substring(3,5)+"_"+typeDechetsCollecteurs.Name.split(' ')[1];
          }
          else {
            collecteur = typeDechetsCollecteurs.Code.substring(3)+"_"+typeDechetsCollecteurs.Name.split(' ')[1];
          }

          if(!this.listTypeDechets.includes(typeDechets)){
            this.listTypeDechets.push(typeDechets);
          }
          if(!this.listCollecteurs.includes(collecteur)){
            this.listCollecteurs.push(collecteur);
          }
        });
      });
      
    });
  }

  setFilters(){
    /* Début prise en compte des filtres*/
    var produitElt = document.getElementById("produit");
    // @ts-ignore
    var produitSel = produitElt.options[produitElt.selectedIndex].value;
    var collecteurElt = document.getElementById("collecteur");
    // @ts-ignore
    var collecteurSel = collecteurElt.options[collecteurElt.selectedIndex].value;
    this.debCode = produitSel+collecteurSel;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  //Fonction pour attendre
  wait(ms : number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  ajoutCorrespondance(ProducerNom : string, ProducerId : number, ProductId : number){
    //@ts-ignore
    this.nomImport=(<HTMLElement>document.getElementById(ProducerId+"_nomImport").value)
    if(this.nomImport == ""){
      Swal.fire('Veuillez saisir le nom du client !','La saisie a été annulée.','error');
      return
    }
    Swal.fire({title: 'Êtes-vous que pour l\'apporteur ' +ProducerNom+', la corraspondance est : \n '+this.nomImport+'  ?',icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui',cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.moralEntitiesService.createImport_tonnage(ProducerId, ProductId, this.nomImport).subscribe((response) => {
            Swal.fire('Correspondance ajoutée','success');
            this.ngOnInit();
          })
        } 
        else {
          // Pop-up d'annulation de la suppression
          Swal.fire('Annulé','La création a été annulée.','error');
        }
      });
    
    
  }


}
