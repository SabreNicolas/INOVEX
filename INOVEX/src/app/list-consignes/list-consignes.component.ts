import { rondierService } from "../services/rondier.service";
import { consigne } from "../../models/consigne.model";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DatePipe, Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Actualite } from "src/models/actualite.model";
import { cahierQuartService } from "../services/cahierQuart.service";
import { PopupService } from "../services/popup.service";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-list-consignes",
  templateUrl: "./list-consignes.component.html",
  styleUrls: ["./list-consignes.component.scss"],
})
export class ListConsignesComponent implements OnInit {
  @ViewChild("myCreateConsigneDialog") createConsigneDialog =
    {} as TemplateRef<any>;

  public listConsignes: any[];
  public dialogRef = {};
  public idConsigne: number;
  fileToUpload: File | undefined;
  public imgSrc!: any;
  public stringDateFin: string | null;
  public stringDateDebut: string | null;
  public titre: string;
  public desc: string;
  public type: number;
  public dateDebut: Date | undefined;
  public dateFin: Date | undefined;
  public categories: string[];

  constructor(
    private rondierService: rondierService,
    private datePipe: DatePipe,
    private formbuilder: FormBuilder,
    private dialog: MatDialog,
    public cahierQuartService: cahierQuartService,
    private popupService: PopupService,
  ) {
    this.listConsignes = [];
    this.idConsigne = 0;
    this.stringDateFin = "";
    this.stringDateDebut = "";
    this.desc = "";
    this.titre = "";
    this.type = 1;
    this.stringDateFin = "";
    this.stringDateDebut = "";
    this.idConsigne = 0;
    this.categories = ["Actives", "Archivées"];
  }

  ngOnInit(): void {
    this.fileToUpload = undefined;
    this.imgSrc = undefined;
    this.rondierService.listAllConsignes().subscribe((response) => {
      // @ts-expect-error data
      this.listConsignes = response.data;
    });
    this.idConsigne = 0;
    this.stringDateFin = "";
    this.stringDateDebut = "";
    this.desc = "";
    this.titre = "";
    this.type = 1;
    this.stringDateFin = "";
    this.stringDateDebut = "";
    this.idConsigne = 0;
    this.dateDebut = undefined;
    this.dateFin = undefined;
  }

  //suppression d'une consigne
  deleteConsigne(id: number) {
    this.rondierService.deleteConsigne(id).subscribe((response) => {
      if (response == "Suppression de la consigne OK") {
        this.cahierQuartService
          .historiqueConsigneDelete(id)
          .subscribe((response) => {
            this.popupService.alertSuccessForm(
              "La consigne a bien été supprimé !",
            );
            this.ngOnInit();
          });
      } else {
        this.popupService.alertErrorForm(
          "Erreur lors de la suppression de la consigne....",
        );
      }
    });
    this.ngOnInit();
  }

  downloadFile(consigne: string) {
    window.open(consigne, "_blank");
  }

  ouvrirDialogCreerConsigne() {
    this.dialogRef = this.dialog.open(this.createConsigneDialog, {
      width: "40%",
      disableClose: true,
      autoFocus: true,
    });
    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
      this.idConsigne = 0;
    });
  }

  saveFile(event: Event) {
    //Récupération du fichier dans l'input
    // @ts-expect-error data
    this.fileToUpload = (event.target as HTMLInputElement).files[0];
    //console.log((<HTMLInputElement>event.target).files[0]);

    // @ts-expect-error data
    if (event.target.value) {
      // @ts-expect-error data
      const file = event.target.files[0];
      this.fileToUpload = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.imgSrc = reader.result);
      reader.readAsDataURL(file);
    } else this.popupService.alertErrorForm("Aucun fichier choisi....");
  }

  ouvrirDialogModifConsigne(id: number, dupliquer: number) {
    this.idConsigne = id;
    this.dialogRef = this.dialog.open(this.createConsigneDialog, {
      width: "40%",
      disableClose: true,
      autoFocus: true,
    });
    this.cahierQuartService
      .getOneConsigne(this.idConsigne)
      .subscribe((response) => {
        this.cahierQuartService
          .getOneConsigne(this.idConsigne)
          .subscribe((response) => {
            this.titre = response.data[0]["titre"];
            this.dateDebut = response.data[0]["date_heure_debut"];
            this.desc = response.data[0]["commentaire"];
            this.type = response.data[0]["type"];
            if (response.data[0]["date_heure_fin"] != "2099-01-01 00:00") {
              this.dateFin = response.data[0]["date_heure_fin"];
            }
            if (dupliquer == 1) {
              this.idConsigne = 0;
            }
          });

        if (dupliquer == 1) {
          this.idConsigne = 0;
        }
      });

    this.dialog.afterAllClosed.subscribe((response) => {
      this.ngOnInit();
      this.idConsigne = 0;
    });
  }

  createConsigne(form: NgForm) {
    this.desc = form.value["desc"];
    this.desc = this.desc.replace("'", "''");

    if (this.dateFin == undefined) {
      this.dateFin = new Date("2099-01-01 00:00");
      this.stringDateFin = "2099-01-01 00:00";
    } else {
      this.dateFin = new Date(form.value["dateFin"]);
    }
    this.dateDebut = new Date(form.value["dateDebut"]);
    this.stringDateFin = this.datePipe.transform(
      this.dateFin,
      "yyyy-MM-dd HH:mm",
    );
    this.stringDateDebut = this.datePipe.transform(
      this.dateDebut,
      "yyyy-MM-dd HH:mm",
    );
    this.type = form.value["type"];

    if (this.titre == "") {
      this.popupService.alertErrorForm("Veuillez renseigner un titre !");
      return;
    }

    if (this.dateDebut != undefined && this.dateDebut > this.dateFin) {
      this.popupService.alertErrorForm(
        "La date de début et la date de fin ne correspondent pas !",
      );
    } else {
      if (this.idConsigne > 0) {
        this.rondierService
          .updateConsigne(
            this.titre,
            this.desc,
            this.type,
            this.stringDateFin,
            this.stringDateDebut,
            this.idConsigne,
          )
          .subscribe((response) => {
            if (response == "Modification de la consigne OK") {
              this.cahierQuartService
                .historiqueConsigneUpdate(this.idConsigne)
                .subscribe((response) => {
                  this.popupService.alertSuccessForm(
                    "La consigne a bien été modifiée !",
                  );
                  this.ngOnInit();
                  this.dialog.closeAll();
                });
            } else {
              this.popupService.alertErrorForm(
                "Erreur lors de la création de la consigne ....",
              );
            }
          });
      } else {
        this.rondierService
          .createConsigne(
            this.titre,
            this.desc,
            this.type,
            this.stringDateFin,
            this.stringDateDebut,
            //@ts-expect-error data
            this.fileToUpload,
          )
          .subscribe((response) => {
            if (response != undefined) {
              this.idConsigne = response["data"][0]["Id"];
              this.cahierQuartService
                .historiqueConsigneCreate(this.idConsigne)
                .subscribe((response) => {
                  this.popupService.alertSuccessForm(
                    "La consigne a bien été créé !",
                  );
                  this.ngOnInit();
                  this.dialog.closeAll();
                });
            } else {
              this.popupService.alertErrorForm(
                "Erreur lors de la création de la consigne ....",
              );
            }
          });
        this.resetFields(form);
      }
    }
  }

  resetFields(form: NgForm) {
    form.controls["desc"].reset();
    form.controls["dateFin"].reset();
    // form.controls['type'].reset();
    form.controls["dateDebut"].reset();
  }

  getDates(startDate: Date, stopDate: Date) {
    const dateArray = [];
    while (startDate <= stopDate) {
      dateArray.push(startDate.toLocaleDateString());
      startDate.setDate(startDate.getDate() + 1);
    }
    return dateArray;
  }

  isDateInRange(dateDebut: string, dateFin: string): boolean {
    const now = new Date();
    const startDate = this.parseCustomDate(dateDebut);
    const endDate = this.parseCustomDate(dateFin);

    return now <= endDate;
  }

  parseCustomDate(dateStr: string): Date {
    // Exemple pour le format "DD/MM/YYYY HH:mm:ss"
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
}
