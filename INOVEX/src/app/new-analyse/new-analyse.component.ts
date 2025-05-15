import { Component, OnInit } from "@angular/core";
import { category } from "../../models/categories.model";
import { NgForm } from "@angular/forms";
import { productsService } from "../services/products.service";
import { categoriesService } from "../services/categories.service";
import { PopupService } from "../services/popup.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-new-analyse",
  templateUrl: "./new-analyse.component.html",
  styleUrls: ["./new-analyse.component.scss"],
})
export class NewAnalyseComponent implements OnInit {
  public listCategories: category[];
  public Code: string;
  public typeId: number;
  constructor(
    private productsService: productsService,
    private popupService: PopupService,
    private categoriesService: categoriesService,
    private router: Router,
  ) {
    this.listCategories = [];
    this.Code = "";
    this.typeId = 6; // 6 for analyse
  }

  ngOnInit(): void {
    this.categoriesService.getCategoriesAnalyses().subscribe((response) => {
      // @ts-expect-error data
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
    if (form.value["unit"] == null) {
      this.productsService.unit = "";
    } else this.productsService.unit = form.value["unit"];

    if (form.value["tag"] == null) {
      this.productsService.tag = "";
    } else this.productsService.tag = form.value["tag"];

    this.productsService.nom = form.value["nom"];
    this.Code = form.value["categorie"];

    let lastCodeUsine = 0,
      lastCodeGlobal = 0;
    //On va chercher pour chaque site le dernierCode et on stocke le plus grand de tout les sites confondu pour avoir une uniformité
    this.categoriesService.sites.forEach((site) => {
      this.productsService
        .getLastCode(this.Code, site.id)
        .subscribe((response) => {
          if (response.data.length > 0) {
            const CodeCast: number = +response.data[0].Code;
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

    //On va créer l'analyse pour l'ensemble des sites = > Référentiel produit unique
    this.categoriesService.sites.forEach((site) => {
      this.productsService
        .createProduct(this.typeId, site.id)
        .subscribe((response) => {
          if (response == "Création du produit OK") {
            this.popupService.alertSuccessForm("L'analyse a bien été créé !");
          } else {
            this.popupService.alertSuccessForm(
              "Erreur lors de la création de l'analyse ....",
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

  goToAdmin() {
    this.router.navigate(["/admin"]);
  }
}
