import { Component, OnInit } from "@angular/core";
import { productsService } from "../services/products.service";
import Swal from "sweetalert2";
import { product } from "../../models/products.model";
import { element } from "../../models/element.model";
import { rondierService } from "../services/rondier.service";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  public typeId: number;
  public listProducts: product[];
  public name: string;
  public listId: number[];
  public listElements: element[];
  public isSuperAdmin: boolean;

  constructor(
    private productsService: productsService,
    private rondierService: rondierService,
    private popupService: PopupService,
  ) {
    this.typeId = 4;
    this.listProducts = [];
    this.name = "";
    this.listId = [];
    this.listElements = [];
    this.isSuperAdmin = false;
  }

  ngOnInit(): void {
    this.getProducts();
    this.getElements();
    const userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      const userLoggedParse = JSON.parse(userLogged);
      //Si une localisation est stocké dans le localstorage, c'est que c'est un superAdmin et qu'il a choisi le site au début
      if (userLoggedParse.hasOwnProperty("localisation")) {
        this.isSuperAdmin = true;
      }
    }
  }

  setFilters() {
    /* Début prise en compte des filtres*/
    const typeElt = document.getElementById("type");
    // @ts-expect-error data
    const typeSel = typeElt.options[typeElt.selectedIndex].value;
    const name = (document.getElementById("name") as HTMLInputElement).value;
    this.typeId = typeSel;
    this.name = name.replace(/'/g, "''");
    /*Fin de prise en commpte des filtres */
    this.getProducts();
  }

  getProducts() {
    this.productsService
      .getAllProductsAndElementRondier(this.typeId, this.name)
      .subscribe((response) => {
        // @ts-expect-error data
        this.listProducts = response.data;
      });
  }

  getElements() {
    //Requête pour récupérer tout les éléments rondiers d'une usine qui sont en type valeur
    this.rondierService.getElementsOfUsine().subscribe((response) => {
      // @ts-expect-error data
      this.listElements = response.data;
      //console.log(this.listElements)
    });
  }

  //désactiver un produit
  async setVisibility(idPR: number, visibility: number) {
    this.productsService.setEnabled(idPR, visibility).subscribe((response) => {
      if (response == "Changement de visibilité du client OK") {
        this.popupService.alertSuccessForm(
          "La visibilité à bien été mise à jour",
        );
      } else {
        this.popupService.alertErrorForm(
          "Erreur lors du changement de visibilité du produit ....",
        );
      }
    });
    await this.wait(5);
    this.getProducts();
  }

  //mise à jour de l'unité
  setUnit(PR: product) {
    const unit = prompt("Veuillez saisir une unité", String(PR.Unit));
    if (unit == null) {
      return; //break out of the function early
    }
    this.productsService.setUnit(unit, PR.Id).subscribe((response) => {
      if (response == "Mise à jour de l'unité OK") {
        this.popupService.alertSuccessForm("L'unité a été mise à jour !");
      } else {
        this.popupService.alertErrorForm(
          "Erreur lors de la mise à jour de l'unité ....",
        );
      }
    });
    this.getProducts();
  }

  //mise à jour du type
  setType(PR: product) {
    const type = prompt(
      "2 pour Consommable, 3 pour Niveau, 4 pour Compteur, 5 pour Sortie, 6 pour Analyse",
      String(PR.typeId),
    );
    // @ts-expect-error data
    if (type < 1) {
      return; //break out of the function early
    }
    // @ts-expect-error data
    this.productsService.setType(type, PR.Id).subscribe((response) => {
      if (response == "Changement de catégorie du produit OK") {
        this.popupService.alertSuccessForm("Le type a été changé !");
      } else {
        this.popupService.alertErrorForm(
          "Erreur lors de la mise à jour du type ....",
        );
      }
    });
    this.getProducts();
  }

  //permet de stocker les Id des products pour lesquelles il faut changer le type
  addPr(Id: number) {
    // @ts-expect-error data
    if (document.getElementById("" + Id).checked == true) {
      this.listId.push(Id);
    } else this.listId.splice(this.listId.indexOf(Id), 1);
  }

  changeAllType() {
    const type = prompt(
      "2 pour Consommable, 3 pour Niveau, 4 pour Compteur, 5 pour Sortie, 6 pour Analyse",
      "0",
    );
    // @ts-expect-error data
    if (type < 1) {
      return; //break out of the function early
    }
    for (let i = 0; i < this.listId.length; i++) {
      this.productsService
        //@ts-expect-error data
        .setType(type, this.listId[i])
        .subscribe((response) => {
          if (response == "Changement de catégorie du produit OK") {
            this.popupService.alertSuccessForm("Le type a été changé !");
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la mise à jour du type ....",
            );
          }
        });
      this.getProducts();
    }
    this.listId = [];
    this.popupService.alertSuccessForm("Le type a été mis à jour !");
  }

  //Fonction pour attendre
  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  //Mise à jour du tag ou du codeEquipement d'un produit
  setElement(product: product, type: string) {
    if (type == "CodeEquipement") {
      if (product.CodeEquipement == null) {
        var saisie = prompt("Veuillez saisir un commentaire", "");
      } else
        var saisie = prompt(
          "Veuillez saisir un commentaire",
          String(product.CodeEquipement),
        );
    } else {
      if (product.TAG == null) {
        var saisie = prompt("Veuillez saisir un TAG", "");
      } else var saisie = prompt("Veuillez saisir un TAG", String(product.TAG));
    }
    if (saisie == null) return;
    saisie = saisie.replace(/'/g, "''");
    this.productsService
      .setElement(saisie, product.Id, type)
      .subscribe((response) => {
        if (response == "Mise à jour du Code OK") {
          this.popupService.alertSuccessForm(
            "Le commentaire a bien été enregistré !",
          );
          this.ngOnInit();
        } else if (response == "Mise à jour du TAG OK") {
          this.popupService.alertSuccessForm("Le TAG a bien été affecté !");
          this.ngOnInit();
        } else {
          this.popupService.alertErrorForm("Erreur lors de l'affectation ....");
        }
      });
  }

  updateTypeRecup(id: number, typeRecupEMonitoring: string) {
    this.productsService
      .updateTypeRecup(id, typeRecupEMonitoring)
      .subscribe((response) => {
        if (response == "Changement du type de récupération OK") {
          this.popupService.alertSuccessForm("Le type a été changé !");
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la mise à jour du type ....",
          );
        }
      });
  }
  
  //fonction qui permet de choisir l'élement rondier correspondant au produit pour la récupération automatique
  setElementRondier(pr: product) {
    let searchValue = '';
    let selectedText = '';
    let selectedOption = '';

    Swal.fire({
      title: "Veuillez choisir un élément rondier",
      html: `
        <div style="width: 100%; overflow-x: hidden; max-height: 50em;">
          <input 
            id="searchInput" 
            class="swal2-input" 
            placeholder="Rechercher..."
            onfocus="this.value=''"
            style="width: calc(100% - 3em); max-width: 100%;"
          />
          <select 
            id="selectElement" 
            class="swal2-select" 
            style="width: calc(100% - 3em); margin-top: 0.625em; display: none; overflow-x: scroll; white-space: nowrap; height: 25em;"
            size="100"
          >
            <option value="0_rondier">Aucun</option>
            ${this.listElements.map(element => 
                // @ts-expect-error data
              `<option value="${element.Id}_rondier">${element.nomZone} - ${element.nom}</option>`
            ).join('')}
          </select>
        </div>
      `,
      customClass: {
        popup: 'large-popup',
        container: 'large-container'
      },
      width: '81.25em',
      didOpen: () => {
        const input = document.getElementById('searchInput') as HTMLInputElement;
        const select = document.getElementById('selectElement') as HTMLSelectElement;
        
        input.addEventListener('focus', () => {
          select.style.display = 'block';
        });
  
        input.addEventListener('input', () => {
          searchValue = input.value.toLowerCase();
          Array.from(select.options).forEach(option => {
            option.style.display = option.text.toLowerCase().includes(searchValue) ? '' : 'none';
          });
        });
  
        select.addEventListener('change', () => {
          selectedText = select.options[select.selectedIndex].text;
          selectedOption = select.value;
          input.value = selectedText;
          select.style.display = 'none';
        });
      },
      showCancelButton: true,
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.value && selectedOption) {
        this.rondierService.changeTypeRecupSetRondier(pr.Id, Number(selectedOption.split('_')[0]))
          .subscribe(response => {
            this.popupService.alertSuccessForm("L'élément rondier a été enregistré !");
            this.ngOnInit();
          });
      }
    });
}

  //Mettre à jour le coefficient d'un produit
  updateCoeff(pr: product) {
    let saisie = prompt(
      "Veuillez saisir un coefficient pour ce produit",
      String(pr.Coefficient),
    );
    // console.log(saisie);
    if (saisie == null) return;
    saisie = saisie.replace(/'/g, "''");
    this.productsService.updateCoeff(saisie, pr.Id).subscribe((response) => {
      if (response == "Mise à jour du Coeff OK") {
        this.popupService.alertSuccessForm(
          "Le coefficient a bien été affecté !",
        );
        this.ngOnInit();
      } else {
        this.popupService.alertErrorForm("Erreur lors de l'affectation ....");
      }
    });
  }

  editionNomProduit(Name: string) {
    let saisie = prompt(
      "Veuillez saisir un nouveau nom pour ce produit pour ce produit",
      String(Name),
    );
    if (saisie == null) return;
    saisie = saisie.replace(/'/g, "''");
    Name = Name.replace(/'/g, "''");
    this.productsService
      .updateProductName(saisie, Name)
      .subscribe((response) => {
        if (response == "Changement du nom du produit OK") {
          this.popupService.alertSuccessForm("Le nom a bien été changé !");
          this.ngOnInit();
        } else {
          this.popupService.alertErrorForm("Erreur lors de l'affectation ....");
        }
      });
  }
}
