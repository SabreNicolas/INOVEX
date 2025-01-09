import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { rondierService } from "../services/rondier.service";
import { groupement } from "../../models/groupement.model";
import Swal from "sweetalert2";
import { PopupService } from "../services/popup.service";
import { zone } from "src/models/zone.model";
import { user } from "src/models/user.model";
import { idUsineService } from "../services/idUsine.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-list-groupements",
  templateUrl: "./list-groupements.component.html",
  styleUrls: ["./list-groupements.component.scss"],
})
export class ListGroupementsComponent implements OnInit {
  @ViewChild("myCreateGroupementDialog") createGroupementDialog =
    {} as TemplateRef<any>;

  public listGroupement: any[];
  public listZone: zone[];
  public idZone: number;
  public groupement: string;
  public idGroupement: number;
  public denomination: string;
  public userLogged!: user;
  public idUsine: number;
  public dialogRef = {};

  constructor(
    public rondierService: rondierService,
    private dialog: MatDialog,
    private popupService: PopupService,
    private idUsineService: idUsineService,
  ) {
    this.listGroupement = [];
    this.listZone = [];
    this.idZone = 0;
    this.groupement = "";
    this.idGroupement = 0;
    this.denomination = "";
    this.idUsine = 0;
  }

  ngOnInit(): void {
    this.rondierService.getAllGroupements().subscribe((response) => {
      //@ts-expect-error data
      this.listGroupement = response.data;
      this.listGroupement.forEach((groupement) => {
        //On va compter le nombre d'élément de controle par groupement pour autoriser la suppression si il y en a pas
        this.rondierService
          .getElementsGroupement(groupement.id)
          .subscribe((response) => {
            groupement.nbElement = response;
          });
      });
    });

    //On récupère toutes les zones de l'usine
    this.rondierService.listZone().subscribe((response) => {
      // @ts-expect-error data
      this.listZone = response.data;
    });

    this.idUsine = this.idUsineService.getIdUsine();
    if (this.idUsine == 7) {
      this.denomination = "Ronde";
    } else this.denomination = "Zone";
  }

  getPreviousItem(index: number) {
    if (index > 0) {
      return this.listGroupement[index - 1]["zoneId"];
    }
    return 0;
  }

  deleteGroupement(idGroupement: number) {
    Swal.fire({
      title: "Êtes-vous sûr(e) de vouloir supprimer ce groupement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.rondierService
          .deleteGroupement(idGroupement)
          .subscribe((response) => {
            this.popupService.alertSuccessForm(
              "La suprression a été effectuée.",
            );
            this.ngOnInit();
          });
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La suprression a été annulée.");
      }
    });
  }

  createGroupement() {
    //Si mode modif
    if (this.idGroupement > 0) {
      this.updateGroupement();
    }
    //Sinon on créer un groupement
    else {
      //Si le champs d'entrée est vide
      if (this.groupement != "") {
        //Si aucune zone n'est sélectionnée
        if (this.idZone != 0) {
          Swal.fire({
            title: "Êtes-vous sûr(e) de créer ce Groupement ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, créer",
            cancelButtonText: "Annuler",
          }).then((result) => {
            if (result.isConfirmed) {
              this.groupement = this.groupement.replace(/'/g, "''");
              this.rondierService
                .createGroupement(this.idZone, this.groupement)
                .subscribe((response) => {
                  this.popupService.alertSuccessForm("Nouveau groupement créé");
                  this.groupement = "";
                  this.idZone = 0;
                  this.dialog.closeAll();
                });
            } else {
              // Pop-up d'annulation de la suppression
              this.popupService.alertErrorForm("La création a été annulée.");
            }
          });
        } else {
          this.popupService.alertErrorForm(
            "Veuillez choisir une zone pour le groupement ! La saisie a été annulée.",
          );
        }
      } else {
        this.popupService.alertErrorForm(
          "Veuillez entrer le nom du groupement ! La saisie a été annulée.",
        );
      }
    }
  }

  updateGroupement() {
    //Si le champs d'entrée est vides
    if (this.groupement != "") {
      //Si aucune zone n'est sélectionnée
      if (this.idZone != 0) {
        Swal.fire({
          title: "Êtes-vous sûr(e) de modifier ce Groupement ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Oui, modifier",
          cancelButtonText: "Annuler",
        }).then((result) => {
          if (result.isConfirmed) {
            this.groupement = this.groupement.replace(/'/g, "''");
            this.rondierService
              .updateGroupement(this.idGroupement, this.groupement, this.idZone)
              .subscribe((response) => {
                this.popupService.alertSuccessForm("Groupement modifié !");
                this.groupement = "";
                this.idZone = 0;
                this.dialog.closeAll();
              });
          } else {
            // Pop-up d'annulation de la suppression
            this.popupService.alertErrorForm("La modification a été annulée.");
          }
        });
      } else {
        this.popupService.alertErrorForm(
          "Veuillez choisir une zone pour le groupement ! La saisie a été annulée.",
        );
      }
    } else {
      this.popupService.alertSuccessForm(
        "Veuillez entrer le nom du groupement ! La saisie a été annulée.",
      );
    }
  }

  cancel() {
    this.groupement = "";
    this.idGroupement = 0;
    this.idZone = 0;
    this.dialog.closeAll();
  }

  ouvrirDialogCreerGroupement() {
    this.dialogRef = this.dialog.open(this.createGroupementDialog, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
    });
  }

  ouvrirDialogUpdateGroupement(id: number) {
    this.idGroupement = id;
    this.dialogRef = this.dialog.open(this.createGroupementDialog, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
    });
    this.rondierService.getOneGroupement(id).subscribe((response) => {
      // @ts-expect-error data
      this.groupement = response.data[0]["groupement"];
      // @ts-expect-error data
      this.idZone = response.data[0]["zoneId"];
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
    });
  }
}
