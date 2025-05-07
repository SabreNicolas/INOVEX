import { Component, OnInit } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';

interface GroupedOccurrence {
  nomZone: string;
  date_heure_fin: string;
  finReccurrence: string;
  quart: number;
  count: number;
  isAction: boolean;
  type: string;
  periodicityType?: string;
}

@Component({
  selector: 'app-list-occurences',
  templateUrl: './list-occurences.component.html',
  styleUrls: ['./list-occurences.component.scss']
})
export class ListOccurencesComponent implements OnInit {
  public listOccurences: GroupedOccurrence[] = [];
  private originalList: GroupedOccurrence[] = [];
  private sortHistory: {column: string, direction: 'asc' | 'desc'}[] = [];

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchText: string = '';
  filterDateDebut: string = '';
  filterDateFin: string = '';
  sortState: {[key: string]: 'asc' | 'desc' | null} = {};
  hideExpiredOccurrences: boolean = false;
  hideCurrentOccurrences: boolean = false;


  constructor(private cahierQuartService: cahierQuartService) {}

  ngOnInit() {
    this.loadOccurences();
  }

  loadOccurences() {
    // Charger et grouper les zones
    this.cahierQuartService.getAllZonesCalendrier().subscribe(response => {
      const groupedZones = this.cahierQuartService.groupAndCountOccurrences(
        response.data.map((zone: any) => ({
          ...zone,
          nomZone: zone.nom,
          finReccurrence: zone.finReccurrence || zone.date_heure_fin, // Ajout de cette ligne
          isAction: false,
          type: 'Zone'
        }))
      );
  
      // Charger et grouper les actions
      this.cahierQuartService.getAllActionsCalendrier().subscribe(response => {
        const groupedActions = this.cahierQuartService.groupAndCountOccurrences(
          response.data.map((action: any) => ({
            ...action,
            nomZone: action.nom,
            finReccurrence: action.finReccurrence || action.date_heure_fin, // Ajout de cette ligne
            quart: this.getQuartFromHour(action.date_heure_debut),
            isAction: true,
            type: 'Action'
          }))
        );
  
        // Combiner et trier par nomZone par défaut
        this.listOccurences = [...groupedZones, ...groupedActions].sort((a, b) => 
          a.nomZone.localeCompare(b.nomZone)
        );
        this.originalList = [...this.listOccurences];
      });
    });
  }

  getQuartFromHour(dateTime: string): number {
    const hour = dateTime.split('T')[1].split(':')[0];
    if (hour === '05') return 1; // Matin
    if (hour === '13') return 2; // Après-midi
    return 3; // Nuit
  }

  getQuartLibelle(quart: number): string {
    switch(quart) {
      case 1: return 'Matin';
      case 2: return 'Après-midi';
      case 3: return 'Nuit'; 
      default: return '';
    }
  }

  sortData(column: string) {
    // Si la colonne est déjà dans l'historique, inverser sa direction
    const existingSort = this.sortHistory.find(sort => sort.column === column);
    if (existingSort) {
      existingSort.direction = existingSort.direction === 'asc' ? 'desc' : 'asc';
      // Déplacer cette colonne au début de l'historique
      this.sortHistory = [
        existingSort,
        ...this.sortHistory.filter(sort => sort.column !== column)
      ];
    } else {
      // Ajouter la nouvelle colonne au début
      this.sortHistory.unshift({
        column: column,
        direction: 'asc'
      });
    }
  
    // Trier les données en appliquant tous les critères de tri
    this.listOccurences.sort((a, b) => {
      // Parcourir tous les critères de tri dans l'ordre
      for (const sortCriteria of this.sortHistory) {
        let comparison = 0;
  
        switch (sortCriteria.column) {
          case 'type':
            comparison = this.compareValues(a.type, b.type);
            break;
  
          case 'nomZone':
            comparison = this.compareValues(a.nomZone, b.nomZone);
            break;
  
          case 'quart':
            comparison = this.compareValues(a.quart || 0, b.quart || 0);
            break;
  
          case 'finReccurrence':
            const dateA = new Date(a.finReccurrence || a.date_heure_fin);
            const dateB = new Date(b.finReccurrence || b.date_heure_fin);
            comparison = dateA.getTime() - dateB.getTime();
            break;
  
          case 'count':
            comparison = this.compareValues(a.count || 0, b.count || 0);
            break;
        }
  
        // Si on trouve une différence, appliquer la direction et retourner le résultat
        if (comparison !== 0) {
          return sortCriteria.direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  
    // Mettre à jour l'état visuel du tri
    this.sortState[column] = this.sortHistory.find(sort => sort.column === column)?.direction || null;
  }
  
  // Méthode utilitaire pour comparer deux valeurs de manière sécurisée
  private compareValues(a: any, b: any): number {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  filterByPeriod() {
    if (!this.filterDateFin) {
      this.listOccurences = [...this.originalList];
      return;
    }
  
    const endDate = new Date(this.filterDateFin);
  
    this.listOccurences = this.originalList.filter(occ => {
      const occDate = new Date(occ.finReccurrence || occ.date_heure_fin);
      return occDate <= endDate;
    });
  }

  filterByText() {
    if (!this.searchText && !this.filterDateFin) {
      this.listOccurences = [...this.originalList];
      return;
    }

    this.listOccurences = this.originalList.filter(occ => {
      let matchesText = true;
      let matchesDate = true;

      // Filtre par texte
      if (this.searchText) {
        matchesText = occ.nomZone.toLowerCase().includes(this.searchText.toLowerCase());
      }

      // Filtre par date de fin
      if (this.filterDateFin) {
        const endDate = new Date(this.filterDateFin);
        const occDate = new Date(occ.date_heure_fin);
        matchesDate = occDate <= endDate;
      }

      return matchesText && matchesDate;
    });
  }

  filterOccurrences() {
    let filteredList = [...this.originalList]; 
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Filtrer par texte si présent
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filteredList = filteredList.filter(occ => 
        occ.nomZone.toLowerCase().includes(searchLower)
      );
    }
  
    // Filtrer par période si les dates sont présentes
    if (this.filterDateDebut || this.filterDateFin) {
      const startDate = this.filterDateDebut ? new Date(this.filterDateDebut) : new Date(0);
      const endDate = this.filterDateFin ? new Date(this.filterDateFin) : new Date('9999-12-31');
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
  
      filteredList = filteredList.filter(occ => {
        const occDate = new Date(occ.finReccurrence || occ.date_heure_fin);
        return occDate >= startDate && occDate <= endDate;
      });
    }
  
    // Filtrer les occurrences en cours si la case est cochée
    if (this.hideCurrentOccurrences) {
      filteredList = filteredList.filter(occ => {
        const occDate = new Date(occ.finReccurrence || occ.date_heure_fin);
        return occDate <= today;
      });
    }
  
    // Filtrer les occurrences expirées si la case est cochée
    if (this.hideExpiredOccurrences) {
      filteredList = filteredList.filter(occ => {
        const occDate = new Date(occ.finReccurrence || occ.date_heure_fin);
        return occDate >= today;
      });
    }
  
    this.listOccurences = [...filteredList];
  
    // Réappliquer le tri si une colonne est triée
    if (this.sortColumn) {
      this.sortData(this.sortColumn);
    }
  }

  toggleExpiredOccurrences() {
    this.hideExpiredOccurrences = !this.hideExpiredOccurrences;
    this.filterOccurrences();
  }

  resetFilters() {
    this.searchText = '';
    this.filterDateDebut = '';
    this.filterDateFin = '';
    this.hideExpiredOccurrences = false;
    this.hideCurrentOccurrences = false;
    this.sortState = {};
    this.listOccurences = [...this.originalList];
  }
  resetSorts() {
    this.sortHistory = [];
    this.sortState = {};
    this.loadOccurences();
  }
}