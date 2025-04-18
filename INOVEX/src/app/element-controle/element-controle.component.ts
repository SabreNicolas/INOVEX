import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { rondierService } from "../services/rondier.service";
import { zone } from "../../models/zone.model";
import { ActivatedRoute, Router } from "@angular/router";
import { element } from "../../models/element.model";
import { groupement } from "src/models/groupement.model";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-element-controle",
  templateUrl: "./element-controle.component.html",
  styleUrls: ["./element-controle.component.scss"],
})
export class ElementControleComponent implements OnInit {
  public listZone: zone[];
  public nom: string;
  public zoneId: number[];
  public listElement: element[];
  public ordreElem: number;
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

  constructor(
    private rondierService: rondierService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.listZone = [];
    this.nom = "";
    this.zoneId = [];
    this.listElement = [];
    this.ordreElem = 99;
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
    //Récupération de l'id de l'élément pour modification
    this.route.queryParams.subscribe((params) => {
      if (params.element != undefined) {
        this.elementId = params.element;
      } else {
        this.elementId = 0;
      }
    });
  }

  ngOnInit(): void {
    this.checkboxRegulateur = document.getElementsByName(
      "regulateur",
    )[0] as HTMLInputElement;
    this.checkboxCompteur = document.getElementsByName(
      "compteur",
    )[0] as HTMLInputElement;
    this.rondierService.listZone().subscribe((response) => {
      // @ts-expect-error data
      this.listZone = response.data;
      //Récupération des données de l'élément si update
      if (this.elementId > 0) {
        this.rondierService
          .getOneElement(this.elementId)
          .subscribe((response) => {
            // @ts-expect-error data
            this.element = response.data[0];
            this.nom = this.element.nom;
            this.zoneId[0] = this.element.zoneId;
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
            this.getElements();
            this.ordreElem = this.element.ordre - 1;
            this.changeType(null);
            //Gestion du mode regulateur
            if (this.isRegulateur == 1) {
              this.checkboxRegulateur.checked = true;
            }
            //Gestion du type compteur
            if (this.isCompteur == 1) {
              this.checkboxCompteur.checked = true;
            }
            //Gestion de la zone
            const selectZone = document.getElementById(
              "zone",
            ) as HTMLSelectElement;
            for (let i = 0; i < selectZone.options.length; i++) {
              if (
                "'" + this.zoneId[0].toString() + "'" ===
                selectZone.options[i].value.split(": ")[1]
              ) {
                selectZone.options[i].selected = true;
              }
            }
            //Gestion de la pastille info sup
            if (this.element.infoSup.length > 0) {
              this.infoSup = true;
              this.infoSupValue = this.element.infoSup;
            }
          });
      }
    });
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
  getElements() {
    this.rondierService
      .listElementofZone(this.zoneId[0])
      .subscribe((response) => {
        // @ts-expect-error data
        this.listElement = response.data;
      });
  }

  getGroupement() {
    this.idGroupement = 0;
    if (this.zoneId.length == 1) {
      this.rondierService
        .getGroupements(this.zoneId[0])
        .subscribe((response) => {
          // @ts-expect-error data
          this.listGroupements = response.data;
          if (this.listGroupements.length < 1) {
            this.idGroupement = 0;
          }
        });
    }
  }

  //Création éléments contrôle
  onSubmit(form: NgForm) {
    this.nom = form.value["nom"].replace(/'/g, "''");
    this.zoneId = form.value["zone"];
    if (this.zoneId.length < 2) {
      this.ordreElem = form.value["ordreElem"];
    }
    if (form.value["unit"].length > 0) {
      this.unit = form.value["unit"].replace(/'/g, "''");
    }
    if (form.value["valeurDef"].length > 0) {
      this.defaultValue = form.value["valeurDef"]
        .replace(",", ".")
        .replace(/'/g, "''");
    }
    if (this.needListValues) {
      this.listValues = form.value["listValues"].replace(/'/g, "''");
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
      this.router.navigate(["/elements"]);
    } else {
      this.zoneId.forEach((zoneId) => {
        this.rondierService
          .updateOrdreElement(zoneId, this.ordreElem)
          .subscribe((response) => {
            if (response == "Mise à jour des ordres OK") {
              this.rondierService
                .createElement(
                  zoneId,
                  this.nom,
                  this.valeurMin,
                  this.valeurMax,
                  this.typeChamp,
                  this.unit,
                  this.defaultValue,
                  this.isRegulateur,
                  this.listValues,
                  this.isCompteur,
                  Number(this.ordreElem) + 1,
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
                    this.router.navigate(["/admin/elements"]);
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
      });

      this.resetFields(form);
    }
  }

  //Mise à jour de l'element
  update() {
    //Permet de ne pas mettre à jour les ordres si on ne change pas la position dans la zone
    if (this.element.ordre != this.ordreElem + 1) {
      this.rondierService
        .updateOrdreElement(this.zoneId[0], this.ordreElem)
        .subscribe((response) => {
          if (response == "Mise à jour des ordres OK") {
            this.updateElement(Number(this.ordreElem) + 1);
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
        this.zoneId[0],
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
          this.router.navigate(["/admin/elements"]);
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la mise à jour de l'élément de contrôle ....",
          );
        }
      });
  }

  //TODO : reset le formulaire après saisie => pb si reset et pas de saisie alors erreur (si saisie OK)
  resetFields(form: NgForm) {
    this.isRegulateur = 0;
    this.zoneId = [];
    form.value["zone"] = null;
    //form.reset();
    const four = document.getElementsByName("four");
    const regulateur = document.getElementsByName("regulateur");
    (four[0] as HTMLInputElement).checked = false;
    (regulateur[0] as HTMLInputElement).checked = false;
  }
}
