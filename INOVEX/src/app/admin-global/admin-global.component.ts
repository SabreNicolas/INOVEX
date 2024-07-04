import { Component, OnInit } from '@angular/core';
import { categoriesService } from '../services/categories.service';
import { user } from 'src/models/user.model';
import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfMake/build/vfs_fonts'
import { style } from '@angular/animations';
import { table } from 'console';
import { rondierService } from '../services/rondier.service';

//@ts-ignore
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-admin-global',
  templateUrl: './admin-global.component.html',
  styleUrls: ['./admin-global.component.scss']
})
export class AdminGlobalComponent implements OnInit {

  public isSuperAdmin : boolean;
  public idUsine : number;
  public userLogged!: user;
  public usine : string;
  private listZones : any[];
  private listGroupements: any[];
  private listElements: any[];

  constructor(private categoriesService : categoriesService, private rondierService: rondierService) { 
    this.isSuperAdmin = false;
    this.idUsine = 0;
    this.usine="";
    this.listElements= [];
    this.listGroupements=[];
    this.listZones=[];
  }

  ngOnInit(): void {
    window.parent.document.title = 'CAP Exploitation - Admin';

    //La création de produit est uniquement possible par les superAdmin
    //dans le but d'avoir un référentiel produit unique
    //La création d'un produit, le cré pour l'ensemble des sites
    var userLogged = localStorage.getItem('user');
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      //Si une localisation est stocké dans le localstorage, c'est que c'est un superAdmin et qu'il a choisi le site au début
      if(userLoggedParse.hasOwnProperty('localisation')){
        this.isSuperAdmin = true;
      }
      this.userLogged = userLoggedParse;
      // @ts-ignore
      this.idUsine = this.userLogged['idUsine'];
      // @ts-ignore
      this.usine = this.userLogged['localisation'];
    }

    //stockage de l'ensemble des sites dans le le service categories pour la création de produit pour l'ensemble des sites
    this.categoriesService.getSites().subscribe((response)=>{
      //@ts-ignore
      this.categoriesService.sites = response.data;
    });
    
  }

  download(file : string){
    window.open(file, '_blank');
  }
  

  pdfMake(){
    console.log('pdfMake start');
    const tableHeader = [
      {text:'Element de contrôle', margin: [0,0,0,0],fontSize: 8,fillColor: '#dddddd',}, 
      {text:'Matin', margin: [0,0,0,0],fontSize: 8,fillColor: '#dddddd',},
      {text:'Après-midi', margin: [0,0,0,0],fontSize: 8,fillColor: '#dddddd',},
      {text:'Nuit', margin: [0,0,0,0],fontSize: 8,fillColor: '#dddddd',}
    ];

    var data = [
        {text:'Auteur de la ronde'},
        {text:'Chef de quart'},
        {text:'Four 1 en fonctionnement ?'},
        {text:'Four 2 en fonctionnement ?'}
    ]
    
    const tableBody = data.map(item =>{
      return [
        {text : item.text,  margin: [0,0,0,0], fontSize: 8,style: 'tableCell'},
        {text : '',  margin: [0,0,0,0], fontSize: 8,style: 'tableCell'},
        {text : '',  margin: [0,0,0,0],fontSize: 8, style: 'tableCell'},
        {text : '',  margin: [0,0,0,0], fontSize: 8,style: 'tableCell'}
      ]
    })

    this.rondierService.listZonesAndElements().subscribe(async (response) => {
      var dataToAdd: any[] = [];
      //@ts-ignore
      this.listZones =response.BadgeAndElementsOfZone
      console.log(response)
        for await (let zone of this.listZones){
          dataToAdd.push(
            {text: zone.zone, style: 'tableHeader',fontSize: 8,color:'#007FFF', colSpan: 4, alignment: 'center',margin: [0,0,0,0]},
          )
          tableBody.push(dataToAdd);
          dataToAdd = [];
    
          if(zone.elements[0].groupement != null){
            dataToAdd.push(
              {text: zone.elements[0].groupement,fontSize: 8, style: 'tableHeader',color: '#FF7F50',colSpan: 4, alignment: 'left',margin: [0,0,0,0]},
            )
            tableBody.push(dataToAdd);
            dataToAdd = [];
            dataToAdd.push(
              {text: zone.elements[0].nom, fontSize: 8,style: 'tableHeader',margin: [0,0,0,0]},
              {text : '',  margin: [0,0,0,0], style: 'tableCell'},
              {text : '',  margin: [0,0,0,0], style: 'tableCell'},
              {text : '',  margin: [0,0,0,0], style: 'tableCell'}
            )
            tableBody.push(dataToAdd);
            dataToAdd = [];
          }
          else{
            dataToAdd.push(
              {text: zone.elements[0].nom, fontSize: 8,style: 'tableHeader',margin: [0,0,0,0]},
              {text : '',  margin: [0,0,0,0], style: 'tableCell'},
              {text : '',  margin: [0,0,0,0], style: 'tableCell'},
              {text : '',  margin: [0,0,0,0], style: 'tableCell'}
            )
            tableBody.push(dataToAdd);
            dataToAdd = [];
          }
          for (var i=1; i< zone.elements.length; i++){
            if(zone.elements[i].groupement != zone.elements[i-1].groupement){
              dataToAdd.push(
                {text: zone.elements[i].groupement,fontSize: 8, style: 'tableHeader',color: '#FF7F50',colSpan: 4, alignment: 'left',margin: [0,0,0,0]},
              )
              tableBody.push(dataToAdd);
              dataToAdd = [];
            }
            dataToAdd.push(
              {text: zone.elements[i].nom, fontSize: 8,style: 'tableHeader',margin: [0,0,0,0]},
              {text : '',  margin: [0,0,0,0], style: 'tableCell'},
              {text : '',  margin: [0,0,0,0], style: 'tableCell'},
              {text : '',  margin: [0,0,0,0], style: 'tableCell'}
            )
            tableBody.push(dataToAdd);
            dataToAdd = [];
          }
        }
        //@ts-ignore
        tableBody.unshift(tableHeader);
        var pdfContent = {
          content: [
            {
              text: 'Ronde du : ', 
              style: 'header',
              alignment: 'center',
              fontSize: 18,
              bold: true
            },
            {
              table: {
                widths: ['31%', '23%','23%','23%'],
                body: tableBody
              }
            }
          ]
        };
        //@ts-ignore
        pdfMake.createPdf(pdfContent).download('repriseRonde.pdf');
          
    })

    

  }
}