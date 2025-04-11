import { Component, OnInit } from "@angular/core";
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
  public listeDepassements: depassement[] = [];
  public dateFin = "";
  public dateDeb = "";

  constructor(
    private depassementsService: depassementsService,
    private dialog: MatDialog,
    private PopupSerivce: PopupService,
  ) {}

  ngOnInit(): void {
    this.getDepassements();
  }

  getDepassements() {
    this.depassementsService
      .getDepassements()
      .subscribe((response: depassement[]) => {
        this.listeDepassements = response;
      });
  }

  setPeriode(periode = "custom") {
    if (periode === "lastMonth") {
      const now = new Date();
      this.dateDeb = format(
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
        "yyyy-MM-dd",
      );
      this.dateFin = format(
        new Date(now.getFullYear(), now.getMonth(), 0),
        "yyyy-MM-dd",
      );
    } else if (periode === "currentMonth") {
      this.dateDeb = format(new Date(new Date().setDate(1)), "yyyy-MM-dd");
      this.dateFin = format(
        new Date(new Date().setMonth(new Date().getMonth() + 1, 1)),
        "yyyy-MM-dd",
      );
    }
    if (this.dateDeb !== "" && this.dateFin !== "") {
      this.depassementsService
        .getDepassementsByDate(this.dateDeb, this.dateFin)
        .subscribe((response: depassement[]) => {
          this.listeDepassements = response;
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
        width: "90%",
        height: "90%",
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
