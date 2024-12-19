import { Component, OnInit } from "@angular/core";
import { moralEntitiesService } from "../services/moralentities.service";
import { moralEntity } from "../../models/moralEntity.model";
import { dechetsCollecteurs } from "src/models/dechetsCollecteurs.model";
import { user } from "src/models/user.model";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-list-moral-entities",
  templateUrl: "./list-moral-entities.component.html",
  styleUrls: ["./list-moral-entities.component.scss"],
})
export class ListMoralEntitiesComponent implements OnInit {
  public moralEntities: moralEntity[];
  public debCode: string;
  public listId: number[];
  private userLogged: user | undefined;
  public isAdmin: number; //0 ou 1
  private listTypeDechetsCollecteurs: dechetsCollecteurs[];
  public listTypeDechets: string[];
  public listCollecteurs: string[];

  constructor(
    private moralEntitiesService: moralEntitiesService,
    private popupService: PopupService,
  ) {
    this.debCode = "";
    this.listId = [];
    this.isAdmin = 0;
    this.moralEntities = [];
    this.listTypeDechetsCollecteurs = [];
    this.listTypeDechets = [];
    this.listCollecteurs = [];
  }

  ngOnInit(): void {
    //Verification droit admin du user pour disabled ou non le btn d'edition des clients
    var userLogged = localStorage.getItem("user");
    if (typeof userLogged === "string") {
      var userLoggedParse = JSON.parse(userLogged);
      this.userLogged = userLoggedParse;
      // @ts-ignore
      this.isAdmin = this.userLogged["isAdmin"];
    }

    this.moralEntitiesService
      .getMoralEntitiesAll(this.debCode)
      .subscribe((response) => {
        // @ts-ignore
        this.moralEntities = response.data;
        // console.log(response)
        //Récupération des types de déchets et des collecteurs
        this.moralEntitiesService.GetTypeDéchets().subscribe((response) => {
          //@ts-ignore
          this.listTypeDechetsCollecteurs = response.data;

          //On boucle maintenant sur ce tableau pour scindé en déchets / collecteurs avec les codes associés
          this.listTypeDechetsCollecteurs.forEach((typeDechetsCollecteurs) => {
            let typeDechets, collecteur, regroupType;

            //ON regroupe les noms DIB et DEA en 1 seul
            if (
              typeDechetsCollecteurs.Name.split(" ")[0] == "DIB" ||
              typeDechetsCollecteurs.Name.split(" ")[0] == "DEA"
            ) {
              regroupType = "DIB/DEA";
            } else regroupType = typeDechetsCollecteurs.Name.split(" ")[0];
            typeDechets =
              typeDechetsCollecteurs.Code.substring(0, 3) + "_" + regroupType;

            //GESTION cas spécifique DIB/DEA
            if (typeDechetsCollecteurs.Code.length > 5) {
              collecteur =
                typeDechetsCollecteurs.Code.substring(3, 5) +
                "_" +
                typeDechetsCollecteurs.Name.split(" ")[1];
            } else {
              collecteur =
                typeDechetsCollecteurs.Code.substring(3) +
                "_" +
                typeDechetsCollecteurs.Name.split(" ")[1];
            }

            if (!this.listTypeDechets.includes(typeDechets)) {
              this.listTypeDechets.push(typeDechets);
            }
            if (!this.listCollecteurs.includes(collecteur)) {
              this.listCollecteurs.push(collecteur);
            }
          });
        });
      });
  }

  setFilters() {
    /* Début prise en compte des filtres*/
    var produitElt = document.getElementById("produit");
    // @ts-ignore
    var produitSel = produitElt.options[produitElt.selectedIndex].value;
    var collecteurElt = document.getElementById("collecteur");
    if (collecteurElt != null) {
      var collecteurSel =
        //@ts-ignore
        collecteurElt.options[collecteurElt.selectedIndex].value;
    }
    //Gestion du cas ou il n'y a pas de collecteur
    else {
      var collecteurSel = "01";
    }
    this.debCode = produitSel + collecteurSel;
    /*Fin de prise en commpte des filtres */
    this.ngOnInit();
  }

  //mise à jour du code d'un client
  /*setCode(MR : moralEntity){
    var code = prompt('Veuillez saisir un Code',MR.Code);
    this.moralEntitiesService.setCode(code,MR.Id).subscribe((response)=>{
      if (response == "Mise à jour du code OK"){
        Swal.fire("Le Code a été mis à jour !");
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du Code ....',
        })
      }
    });
    this.ngOnInit();
  }*/

  //mise à jour du prix d'un client
  setPrice(MR: moralEntity) {
    var prix = prompt("Veuillez saisir un Prix", String(MR.UnitPrice));
    if (prix != null) {
      // @ts-ignore
      this.moralEntitiesService
        .setPrix(prix.replace(",", "."), MR.Id)
        .subscribe((response) => {
          if (response == "Mise à jour du prix unitaire OK") {
            this.popupService.alertSuccessForm("Le Prix a été mis à jour !");
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la mise à jour du Prix ....",
            );
          }
        });
      this.ngOnInit();
    }
  }

  //mise à jour du num de CAP d'un client
  setCAP(MR: moralEntity) {
    var cap = prompt("Veuillez saisir un n° du CAP", String(MR.numCAP));
    if (cap === null) {
      return; //break out of the function early
    }
    // @ts-ignore
    this.moralEntitiesService.setCAP(cap, MR.Id).subscribe((response) => {
      if (response == "Mise à jour du CAP OK") {
        this.popupService.alertSuccessForm(
          "Le n° de du CAP a été mis à jour !",
        );
      } else {
        this.popupService.alertErrorForm(
          "Erreur lors de la mise à jour du n° du CAP ....",
        );
      }
    });
    this.ngOnInit();
  }

  //mise à jour du nom d'un client
  setName(MR: moralEntity) {
    var name = prompt("Veuillez saisir un Nom", String(MR.Name));
    if (name == null) {
      return; //break out of the function early
    }
    // @ts-ignore
    this.moralEntitiesService.setName(name, MR.Id).subscribe((response) => {
      if (response == "Changement de nom du client OK") {
        this.popupService.alertSuccessForm("Le Nom a été mis à jour !");
      } else {
        this.popupService.alertErrorForm(
          "Erreur lors de la mise à jour du Nom ....",
        );
      }
    });
    this.ngOnInit();
  }

  //Fonction pour attendre
  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  //désactiver un client
  async setVisibility(idMr: number, visibility: number) {
    this.moralEntitiesService
      .setEnabled(idMr, visibility)
      .subscribe((response) => {
        if (response == "Changement de visibilité du client OK") {
          this.popupService.alertSuccessForm(
            "La visibilité du client a bien été changé !",
          );
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors du changement de visibilité du client ....",
          );
        }
      });
    await this.wait(50);
    this.ngOnInit();
  }

  //permet de stocker les Id des moralEntities pour lesquelles il faut changer le prix
  addMr(Id: number) {
    // @ts-ignore
    if (document.getElementById("" + Id).checked == true) {
      this.listId.push(Id);
    } else this.listId.splice(this.listId.indexOf(Id), 1);

    // console.log(this.listId);
  }

  changeAllPrice() {
    var prix = prompt("Veuillez saisir un Prix", "0");
    for (var i = 0; i < this.listId.length; i++) {
      this.moralEntitiesService
        //@ts-ignore
        .setPrix(prix.replace(",", "."), this.listId[i])
        .subscribe((response) => {
          if (response == "Mise à jour du prix unitaire OK") {
            // console.log("Le Prix a été mis à jour !");
          } else {
            this.popupService.alertErrorForm(
              "Erreur lors de la mise à jour du Prix ....",
            );
          }
        });
    }
    this.listId = [];
    this.ngOnInit();
    this.popupService.alertSuccessForm("Le Prix a été mis à jour !");
  }
}
