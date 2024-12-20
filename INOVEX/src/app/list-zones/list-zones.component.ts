import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { rondierService } from "../services/rondier.service";
import { zone } from "../../models/zone.model";
import Swal from "sweetalert2";
import { PopupService } from "../services/popup.service";
import { user } from "src/models/user.model";
import { idUsineService } from "../services/idUsine.service";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-list-zones",
  templateUrl: "./list-zones.component.html",
  styleUrls: ["./list-zones.component.scss"],
})
export class ListZonesComponent implements OnInit {
  @ViewChild("myCreateZoneDialog") createZoneDialog = {} as TemplateRef<any>;

  public listZone: zone[];
  private nom: string;
  private commentaire: string;
  private nbfour: number;
  public numbers: number[];
  private four: number;
  public denomination: string;
  public userLogged!: user;
  private idUsine: number;
  public dialogRef = {};

  constructor(
    private rondierService: rondierService,
    private dialog: MatDialog,
    private popupService: PopupService,
    private idUsineService: idUsineService,
  ) {
    this.listZone = [];
    this.nom = "";
    this.commentaire = "";
    this.nbfour = 0;
    //contient des chiffres pour l'itération des fours
    this.numbers = [];
    this.four = 0;
    this.denomination = "";
    this.idUsine = 0;
  }

  ngOnInit(): void {
    this.rondierService.listZone().subscribe((response) => {
      // @ts-ignore
      this.listZone = response.data;
    });

    //Récupération du nombre de four du site
    this.rondierService.nbLigne().subscribe((response) => {
      //@ts-ignore
      this.nbfour = response.data[0].nbLigne;
      this.numbers = Array(this.nbfour)
        .fill(1)
        .map((x, i) => i + 1);
    });

    this.idUsine = this.idUsineService.getIdUsine();
    if (this.idUsine == 7) {
      this.denomination = "Ronde";
    } else this.denomination = "Zone de contrôle";
  }

  //création de la zone de controle
  onSubmit(form: NgForm) {
    this.nom = form.value["nom"].replace(/'/g, "''");
    //On affecte la valeur si le four est coché
    if (form.controls["four"].touched) {
      this.four = form.value["four"];
    }
    //Sinon 0 pour commun
    else this.four = 0;
    //Gestion commentaire
    if (form.value["commentaire"].length < 1) {
      this.commentaire = "_";
    } else this.commentaire = form.value["commentaire"].replace(/'/g, "''");

    this.rondierService
      .createZone(this.nom, this.commentaire, this.four)
      .subscribe((response) => {
        if (response == "Création de la zone OK") {
          this.popupService.alertSuccessForm(
            "La zone de contrôle a bien été créé !",
          );
          this.dialog.closeAll();
        } else {
          this.popupService.alertSuccessForm(
            "Erreur lors de la création de la zone de contrôle ....",
          );
        }
      });

    this.resetFields(form);
  }

  ouvrirDialogCreerZone() {
    this.dialogRef = this.dialog.open(this.createZoneDialog, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
    });
  }

  resetFields(form: NgForm) {
    form.controls["nom"].reset();
    form.value["nom"] = "";
    //form.controls['commentaire'].reset();
    form.value["commentaire"] = "_";
    form.controls["four"].reset();
    form.value["four"] = 0;
  }

  resetFourZone(form: NgForm) {
    form.controls["four"].reset();
  }

  //mis à jour du commentaire d'une zone
  setComment(zone: zone) {
    let commentaire = prompt(
      "Veuillez saisir un Commentaire",
      String(zone.commentaire),
    );
    //@ts-ignore
    if (commentaire.length < 1) commentaire = "_";
    if (commentaire != null) {
      // @ts-ignore
      this.rondierService
        .updateCommentaire(zone.Id, commentaire)
        .subscribe((response) => {
          if (response == "Mise à jour du commentaire OK") {
            this.popupService.alertSuccessForm(
              "Le Commentaire a été mis à jour !",
            );
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la mise à jour du Commentaire ....",
            );
          }
        });
      this.ngOnInit();
    }
  }

  //mis à jour du nom d'une zone
  setName(zone: zone) {
    const nom = prompt("Veuillez saisir un Nom", String(zone.nom));
    if (nom != null) {
      // @ts-ignore
      this.rondierService.updateNomZone(zone.Id, nom).subscribe((response) => {
        if (response == "Mise à jour du nom OK") {
          this.popupService.alertSuccessForm("Le Nom a été mis à jour !");
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la mise à jour du Nom ....",
          );
        }
      });
      this.ngOnInit();
    }
  }

  //mis à jour du num de four d'une zone
  setFour(zone: zone) {
    Swal.fire({
      title: "Veuillez saisir un numéro de four",
      input: "number",
      inputValue: zone.four,
      inputAttributes: {
        min: "0",
        max: "4",
        step: "1",
      },
      showCancelButton: true,
      confirmButtonText: "Valider",
      confirmButtonColor: "green",
      cancelButtonText: "Annuler",
      cancelButtonColor: "red",
      allowOutsideClick: true,
    }).then((result) => {
      if (result.value != undefined) {
        this.rondierService
          .updateNumZone(zone.Id, result.value)
          .subscribe((response) => {
            if (response == "Mise à jour du four OK") {
              this.popupService.alertSuccessForm(
                "Le numéro de four a été mis à jour !",
              );
            } else {
              this.popupService.alertErrorForm(
                "Erreur lors de la mise à jour du numéro de four ....",
              );
            }
          });
        this.ngOnInit();
      }
    });
  }

  deleteZone(id: number) {
    Swal.fire({
      title:
        "Êtes-vous sûr(e) de vouloir supprimer cette zone et tout ses éléments ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.rondierService.deleteZone(id).subscribe((response) => {
          if (response == "Suppression OK") {
            this.popupService.alertSuccessForm("La zone a été supprimée !");
            this.ngOnInit();
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de Suppression .... Un Badge est peut-être affecté à cette zone ! Veuillez d'abord retirer l'affectation",
            );
          }
        });
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertSuccessForm("La suprression a été annulée.");
      }
    });
  }
}
