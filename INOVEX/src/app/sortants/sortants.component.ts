import { Component, OnInit } from "@angular/core";
import { category } from "../../models/categories.model";
import { NgForm } from "@angular/forms";
import { productsService } from "../services/products.service";
import { categoriesService } from "../services/categories.service";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-sortants",
  templateUrl: "./sortants.component.html",
  styleUrls: ["./sortants.component.scss"],
})
export class SortantsComponent implements OnInit {
  public listCategories: category[];
  public Code: string;
  public typeId: number;

  constructor(
    private productsService: productsService,
    private categoriesService: categoriesService,
    private popupService: PopupService,
  ) {
    this.listCategories = [];
    this.Code = "";
    this.typeId = 5; // 5 for sortants
  }

  ngOnInit(): void {
    this.categoriesService.getCategoriesSortants().subscribe((response) => {
      // @ts-ignore
      this.listCategories = response.data;
    });
  }

  //Fonction pour attendre
  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async onSubmit(form: NgForm) {
    this.productsService.unit = form.value["unit"];
    this.productsService.tag = form.value["tag"];
    this.productsService.nom = form.value["nom"];
    this.Code = form.value["categorie"];

    if (this.productsService.tag == null) this.productsService.tag = "";
    if (this.productsService.unit == null) this.productsService.unit = "";

    let lastCodeUsine = 0,
      lastCodeGlobal = 0;
    //On va chercher pour chaque site le dernierCode et on stocke le plus grand de tout les sites confondu pour avoir une uniformité
    this.categoriesService.sites.forEach((site) => {
      this.productsService
        .getLastCode(this.Code, site.id)
        .subscribe((response) => {
          if (response.data.length > 0) {
            var CodeCast: number = +response.data[0].Code;
            lastCodeUsine = CodeCast + 1;
          } else {
            lastCodeUsine = Number(this.Code + "0001");
          }
          //Si le code de l'usine est plus grand que celui déjà stocké, on le stocke
          if (lastCodeUsine > lastCodeGlobal) {
            lastCodeGlobal = lastCodeUsine;
            this.productsService.code = String(lastCodeGlobal);
          }
        });
    });

    await this.wait(500);

    //On va créer le sortant pour l'ensemble des sites = > Référentiel produit unique
    this.categoriesService.sites.forEach((site) => {
      this.productsService
        .createProduct(this.typeId, site.id)
        .subscribe((response) => {
          if (response == "Création du produit OK") {
            this.popupService.alertSuccessForm("Le sortant a bien été créé !");
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la création du sortant ....",
            );
          }
        });
    });

    this.resetFields(form);
  }

  resetFields(form: NgForm) {
    form.controls["nom"].reset();
    form.value["nom"] = "";
    form.controls["unit"].reset();
    form.value["unit"] = "";
    form.controls["tag"].reset();
    form.value["tag"] = "";
  }
}
