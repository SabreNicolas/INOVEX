import { Component, Inject, OnInit, Optional } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { PopupService } from "../services/popup.service";
import {
  depassement,
  choixDepassement,
  choixDepassementProduit,
  depassementProduit,
  nbLignesUsine,
} from "src/models/depassement.model";
import { depassementsService } from "../services/depassements.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-depassements",
  templateUrl: "./depassements.component.html",
  styleUrl: "./depassements.component.scss",
})
export class DepassementsComponent implements OnInit {
  public choixDepassementsTable: choixDepassement[] = [];
  public choixDepassementsProduitsTable: choixDepassementProduit[] = [];
  public choixDepassementsProduitsFilteredTable: choixDepassementProduit[] = [];
  public depassementsProduitsTable: depassementProduit[] = [];
  public depassement: depassement = {
    id: 0,
    choixDepassements: "",
    choixDepassementsProduits: "",
    ligne: "",
    date_heure_debut: "",
    date_heure_fin: "",
    causes: "",
    concentration: "",
    idUsine: undefined,
  };
  public listeLignes: string[] = [];
  public edition = false;

  constructor(
    @Optional() public dialogRef: MatDialogRef<DepassementsComponent>,
    private popupService: PopupService,
    private depassementsService: depassementsService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: depassement,
  ) {
    if (this.data) {
      this.edition = true;
      this.depassement = this.data;
      this.depassement.date_heure_debut =
        this.datePipe.transform(
          this.depassement.date_heure_debut,
          "yyyy-MM-ddTHH:mm:ss",
        ) || "";
      this.depassement.date_heure_fin =
        this.datePipe.transform(
          this.depassement.date_heure_fin,
          "yyyy-MM-ddTHH:mm:ss",
        ) || "";
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.depassementsService
      .getChoixDepassements()
      .subscribe((data: choixDepassement[]) => {
        this.choixDepassementsTable = data;
      });
    this.depassementsService
      .getchoixDepassementsProduits()
      .subscribe((data: choixDepassementProduit[]) => {
        this.choixDepassementsProduitsTable = data;
        this.choixDepassementsProduitsFilteredTable = data;
      });
    this.depassementsService
      .getDepassementsProduits()
      .subscribe((data: depassementProduit[]) => {
        this.depassementsProduitsTable = data;
      });
    this.depassementsService
      .getNbLignesUsine()
      .subscribe((data: nbLignesUsine) => {
        for (let i = 0; i < data.data[0]?.nbLigne; i++) {
          this.listeLignes.push("Ligne " + (i + 1).toString());
        }
        this.depassement.ligne = this.listeLignes[0];
      });
  }

  getFilteredAssociations() {
    if (!this.depassement.choixDepassements) {
      return this.choixDepassementsProduitsFilteredTable;
    }

    const selectedDepassement = this.choixDepassementsTable.find(
      (dep) => dep.nom === this.depassement.choixDepassements,
    );

    const associations = this.depassementsProduitsTable.filter(
      (association) =>
        association.idChoixDepassements === selectedDepassement?.id,
    );

    return this.choixDepassementsProduitsTable.filter((produit) =>
      associations.some(
        (association) => association.idChoixDepassementsProduits === produit.id,
      ),
    );
  }

  setPeriode(minutes: number) {
    if (
      this.depassement.date_heure_debut != undefined &&
      this.depassement.date_heure_debut != ""
    ) {
      const transformedDate = this.datePipe.transform(
        new Date(
          new Date(this.depassement.date_heure_debut).getTime() +
            minutes * 60000,
        ),
        "yyyy-MM-ddTHH:mm:ss",
      );
      this.depassement.date_heure_fin = transformedDate ? transformedDate : "";
    } else {
      this.popupService.alertErrorForm(
        "Veuillez d'abord choisir une date de début.",
      );
    }
  }

  validDepassement() {
    return (
      this.depassement.choixDepassements != "" &&
      this.depassement.choixDepassementsProduits != "" &&
      this.depassement.ligne != "" &&
      this.depassement.date_heure_debut != "" &&
      this.depassement.date_heure_fin != "" &&
      this.depassement.date_heure_debut <= this.depassement.date_heure_fin &&
      this.depassement.concentration != ""
    );
  }

  ajouterDepassement() {
    if (this.validDepassement()) {
      if (this.edition) {
        this.depassementsService
          .updateDepassement(this.depassement)
          .subscribe((response: string) => {
            this.popupService.alertSuccessForm(response);
            this.dialogRef.close(response);
            this.router.navigate(["/saisie/listDepassements"]);
          });
      } else {
        this.depassementsService.createDepassement(this.depassement).subscribe(
          (response: string) => {
            this.popupService.alertSuccessForm(response);
            this.router.navigate(["/saisie/listDepassements"]);
          },
          () => {
            this.popupService.alertErrorForm(
              "Erreur lors de l'ajout du depassement.",
            );
          },
        );
      }
    } else {
      this.popupService.alertErrorForm("Veuillez remplir tous les champs.");
    }
  }
}
