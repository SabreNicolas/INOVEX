import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { zone } from "../../models/zone.model";
import { rondierService } from "../services/rondier.service";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-mode-operatoire",
  templateUrl: "./mode-operatoire.component.html",
  styleUrls: ["./mode-operatoire.component.scss"],
})
export class ModeOperatoireComponent implements OnInit {
  public listZone: zone[];
  fileToUpload: File | undefined;
  private nom: string;
  private zoneId: number;

  constructor(
    private rondierService: rondierService,
    private popupService: PopupService,
  ) {
    this.listZone = [];
    this.nom = "";
    this.zoneId = 0;
  }

  ngOnInit(): void {
    this.rondierService.listZone().subscribe((response) => {
      // @ts-ignore
      this.listZone = response.data;
    });
  }

  //Création mode opératoire
  onSubmit(form: NgForm) {
    this.nom = form.value["nom"].replace(/'/g, "''");
    this.zoneId = form.value["zone"];
    this.rondierService
      .createModeOP(this.nom, this.fileToUpload, this.zoneId)
      .subscribe((response) => {
        if (response == "Création du modeOP OK") {
          this.popupService.alertSuccessForm(
            "Le mode opératoire a bien été créé !",
          );
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la création du mode opératoire ....",
          );
        }
      });

    this.resetFields(form);
  }

  /*DEBUT INSERTION FICHIER*/

  //Method déclenché dès que le fichier sélectionné change
  //Stockage du fichier chaque fois qu'un fichier est upload
  saveFile(event: Event) {
    //Récupération du fichier dans l'input
    // @ts-ignore
    this.fileToUpload = (<HTMLInputElement>event.target).files[0];
    // @ts-ignore
    //console.log((<HTMLInputElement>event.target).files[0]);

    // @ts-ignore
    if (event.target.value) {
      // @ts-ignore
      const file = event.target.files[0];
      this.fileToUpload = file;
    } else this.popupService.alertErrorForm("Aucun fichier choisi....");
  }

  /*FIN INSERTION FICHIER*/

  resetFields(form: NgForm) {
    form.controls["nom"].reset();
    form.value["nom"] = "";
    form.controls["zone"].reset();
    form.value["zone"] = "";
  }
}
