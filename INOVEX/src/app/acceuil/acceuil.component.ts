import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { site } from 'src/models/site.model';
import Swal from 'sweetalert2';
import {user} from "../../models/user.model";
import { categoriesService } from '../services/categories.service';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent implements OnInit {

  private userLogged : user | undefined;
  public nom : string;
  public prenom : string;
  public MD5pwd : string;
  public login : string;
  public isRondier : number; //0 ou 1
  public isSaisie : number;//0 ou 1
  public isQSE : number;//0 ou 1
  public isRapport : number;//0 ou 1
  public isAdmin : number;//0 ou 1
  public idUsine : number;
  public localisation : string;
  public sites : site[];

  constructor(private router : Router, private categoriesService : categoriesService) {
    this.nom = '';
    this.prenom = '';
    this.MD5pwd ='';
    this.login = '';
    this.isRondier = 0;
    this.isSaisie = 0;
    this.isQSE = 0;
    this.isRapport = 0;
    this.isAdmin = 0;
    this.idUsine = 0;
    this.localisation='';
    this.sites = [];
  }

  ngOnInit(): void {
    window.parent.document.title = 'PAPREX';
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;

      //Récupération de l'idUsine
      // @ts-ignore
      this.idUsine = this.userLogged['idUsine'];

      //SI utilisateur GLOBAL alors choix du site à administrer/se connecter
      //Id 5 correspond à "GLOBAL"
      if (this.idUsine == 5) {
        this.choixSite();
      }
      
      // @ts-ignore
      this.nom = this.userLogged['Nom'];
      // @ts-ignore
      this.prenom = this.userLogged['Prenom'];
      // @ts-ignore
      this.MD5pwd = this.userLogged['pwd'];
      // @ts-ignore
      this.login = this.userLogged['login'];
      // @ts-ignore
      this.isRondier = this.userLogged['isRondier'];
      // @ts-ignore
      this.isQSE = this.userLogged['isQSE'];
      // @ts-ignore
      this.isRapport = this.userLogged['isRapport'];
      // @ts-ignore
      this.isSaisie = this.userLogged['isSaisie'];
      // @ts-ignore
      this.isAdmin = this.userLogged['isAdmin'];
      // @ts-ignore
      this.localisation = this.userLogged['localisation'];
    }

  }

  navigate(route : string){
    let newRelativeUrl = this.router.createUrlTree([route]);
    let baseUrl = window.location.href.replace(this.router.url, '');

    window.open(baseUrl + newRelativeUrl, '_blank');
  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  choixSite(){
    //Récupération des sites
    this.categoriesService.getSites().subscribe((response)=>{
      // @ts-ignore
      this.sites = response.data;
      //Construction des valeurs du menu select qui contient les sites
      let listSites = {};
      this.sites.forEach(site =>{
        let id = String(site.id)+"_"+site.localisation;
        //@ts-ignore
        listSites[id] = site.localisation;
      });

      Swal.fire({
        title: 'Veuillez Choisir un site',
        input: 'select',
        //TODO list dynamqiue + stockage dans localStorage
        inputOptions: listSites,
        showCancelButton: false,
        confirmButtonText: "Valider",
        allowOutsideClick: false,
      })
      .then((result) => {
        let usine_localisation = result.value.split("_");
        //Premier élément du tableau est l'idUsine
        //@ts-ignore
        this.userLogged['idUsine'] = usine_localisation[0];
        //@ts-ignore
        this.idUsine = this.userLogged['idUsine'];
        //2e élément du tableau est la localisation géographiques
        //@ts-ignore
        this.userLogged['localisation'] = usine_localisation[1];
        //@ts-ignore
        this.localisation = this.userLogged['localisation'];
        //ON met à jour le user dans le localstorage
        localStorage.setItem('user',JSON.stringify(this.userLogged));
      });
    });
  }

}
