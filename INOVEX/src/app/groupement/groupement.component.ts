import { Component, OnInit } from "@angular/core";
import { rondierService } from "../services/rondier.service";
import { groupement } from "src/models/groupement.model";
import { zone } from "src/models/zone.model";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";
import { user } from "src/models/user.model";
import { idUsineService } from "../services/idUsine.service";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-groupement",
  templateUrl: "./groupement.component.html",
  styleUrls: ["./groupement.component.scss"],
})
export class GroupementComponent implements OnInit {
  public listGroupement: groupement[];
  public listZone: zone[];
  public idZone: number;
  public groupement: string;
  public idGroupement: number;
  public denomination: string;
  public userLogged!: user;
  public idUsine: number;

  constructor(
    public rondierService: rondierService,
    private route: ActivatedRoute,
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

    this.route.queryParams.subscribe((params) => {
      if (params.idGroupement != undefined) {
        this.idGroupement = params.idGroupement;
      } else {
        this.idGroupement = 0;
      }
    });
  }

  ngOnInit(): void {
    //On récupère toutes les zones de l'usine
    this.rondierService.listZone().subscribe((response) => {
      // @ts-ignore
      this.listZone = response.data;
    });

    //Si on est en mode modification on rempli les champs
    if (this.idGroupement > 0) {
      this.rondierService
        .getOneGroupement(this.idGroupement)
        .subscribe((response) => {
          // @ts-ignore
          this.groupement = response.data[0]["groupement"];
          // @ts-ignore
          this.idZone = response.data[0]["zoneId"];
        });
    }

    this.idUsine = this.idUsineService.getIdUsine();
    if (this.idUsine == 7) {
      this.denomination = "Ronde";
    } else this.denomination = "Zone";
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
                window.location.replace("/admin/groupement");
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
}
