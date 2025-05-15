import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { depassement } from "src/models/depassement.model";
import { depassementsService } from "../services/depassements.service";
import { format } from "date-fns";
import { DepassementsComponent } from "../depassements/depassements.component";
import { MatDialog } from "@angular/material/dialog";
import { PopupService } from "../services/popup.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-list-depassements",
  templateUrl: "./list-depassements.component.html",
  styleUrl: "./list-depassements.component.scss",
})
export class ListDepassementsComponent implements OnInit {
  @ViewChild("myTotauxDialog") totauxDialog = {} as TemplateRef<any>;
  public listeDepassements: depassement[] = [];
  public dateFin = "";
  public dateDeb = "";
  public sumDepassements: {
    ligne: string;
    choixDepassements: string;
    totalDuree: number;
  }[] = [];
  public numbers: number[] = [];
  public nbfour = 0;
  public dialogRef = {};

  constructor(
    private depassementsService: depassementsService,
    private dialog: MatDialog,
    private PopupSerivce: PopupService
  ) {}

  ngOnInit(): void {
    this.getDepassements();
  }

  ouvrirDialogTotaux() {
    this.dialogRef = this.dialog.open(this.totauxDialog, {
      width: "40%",
      height: "60%",
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.ngOnInit();
    });
  }

  getTotaux() {
    this.sumDepassements = [];
    const sumsMap = new Map<
      string,
      { ligne: string; choixDepassements: string; totalDuree: number }
    >();

    // Ensemble pour suivre les périodes déjà comptabilisées
    const processedPeriods = new Set<string>();

    // Trier les dépassements pour assurer un traitement cohérent
    const sortedDepassements = [...this.listeDepassements].sort(
      (a, b) =>
        a.date_heure_debut.localeCompare(b.date_heure_debut) ||
        a.date_heure_fin.localeCompare(b.date_heure_fin)
    );

    sortedDepassements.forEach((dep) => {
      // Créer une clé unique pour la période (date_début + date_fin)
      const periodKey = `${dep.date_heure_debut}|${dep.date_heure_fin}|${dep.ligne}|${dep.choixDepassements}`;

      // Si cette période exacte a déjà été traitée, on l'ignore
      if (processedPeriods.has(periodKey)) {
        return; // Skip this iteration
      }

      // Marquer cette période comme traitée
      processedPeriods.add(periodKey);

      // Créer une clé unique combinant ligne et choixDepassements
      const key = `${dep.ligne}|${dep.choixDepassements}`;

      // Calculer la durée du dépassement en minutes
      const duration = this.calculateDuration(
        dep.date_heure_debut,
        dep.date_heure_fin
      );

      // Ajouter à la somme existante ou créer une nouvelle entrée
      if (sumsMap.has(key)) {
        sumsMap.get(key)!.totalDuree += duration;
      } else {
        sumsMap.set(key, {
          ligne: dep.ligne,
          choixDepassements: dep.choixDepassements,
          totalDuree: duration,
        });
      }
    });
    this.sumDepassements = Array.from(sumsMap.values());
  }

  calculateDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    return diffMs > 0 ? diffMs / 3600000 : 0; // convertir ms en heures
  }

  getDepassements() {
    this.depassementsService
      .getDepassements()
      .subscribe((response: depassement[]) => {
        this.listeDepassements = response;
        this.listeDepassements.sort(
          (a, b) =>
            a.ligne.localeCompare(b.ligne) ||
            a.choixDepassements.localeCompare(b.choixDepassements) ||
            a.date_heure_debut.localeCompare(b.date_heure_debut)
        );
        this.getTotaux();
      });
  }

  setPeriode(periode = "custom") {
    if (periode === "lastMonth") {
      const now = new Date();
      this.dateDeb = format(
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
        "yyyy-MM-dd"
      );
      this.dateFin = format(
        new Date(now.getFullYear(), now.getMonth(), 0),
        "yyyy-MM-dd"
      );
    } else if (periode === "currentMonth") {
      this.dateDeb = format(new Date(new Date().setDate(1)), "yyyy-MM-dd");
      this.dateFin = format(
        new Date(new Date().setMonth(new Date().getMonth() + 1, 1)),
        "yyyy-MM-dd"
      );
    }
    if (this.dateDeb !== "" && this.dateFin !== "") {
      this.depassementsService
        .getDepassementsByDate(this.dateDeb, this.dateFin)
        .subscribe((response: depassement[]) => {
          this.listeDepassements = response;
          this.listeDepassements.sort(
            (a, b) =>
              a.ligne.localeCompare(b.ligne) ||
              a.choixDepassements.localeCompare(b.choixDepassements) ||
              a.date_heure_debut.localeCompare(b.date_heure_debut)
          );
          this.getTotaux();
        });
    } else {
      this.getDepassements();
    }
  }

  calculerDuree(depassement: depassement): string {
    const dateDebut = new Date(depassement.date_heure_debut);
    const dateFin = new Date(depassement.date_heure_fin);
    const duree = Math.abs(dateFin.getTime() - dateDebut.getTime()) / 1000;
    const heures = Math.floor(duree / 3600);
    const minutes = Math.floor((duree % 3600) / 60);
    return `${heures}h ${minutes}m`;
  }

  openModal(depassement: depassement) {
    this.dialog
      .open(DepassementsComponent, {
        data: depassement,
      })
      .afterClosed()
      .subscribe(() => {
        this.setPeriode();
      });
  }

  deleteDepassement(id: number) {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.depassementsService.deleteDepassement(id).subscribe((response) => {
          this.PopupSerivce.alertSuccessForm(response);
          this.setPeriode();
        });
      }
    });
  }
}
