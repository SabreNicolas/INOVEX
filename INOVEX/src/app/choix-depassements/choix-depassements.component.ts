import { Component, OnInit } from "@angular/core";
import { depassementsService } from "../services/depassements.service";
import {
  choixDepassement,
  choixDepassementProduit,
  depassementProduit,
} from "../../models/depassement.model";
import { PopupService } from "../services/popup.service";
@Component({
  selector: "app-choix-depassements",
  templateUrl: "./choix-depassements.component.html",
  styleUrls: ["./choix-depassements.component.scss"],
})
export class ChoixDepassementsComponent implements OnInit {
  choixDepassements: choixDepassement[] = [];
  choixDepassementsProduits: choixDepassementProduit[] = [];
  depassementsProduitsAssocies: depassementProduit[] = [];

  // Variables pour les nouveaux choix de dépassements et produits
  newDepassement = "";
  newProduit = "";
  selectedDepassement: number | null = null;
  selectedDepassementProduit: number | null = null;
  selectedDepassementFiltre: number | null = null;

  constructor(
    private depassementsService: depassementsService,
    private PopupSerivce: PopupService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Charger les données des choix de dépassements et produits
  loadData() {
    this.depassementsService
      .getChoixDepassements()
      .subscribe((data: choixDepassement[]) => {
        this.choixDepassements = data;
      });
    this.depassementsService
      .getchoixDepassementsProduits()
      .subscribe((data: choixDepassementProduit[]) => {
        this.choixDepassementsProduits = data;
      });
    this.depassementsService
      .getDepassementsProduits()
      .subscribe((data: depassementProduit[]) => {
        this.depassementsProduitsAssocies = data;
      });
  }

  // Ajouter un choix de dépassement
  addDepassement() {
    if (this.newDepassement.trim()) {
      this.depassementsService
        .createChoixDepassement(this.newDepassement)
        .subscribe({
          next: (response) => {
            this.newDepassement = "";
            this.PopupSerivce.alertSuccessForm(response);
            this.loadData();
          },
          error: (error: Error) => {
            this.PopupSerivce.alertErrorForm(
              (error as unknown as { error: string }).error || error.message,
            );
          },
        });
    }
  }

  // Ajouter un produit
  addProduit() {
    if (this.newProduit.trim()) {
      this.depassementsService
        .createChoixDepassementProduit(this.newProduit)
        .subscribe({
          next: (response) => {
            this.newProduit = "";
            this.PopupSerivce.alertSuccessForm(response);
            this.loadData();
          },
          error: (error: Error) => {
            console.error(error);
            this.PopupSerivce.alertErrorForm(
              (error as unknown as { error: string }).error || error.message,
            );
          },
        });
    }
  }

  // Supprimer un choix de dépassement
  removeDepassement(id: number) {
    this.depassementsService
      .deleteChoixDepassement(id)
      .subscribe((response) => {
        this.PopupSerivce.alertSuccessForm(response);
        this.loadData();
      });
  }

  // Supprimer un produit
  removeProduit(id: number) {
    this.depassementsService
      .deleteChoixDepassementProduit(id)
      .subscribe((response) => {
        this.PopupSerivce.alertSuccessForm(response);
        this.loadData();
      });
  }

  // Associer un produit au choix de dépassement sélectionné
  addAssociation() {
    if (this.selectedDepassement && this.selectedDepassementProduit) {
      this.depassementsService
        .createDepassementProduit(
          this.selectedDepassement as number,
          this.selectedDepassementProduit as number,
        )
        .subscribe({
          next: (response: string) => {
            this.PopupSerivce.alertSuccessForm(response);
            this.selectedDepassement = null;
            this.selectedDepassementProduit = null;
            this.loadData();
          },
          error: (error: Error) => {
            this.PopupSerivce.alertErrorForm(
              (error as unknown as { error: string }).error || error.message,
            );
          },
        });
    }
  }

  // Supprimer une association entre un produit et un choix de dépassement
  removeAssociation(associationId: number) {
    this.depassementsService
      .deleteDepassementProduit(associationId)
      .subscribe((response) => {
        this.loadData();
        this.PopupSerivce.alertSuccessForm(response);
      });
  }

  getDepassementName(id: number): string {
    const depassement = this.choixDepassements.find((d) => d.id === id);
    return depassement ? depassement.nom : "Nom non trouvé";
  }

  getProduitName(id: number): string {
    const produit = this.choixDepassementsProduits.find((p) => p.id === id);
    return produit ? produit.nom : "Nom non trouvé";
  }

  getFilteredAssociations() {
    if (!this.selectedDepassementFiltre) {
      return this.depassementsProduitsAssocies;
    }

    return this.depassementsProduitsAssocies.filter(
      (association) =>
        association.idChoixDepassements === this.selectedDepassementFiltre,
    );
  }
}
