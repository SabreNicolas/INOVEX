import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { zone } from "../../models/zone.model";
import { rondierService } from "../services/rondier.service";
import { element } from "../../models/element.model";
import { PopupService } from "../services/popup.service";
import { groupement } from "src/models/groupement.model";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
declare let $: any;

@Component({
  selector: "app-list-elements",
  templateUrl: "./list-elements.component.html",
  styleUrls: ["./list-elements.component.scss"],
})
export class ListElementsComponent implements OnInit {
  @ViewChild("myCreateElementDialog") createElementDialog =
    {} as TemplateRef<any>;

  public listZone: zone[];
  public zoneId: number;
  public listElements: element[];
  public nom: string;
  public zoneIdSelect: number;
  public listElement: element[];
  public ordre: number;
  public valeurMin: number;
  public valeurMax: number;
  public typeChamp: number;
  public unit: string;
  public defaultValue: number;
  private isRegulateur: number; //1 pour oui et 0 pour non
  private isCompteur: number; //1 pour oui et 0 pour non
  public listValues: string;
  public needListValues: boolean;
  public needBornes: boolean;
  public elementId: number;
  // @ts-expect-error data
  public element: element;
  // @ts-expect-error data
  public checkboxRegulateur: HTMLInputElement;
  // @ts-expect-error data
  public checkboxCompteur: HTMLInputElement;
  public listGroupements: groupement[];
  public idGroupement: number;
  public codeEquipement: string;
  public infoSup: boolean;
  public infoSupValue: string;
  public dialogRef = {};

  constructor(
    private rondierService: rondierService,
    private dialog: MatDialog,
    private popupService: PopupService,
  ) {
    this.listZone = [];
    this.zoneId = 0;
    this.listElements = [];
    this.nom = "";
    this.zoneIdSelect = 0;
    this.listElement = [];
    this.ordre = 99;
    this.valeurMin = 0;
    this.valeurMax = 0;
    this.typeChamp = 2;
    this.unit = "_";
    this.defaultValue = 0;
    this.isRegulateur = 0;
    this.isCompteur = 0;
    this.needListValues = false;
    this.needBornes = false;
    this.listValues = "";
    this.elementId = 0;
    this.listGroupements = [];
    this.idGroupement = 0;
    this.codeEquipement = "";
    this.infoSup = false;
    this.infoSupValue = "";
  }

  ngOnInit(): void {
    this.rondierService.listZone().subscribe((response) => {
      // @ts-expect-error data
      this.listZone = response.data;
      //this.zoneId = this.listZone[0].Id
      this.setListElementsOfZone();
    });
  }

  ouvrirDialogCreerElement() {
    this.dialogRef = this.dialog.open(this.createElementDialog, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
    });
  }

  ouvrirDialogUpdateElement(id: number) {
    this.elementId = id;
    this.dialogRef = this.dialog.open(this.createElementDialog, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
    });
    this.rondierService.getOneElement(this.elementId).subscribe((response) => {
      // @ts-expect-error data
      this.element = response.data[0];
      this.nom = this.element.nom;
      //this.zoneIdSelect[0] = this.element.zoneId;
      this.zoneIdSelect = this.element.zoneId;
      this.getGroupement();
      this.valeurMin = this.element.valeurMin;
      this.valeurMax = this.element.valeurMax;
      this.typeChamp = this.element.typeChamp;
      this.unit = this.element.unit;
      this.defaultValue = this.element.defaultValue;
      this.isRegulateur = this.element.isRegulateur;
      this.isCompteur = this.element.isCompteur;
      this.listValues = this.element.listValues;
      this.codeEquipement = this.element.CodeEquipement;
      this.idGroupement = this.element.idGroupement;
      if (this.idGroupement == null) {
        this.idGroupement = 0;
      }

      this.getElements(this.element.ordre - 1);

      this.changeType(null);
      //Gestion du mode regulateur
      if (this.isRegulateur == 1) {
        this.checkboxRegulateur = document.getElementsByName(
          "regulateur",
        )[0] as HTMLInputElement;
        this.checkboxRegulateur.checked = true;
      }
      //Gestion du type compteur
      if (this.isCompteur == 1) {
        this.checkboxCompteur = document.getElementsByName(
          "compteur",
        )[0] as HTMLInputElement;
        this.checkboxCompteur.checked = true;
      }
      //Gestion de la pastille info sup
      if (this.element.infoSup.length > 0) {
        this.infoSup = true;
        this.infoSupValue = this.element.infoSup;
      }
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
    });
  }

  setListElementsOfZone() {
    this.rondierService.listElementofZone(this.zoneId).subscribe((response) => {
      // @ts-expect-error data
      this.listElements = response.data;
    });
  }

  setFilters() {
    /* Début prise en compte des filtres*/
    const zoneElt = document.getElementById("zone");
    // @ts-expect-error data
    const zoneSel = zoneElt.options[zoneElt.selectedIndex].value;
    this.zoneId = zoneSel;
    /*Fin de prise en commpte des filtres */
    this.setListElementsOfZone();
  }

  //suppression d'un element de controle
  deleteElement(id: number) {
    Swal.fire({
      title: "Voulez-vous supprimer cet élément de ronde ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.rondierService.deleteElement(id).subscribe((response) => {
          if (response == "Suppression de l'élément OK") {
            this.popupService.alertSuccessForm(
              "L'élément de contrôle a bien été supprimé !",
            );
          } else {
            this.popupService.alertSuccessForm(
              "Erreur lors de la suppression de l'élément de contrôle....",
            );
          }
        });
        this.ngOnInit();
      } else {
        this.popupService.alertErrorForm("Annulation de la suppression");
      }
    });
  }

  getPreviousItem(index: number) {
    if (index > 0) {
      return this.listElements[index - 1]["idGroupement"];
    }
    return 0;
  }

  //permet de savoir si il est nécessaire ou non d'afficher le champ de list des valeurs possibles
  changeType(form: NgForm | null) {
    if (form != null) {
      this.typeChamp = form.value["champ"];
    }
    // @ts-expect-error data
    //si menu de sélection ou case à cocher on affiche le champ de list valeurs possibles
    if (this.typeChamp === "3" || this.typeChamp === "4") {
      this.needListValues = true;
    } else {
      this.needListValues = false;
      this.listValues = "";
    }

    // @ts-expect-error data
    //si cursur on affiche les valeurs min et max
    if (this.typeChamp === "1") {
      this.needBornes = true;
    } else {
      this.needBornes = false;
      this.valeurMin = 0;
      this.valeurMax = 0;
    }
  }

  //Récupération des éléments de la zone par ordre
  getElements(ordre: number) {
    this.rondierService
      .listElementofZone(this.zoneIdSelect)
      .subscribe((response) => {
        // @ts-expect-error data
        this.listElement = response.data;
        //Si on est en update de l'element => on update l'ordre
        if (ordre != 0) {
          this.ordre = ordre;
        }
      });
  }

  getGroupement() {
    this.idGroupement = 0;
    this.rondierService
      .getGroupements(this.zoneIdSelect)
      .subscribe((response) => {
        // @ts-expect-error data
        this.listGroupements = response.data;
        if (this.listGroupements.length < 1) {
          this.idGroupement = 0;
        }

        this.getElements(0);
      });
  }

  //Création éléments contrôle
  onSubmit(form: NgForm) {
    this.checkboxRegulateur = document.getElementsByName(
      "regulateur",
    )[0] as HTMLInputElement;
    this.checkboxCompteur = document.getElementsByName(
      "compteur",
    )[0] as HTMLInputElement;
    this.nom = form.value["nom"].replace(/'/g, "''");
    this.zoneIdSelect = form.value["zone"];
    this.ordre = form.value["ordreElem"];
    if (form.value["unit"].length > 0) {
      this.unit = form.value["unit"].replace(/'/g, "''");
    }
    if (form.value["valeurDef"].length > 0) {
      this.defaultValue = form.value["valeurDef"]
        .replace(",", ".")
        .replace(/'/g, "''");
    }
    if (this.needListValues) {
      //Pour éviter les soucis d'affichage les cases à cocher peuvent être 3 au max
      this.listValues = form.value["listValues"].replace(/'/g, "''");
      if (this.typeChamp == 3) {
        if (this.listValues.split(" ").length > 3) {
          this.popupService.alertErrorForm(
            "Les cases à cocher peuvent contenir 3 choix au maximum ! Merci d'utiliser un menu de sélection",
          );
          return;
        }
      }
    }
    if (this.needBornes) {
      if (form.value["valeurMin"].length > 0) {
        this.valeurMin = form.value["valeurMin"]
          .replace(",", ".")
          .replace(" ", "")
          .replace(/'/g, "''");
      }
      if (form.value["valeurMax"].length > 0) {
        this.valeurMax = form.value["valeurMax"]
          .replace(",", ".")
          .replace(" ", "")
          .replace(/'/g, "''");
      }
    }
    //Gestion des boolean
    if (this.checkboxRegulateur.checked) {
      this.isRegulateur = 1;
    } else this.isRegulateur = 0;
    if (this.checkboxCompteur.checked) {
      this.isCompteur = 1;
    } else this.isCompteur = 0;
    //Si la case est coché pour la pastille on insère la valeur
    if (this.infoSup) {
      this.infoSupValue = form.value["infoSupValue"].replace(/'/g, "''");
    }
    //Sinon on envoi une chaine vide
    else {
      this.infoSupValue = "";
    }
    //FIN Gestion des boolean
    this.codeEquipement = this.codeEquipement.replace(/'/g, "''");
    if (this.elementId > 0) {
      this.update();
    } else {
      this.rondierService
        .updateOrdreElement(this.zoneIdSelect, this.ordre)
        .subscribe((response) => {
          if (response == "Mise à jour des ordres OK") {
            this.rondierService
              .createElement(
                this.zoneIdSelect,
                this.nom,
                this.valeurMin,
                this.valeurMax,
                this.typeChamp,
                this.unit,
                this.defaultValue,
                this.isRegulateur,
                this.listValues,
                this.isCompteur,
                Number(this.ordre) + 1,
                this.idGroupement,
                this.codeEquipement,
                this.infoSupValue,
              )
              .subscribe((response) => {
                if (response == "Création de l'élément OK") {
                  this.idGroupement = 0;
                  this.codeEquipement = "";
                  this.nom = "";
                  this.popupService.alertSuccessForm(
                    "L'élément de contrôle a bien été créé !",
                  );
                  this.dialog.closeAll();
                  this.resetFields();
                } else {
                  this.popupService.alertErrorForm(
                    "Erreur lors de la création de l'élément de contrôle ....",
                  );
                }
              });
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la création de l'élément de contrôle ....",
            );
          }
        });
    }
  }

  //Mise à jour de l'element
  update() {
    //Permet de ne pas mettre à jour les ordres si on ne change pas la position dans la zone
    if (this.element.ordre != this.ordre + 1) {
      this.rondierService
        .updateOrdreElement(this.zoneIdSelect, this.ordre)
        .subscribe((response) => {
          if (response == "Mise à jour des ordres OK") {
            this.updateElement(Number(this.ordre) + 1);
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la création de l'élément de contrôle ....",
            );
          }
        });
    } else {
      this.updateElement(this.element.ordre);
    }
  }

  updateElement(ordre: number) {
    this.rondierService
      .updateElement(
        this.elementId,
        this.zoneIdSelect,
        this.nom,
        this.valeurMin,
        this.valeurMax,
        this.typeChamp,
        this.unit,
        this.defaultValue,
        this.isRegulateur,
        this.listValues,
        this.isCompteur,
        ordre,
        this.idGroupement,
        this.codeEquipement,
        this.infoSupValue,
      )
      .subscribe((response) => {
        if (response == "Mise à jour de l'element OK") {
          this.popupService.alertSuccessForm(
            "L'élément de contrôle a bien été mis à jour !",
          );
          this.dialog.closeAll();
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la mise à jour de l'élément de contrôle ....",
          );
        }
      });
  }

  resetFields() {
    this.listZone = [];
    this.zoneId = 0;
    this.listElements = [];
    this.nom = "";
    this.zoneIdSelect = 0;
    this.listElement = [];
    this.ordre = 1;
    this.valeurMin = 0;
    this.valeurMax = 0;
    this.typeChamp = 2;
    this.unit = "_";
    this.defaultValue = 0;
    this.isRegulateur = 0;
    this.isCompteur = 0;
    this.needListValues = false;
    this.needBornes = false;
    this.listValues = "";
    this.elementId = 0;
    this.listGroupements = [];
    this.idGroupement = 0;
    this.codeEquipement = "";
    this.infoSup = false;
    this.infoSupValue = "";
  }
}
