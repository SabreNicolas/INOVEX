import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon, SweetAlertPosition } from "sweetalert2";

@Injectable()
export class PopupService {
  /** Créer une alerte limité dans le temps pour les requêtes qui se sont effectués
   * @param title La réponse qui sera affiché
   * @param timer La durée d'affichage en ms (5 secondes par défaut)
   * @param color Couleur du fond de l'alerte (green par défaut)
   */
  alertSuccessForm(
    title: string = "La requête a bien été effectué",
    timer: number = 5000,
    color: string = "green",
  ) {
    // Création
    const notifError = Swal.mixin({
      toast: true,
      position: "bottom",
      iconColor: "white",
      color: "white",
      background: color,
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    // Affichage
    notifError.fire({
      icon: "success",
      title: title,
    });
  }

  /**
   * Créer une alerte limité dans le temps pour les erreurs de formulaire
   * @param color Couleur du fond de l'alerte (red par défaut)
   * @param timer La durée d'affichage en ms
   * @param title La réponse qui sera affiché
   */
  public alertErrorForm(
    title: string = "Veuillez bien remplir le formulaire !",
    timer: number = 5000,
    color: string = "red",
  ) {
    // Création
    const notifError = Swal.mixin({
      toast: true,
      position: "bottom",
      iconColor: "white",
      color: "white",
      background: color,
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    // Affichage
    notifError.fire({
      icon: "error",
      title: title,
    });
  }
}
