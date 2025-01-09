import { Component, ViewChild, OnInit, TemplateRef } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { MatDialog } from "@angular/material/dialog";
import { PopupService } from "../services/popup.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-list-actions-enregistrees",
  templateUrl: "./list-actions-enregistrees.component.html",
  styleUrl: "./list-actions-enregistrees.component.scss",
})
export class ListActionsEnregistreesComponent implements OnInit {
  @ViewChild("myCreateActionDialog") createActionDialog =
    {} as TemplateRef<any>;

  public listActions: any[];
  public nom: string;
  public idAction: number;
  public dialogRef = {};

  constructor(
    public cahierQuartService: cahierQuartService,
    private dialog: MatDialog,
    private popupService: PopupService,
  ) {
    this.listActions = [];
    this.nom = "";
    this.idAction = 0;
  }

  ngOnInit(): void {
    this.nom = "";
    this.idAction = 0;
    this.cahierQuartService.getActionsEnregistrement().subscribe((response) => {
      //@ts-expect-error data
      this.listActions = response.data;
    });
  }

  ouvrirDialogCreerAction() {
    this.dialogRef = this.dialog.open(this.createActionDialog, {
      width: "40%",
      height: "40%",
      disableClose: true,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
      this.idAction = 0;
    });
  }

  createAction() {
    console.log("ici");
    if (this.idAction != 0) {
      this.cahierQuartService
        .updateActionEnregistrement(this.idAction, this.nom)
        .subscribe((response) => {
          this.ngOnInit();
          if (response == "Update action enregistrement ok") {
            this.popupService.alertSuccessForm("Action modifiée");
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la modification de l'action",
            );
          }
          this.dialog.closeAll();
        });
    } else {
      this.cahierQuartService
        .createActionEnregistrement(this.nom)
        .subscribe((response) => {
          this.ngOnInit();
          if (response == "create action enregistrement ok") {
            this.popupService.alertSuccessForm("Action enregistrée");
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la création de l'action",
            );
          }
          this.dialog.closeAll();
        });
    }
  }

  ouvrirDialogUpdateAction(idAction: number, nom: string) {
    this.nom = nom;
    this.idAction = idAction;
    this.dialogRef = this.dialog.open(this.createActionDialog, {
      width: "80%",
      height: "80%",
      disableClose: true,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
      this.idAction = 0;
    });
  }

  deleteAction(idAction: number) {
    Swal.fire({
      title: "Etes vous sûr de vouloir supprimer cette action ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cahierQuartService
          .deletaActionEnregistrement(idAction)
          .subscribe((response) => {
            if (response == "Suppression de l'action enregistrée OK") {
              this.popupService.alertSuccessForm(
                "L'action a bien été supprimé !",
              );
            } else {
              this.popupService.alertErrorForm(
                "Erreur lors de la suppression de l'action....",
              );
            }
            this.ngOnInit();
          });
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La suppression a été annulée.");
      }
    });
  }
}
