import { Component, OnInit } from "@angular/core";
import { tokenApiService } from "../services/tokenApi.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { token } from "../../models/tokens.model";
import { PopupService } from "../services/popup.service";
@Component({
  selector: "app-token-api",
  templateUrl: "./token-api.component.html",
  styleUrls: ["./token-api.component.scss"],
})
export class TokenApiComponent implements OnInit {
  public token!: string;
  public listTokens: token[];

  constructor(
    private router: Router,
    private tokenApiService: tokenApiService,
    private popupService: PopupService,
  ) {
    this.token = "";
    this.listTokens = [];
  }

  ngOnInit(): void {
    this.getTokens();
  }

  //Génération de token d'accès pour swagger
  async generateToken() {
    //Pop-up pour demander l'affectation du token
    Swal.fire({
      title: "A qui voulez-vous affecter ce token ?",
      input: "text",
      inputPlaceholder: "Saisissez le nom de la personne ici...",
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        const text = result.value;
        //Si le texte entré par l'utilisateur est vide on affiche une erreur
        if (text == "") {
          this.popupService.alertErrorForm(
            "Veuillez saisir une affectation ! La saisie a été annulée.",
          );
          return;
        }
        const text2 = text.replace(/'/g, "''");
        //Sinon on envoie la requête api permettant de générer un nouveau token
        this.tokenApiService.generateAcessToken(text2).subscribe((response) => {
          this.token = "Bearer " + response;
          //Affichage d'un pop-up de validation
          this.popupService.alertSuccessForm(
            "Token enregistré !" + `Le token a été affecté à : ${text}`,
          );
          //On récupère la nouvelle liste de token pour actualiser le tableau
          this.getTokens();
        });
      } else {
        // Pop-pup si l'utilisateur annule
        this.popupService.alertErrorForm("La saisie a été annulée.");
      }
    });
  }

  //Fonction permettant de récupérer tout les token actifs de l'api
  getTokens() {
    this.tokenApiService.getAllTokens().subscribe((response) => {
      this.listTokens = response.data;
    });
  }

  //Fonction permettant de désactiver un token
  desactivateToken(id: number) {
    //Pop-up de demande de confimation de suppression
    Swal.fire({
      title: "Êtes-vous sûr(e) ?",
      text: "La suppression sera irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        //Appel api pour désactiver le token
        this.tokenApiService.desactivateToken(id).subscribe(() => {
          //Récupération des tokens pour avoir le tableau mis à jour
          this.getTokens();
        });
        // Pop-up de supprssion effectuée
        this.popupService.alertSuccessForm("Votre élément a été supprimé.");
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La suppression a été annulée.");
      }
    });
  }

  //Fonction permettant de modifier l'affectation d'un token
  updateToken(id: number) {
    //Pop-up pour demander la nouvelle affectation du token
    Swal.fire({
      title: "A qui voulez-vous affecter ce token ?",
      input: "text",
      inputPlaceholder: "Saisissez le nom de la personne ici...",
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const text = result.value;
        //Si le texte entré par l'utilisateur est vide on affiche une erreur
        if (text == "") {
          this.popupService.alertErrorForm("La saisie a été annulée.");
          return;
        }
        const text2 = text.replace(/'/g, "''");
        //Sinon on envoie la requête api permettant de modifier l'affectation du token
        this.tokenApiService.updateToken(id, text2).subscribe((response) => {
          this.token = "Bearer " + response;
          //Pop-up de confirmation de la modification
          this.popupService.alertSuccessForm(
            "Token enregistré !" + ` Le token a été affecté à : ${text}`,
          );
          this.getTokens();
        });
      } else {
        // Pop-up d'annulation de l'utilisateur
        this.popupService.alertErrorForm("La saisie a été annulée.");
      }
    });
  }
}
