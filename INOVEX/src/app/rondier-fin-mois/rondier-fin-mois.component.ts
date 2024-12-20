import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { element } from "../../models/element.model";
import { rondierService } from "../services/rondier.service";
import { productsService } from "../services/products.service";
import { product } from "../../models/products.model";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-rondier-fin-mois",
  templateUrl: "./rondier-fin-mois.component.html",
  styleUrls: ["./rondier-fin-mois.component.scss"],
})
export class RondierFinMoisComponent implements OnInit {
  public listCompteursRondier: element[];
  public listCompteurs: product[];
  public listDays: string[];

  constructor(
    private productsService: productsService,
    private popupService: PopupService,
    private rondierService: rondierService,
  ) {
    this.listDays = [];
    this.listCompteursRondier = [];
    this.listCompteurs = [];
  }

  ngOnInit(): void {
    //Récupération compteurs Rondier
    this.rondierService.listElementCompteur().subscribe((response) => {
      // @ts-ignore
      this.listCompteursRondier = response.data;
      //Récupération compteurs INOVEX
      this.productsService.getCompteurs("", "").subscribe((response) => {
        // @ts-ignore
        this.listCompteurs = response.data;
        this.getValues();
      });
    });
  }

  setPeriod(form: NgForm) {
    this.listDays = [];
    const date = new Date(form.value["dateDeb"]);
    const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = date.getFullYear();
    const dd = String(new Date(yyyy, date.getMonth() + 1, 0).getDate()).padStart(
      2,
      "0",
    );
    this.listDays.push(dd + "/" + mm + "/" + yyyy);
    this.getValues();
  }

  //changer les dates pour saisir le mois précédent
  setLastMonth(form: NgForm) {
    const date = new Date();
    let mm: string;
    let yyyy: number;
    if (date.getMonth() === 0) {
      mm = "12";
      yyyy = date.getFullYear() - 1;
    } else {
      mm = String(date.getMonth()).padStart(2, "0"); //January is 0!
      yyyy = date.getFullYear();
    }

    const Lastday = yyyy + "-" + mm;
    (document.getElementById("dateDeb") as HTMLInputElement).value = Lastday;
    form.value["dateDeb"] = Lastday;
    this.setPeriod(form);
  }

  //récupérer les valeurs en BDD
  getValues() {
    this.listCompteursRondier.forEach((cp) => {
      this.listDays.forEach((day) => {
        this.rondierService
          .valueElementDay(cp.Id, day)
          .subscribe((response) => {
            if (response.data[0] != undefined && response.data[0].value != 0) {
              (document.getElementById(cp.Id + "-" + day) as HTMLInputElement).value = response.data[0].value;
            } else
              (document.getElementById(cp.Id + "-" + day) as HTMLInputElement).value = "";
          });
      });
    });
  }

  //valider les saisies
  validation() {
    this.listCompteursRondier.forEach((cp) => {
      this.listDays.forEach((day) => {
        this.listCompteurs.forEach((compteur) => {
          //On insère dans la table saisieMenseulle de INOVEX uniquement si les noms correspondent
          if (cp.nom.toLowerCase() === compteur.Name.toLowerCase()) {
            const value = (document.getElementById(cp.Id + "-" + day) as HTMLInputElement).value.replace(",", ".");
            const valueInt: number = +value;
            if (valueInt > 0.0) {
              this.productsService
                .createMeasure(
                  day.substr(6, 4) +
                    "-" +
                    day.substr(3, 2) +
                    "-" +
                    day.substr(0, 2),
                  valueInt,
                  compteur.Code,
                )
                .subscribe((response) => {
                  if (response == "Création du saisiemensuelle OK") {
                    this.popupService.alertSuccessForm(
                      "Les valeurs ont été insérées avec succès !",
                    );
                  } else {
                    this.popupService.alertErrorForm(
                      "Erreur lors de l'insertion des valeurs ....",
                    );
                  }
                });
            }
          }
        });
      });
    });
  }

  //mettre à 0 la value pour modificiation
  delete(Id: number, date: string) {
    /*this.productsService.createMeasure(date.substr(6,4)+'-'+date.substr(3,2)+'-'+date.substr(0,2),0,Code).subscribe((response)=>{
      if (response == "Création du saisiemensuelle OK"){
        Swal.fire("La valeur a bien été supprimé !");
        (<HTMLInputElement>document.getElementById(Code + '-' + date)).value = '';
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la suppression de la valeur ....',
        })
      }
    });*/
    alert("delete");
  }
}
