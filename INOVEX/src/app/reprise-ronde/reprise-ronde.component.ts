import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { rondierService } from "../services/rondier.service";
import { CommonModule } from '@angular/common';
import {
  format,
} from "date-fns";
import { PopupService } from "../services/popup.service";
import { RepriseRonde, NameValuePair, ResultatsFormulaires } from "src/models/repriseRonde.model";


@Component({
  standalone: true,
  selector: 'app-reprise-ronde',
  templateUrl: './reprise-ronde.component.html',
  styleUrl: './reprise-ronde.component.scss',
  imports: [CommonModule] // <-- c’est ici
})


export class RepriseRondeComponent implements OnInit {
  public id : number;
  public repriseRonde : any;
  public date = '';
  public quart  = 0;
  public zones : any[] = [];
  
  public resultatsFormulaires: ResultatsFormulaires = {
    values: [] // Initialisation de la clé "values" avec un tableau vide
  };
  
  valeursCurseur: { [elementId: number]: number } = {};

  constructor(private rondierService: rondierService, private route: ActivatedRoute, private router: Router,     private popupService: PopupService,
  ) { 
    this.id = 0;

    this.route.queryParams.subscribe((params) => {
      if (params.id != undefined) {
        this.id = params.id;
      } else {
        this.id = 0;
      }
    });
  }

  ngOnInit(): void {
    this.rondierService.getOneRepriseRonde(this.id).subscribe((ronde) => {
      // @ts-ignore
      this.repriseRonde = ronde["data"][0];
      console.log(this.repriseRonde);

      let heure = '00';
      if (this.repriseRonde.quart === 1) {
        heure = '05';
      } else if (this.repriseRonde.quart === 2) {
        heure = '13';
      } else if (this.repriseRonde.quart === 3) {
        heure = '21';
      }
      this.date = this.repriseRonde.date
      this.quart = this.repriseRonde.quart;
      this.repriseRonde.date = format(this.repriseRonde.date,'yyyy-dd-MM');
      this.repriseRonde.date = this.repriseRonde.date + ' ' + heure + ':00:00';
      console.log(this.repriseRonde.date);
      this.rondierService.getZonesCalendrierRonde(this.repriseRonde.date).subscribe((zones) => {
        // @ts-ignore
        this.zones = zones.BadgeAndElementsOfZone
        console.log(this.zones);

        const valuesArray: { nameValuePairs: NameValuePair }[] = []; // Initialisation de valuesArray
        // Initialisation de resultatsFormulaires avec tous les éléments des zones
        this.zones.forEach(zone => {
          zone.elements.forEach((element: any) => {
            // Créer l'objet nameValuePairs avec les valeurs de l'élément
            const nameValuePairs = {
              value: element.previousValue ? element.previousValue : element.defaultValue, // Utilisation de previousValue ou defaultValue
              modeRegulateur: element.isRegulateur ? 'activé' : 'désactivé', // Mode régulateur, converti en chaîne 'activé' ou 'désactivé'
              elementId: element.Id,  // ID de l'élément
              rondeId: this.repriseRonde.Id // ID de la ronde
            };
        
            // Ajouter l'élément dans valuesArray
            const updatedValue = {
              nameValuePairs: nameValuePairs // Structure demandée avec nameValuePairs
            };
        
            valuesArray.push(updatedValue); // Ajoute l'élément à la liste
          });
        });
        
        // Encadrer le tableau resultatsFormulaires avec la clé "values"
        this.resultatsFormulaires = {
          values: valuesArray
        };

        console.log('Valeurs des formulaires :', this.resultatsFormulaires); // Affiche les valeurs des formulaires dans la console
      });
    });
  }

 // Fonction pour mettre à jour la valeur
 mettreAJourValeur(rondeId: number, elementId: number, target: any, isRegulateur: boolean) {
  const value = (target as HTMLInputElement).value; // Récupérer la valeur de l'input
  console.log('Valeur entrée :', value); // Affiche la valeur entrée dans la console
  this.valeursCurseur[elementId] = Number(value);

   // Cherche si l'élément avec le même elementId existe déjà dans la liste
   const existingElement = this.resultatsFormulaires.values.find(item => item.nameValuePairs.elementId === elementId);
   console.log('Élément existant :', existingElement); // Affiche l'élément existant dans la console
   if (existingElement) {
     // Si l'élément existe déjà, on met à jour sa valeur
     existingElement.nameValuePairs.value = value;
     existingElement.nameValuePairs.modeRegulateur = isRegulateur ? 'activé' : 'désactivé';
   } else {
     // Sinon, on ajoute un nouvel élément à la liste
     const updatedValue = {
       nameValuePairs: {
         value: value,
         modeRegulateur: isRegulateur ? 'activé' : 'désactivé',
         elementId: elementId,
          rondeId: rondeId // Ajout de rondeId
       }
     };
     this.resultatsFormulaires.values.push(updatedValue);
   }

  // Affiche les résultats mis à jour
  console.log('Résultats des formulaires :', this.resultatsFormulaires); 
}
  
envoyerDonnees(){
  console.log('Données à envoyer :', this.resultatsFormulaires); // Affiche les données à envoyer
  this.rondierService.postRonde(this.date, this.quart).subscribe((response) => {
    console.log(response); // Affiche la réponse du serveur
    const rondeId = response.data[0]["Id"];  // Adapter cette ligne à la structure de ta réponse

    this.resultatsFormulaires.values.forEach(item => {
      // Ajouter ou mettre à jour le champ rondeId dans chaque nameValuePairs
      item.nameValuePairs.rondeId = rondeId;
    });

    this.rondierService.postMesuresRondier(this.resultatsFormulaires).subscribe((response) => {
      console.log('Réponse du serveur :', response); // Affiche la réponse du serveur
      this.rondierService.closeRonde(rondeId).subscribe((response) => {
        console.log('Ronde fermée :', response); // Affiche la réponse du serveur
        this.rondierService.deleteRepriseRonde(this.id).subscribe((response) => {
          console.log('Ronde supprimée :', response); // Affiche la réponse du serveur
          this.popupService.alertSuccessForm('Ronde reprise avec succès !');
          this.router.navigate(['/reporting']);
        });
      });
    });
  });
}
}

