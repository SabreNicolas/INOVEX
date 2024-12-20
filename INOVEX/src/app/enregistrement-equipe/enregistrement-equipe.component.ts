import { Component, OnInit } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { user } from "../../models/user.model";
import { zone } from "../../models/zone.model";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-enregistrement-equipe",
  templateUrl: "./enregistrement-equipe.component.html",
  styleUrls: ["./enregistrement-equipe.component.scss"],
})
export class EnregistrementEquipeComponent implements OnInit {
  public listUsers: user[];
  public listAjout: any[];
  public name: string;
  public idEquipe: number;

  constructor(
    private cahierQuartService: cahierQuartService,
    private route: ActivatedRoute,
    private popupService: PopupService,
  ) {
    this.listUsers = [];
    this.listAjout = [];
    this.name = "Equipe 1";
    this.idEquipe = 0;

    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe((params) => {
      if (params.idEquipe != undefined) {
        this.idEquipe = params.idEquipe;
      } else {
        this.idEquipe = 0;
      }
    });
  }

  ngOnInit(): void {
    //Si on est en mode édition
    if (this.idEquipe > 0) {
      //On récupère l'équipe concernée
      this.cahierQuartService
        .getOneEnregistrementEquipe(this.idEquipe)
        .subscribe((response) => {
          this.name = response.data[0]["equipe"];

          if (response.data[0]["idRondier"] != null) {
            for (let i = 0; i < response.data.length; i++) {
              this.listAjout.push({
                Id: response.data[i]["idRondier"],
                Prenom: response.data[i]["prenomRondier"],
                Nom: response.data[i]["nomRondier"],
              });
            }
          }
        });
    }

    //On récupère la liste des utilisateurs rondiers
    this.cahierQuartService.getUsersRondier().subscribe((response) => {
      // @ts-ignore
      this.listUsers = response.data;
      // this.list2.push()
    });
  }

  //Fonction permettant de gérer le drag and drop
  onItemDropped(event: CdkDragDrop<any[]>) {
    if (
      (event.previousContainer.id === "listRondier" &&
        event.container.id === "listAjout") ||
      (event.previousContainer.id === "listAjout" &&
        event.container.id === "listRondier")
    ) {
      const droppedItem = event.previousContainer.data[event.previousIndex];
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.push(droppedItem);
    }
  }

  nouvelleEquipe(nomEquipe: string /*, quart :string*/) {
    if (this.listAjout.length == 0) {
      this.popupService.alertErrorForm(
        "Veuillez ajouter des personnes à l'équipe ! La saisie a été annulée.",
      );
      return;
    }
    //On vérifie si il y a un nom d'équipe
    if (nomEquipe === "") {
      this.popupService.alertErrorForm(
        "Veuillez saisir un nom d'équipe ! La saisie a été annulée.",
      );
    } else {
      //Demande de confirmation de création d'équipe
      Swal.fire({
        title: "Êtes-vous sûr(e) de créer cette équipe ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, créer",
        cancelButtonText: "Annuler",
      }).then((result) => {
        if (result.isConfirmed) {
          //Si on est en mode édition d'une équipe on va dans la fonction update
          if (this.idEquipe > 0) {
            this.update();
          }
          //Sinon on créé l'équipe
          else {
            this.cahierQuartService
              .nouvelEnregistrementEquipe(nomEquipe)
              .subscribe((response) => {
                //On vide les input pour une nouvelle création
                (
                  document.getElementById("nomEquipe") as HTMLInputElement
                ).value = "";

                //On ajoute les rondier dans l'équipe
                const idEquipe = response["data"][0]["Id"];
                this.ajoutAffectationEquipe(idEquipe);
              });
          }
        } else {
          // Pop-up d'annulation de la suppression
          this.popupService.alertErrorForm("La création a été annulée.");
        }
      });
    }
  }

  //Fonction qui permet d'ajouter les rondiers un par un à une équipe
  ajoutAffectationEquipe(idEquipe: number) {
    for (const user of this.listAjout) {
      const idUser = user.Id;

      if (idUser > 0) {
        this.cahierQuartService
          .nouvelEnregistrementAffectationEquipe(idUser, idEquipe)
          .subscribe((response) => {
            this.popupService.alertSuccessForm("Nouvelle équipe créée");
            this.listAjout = [];
          });
      }
    }
  }

  //Fonction qui permet d'ajouter un utilisateur dans la table d'ajout
  ajoutUser(user: user) {
    this.listAjout.push(user);

    const indexRomove = this.listUsers.findIndex(
      (item) => item.Nom === user.Nom && item.Prenom == user.Prenom,
    );

    if (indexRomove != -1) {
      this.listUsers.splice(indexRomove, 1);
    }
  }

  //Fonction qui permet de supprimer un utilisateur de la table d'ajout
  suppUser(user: user) {
    this.listUsers.unshift(user);

    const indexRomove = this.listAjout.findIndex(
      (item) => item.Nom === user.Nom && item.Prenom == user.Prenom,
    );

    if (indexRomove != -1) {
      this.listAjout.splice(indexRomove, 1);
    }
  }

  //Fonction qui permet de mettre à jour les informations d'une équipe
  update() {
    this.cahierQuartService
      .udpateEnregistrementEquipe(this.name, this.idEquipe)
      .subscribe((response) => {
        const idEquipe = this.idEquipe;
        this.updateAffectationEquipe(idEquipe);
      });
  }

  // Fonction qui permet de changer les rondiers d'une équipe
  updateAffectationEquipe(idEquipe: number) {
    this.cahierQuartService
      .deleteEnregistrementAffectationEquipe(idEquipe)
      .subscribe((response) => {
        this.ajoutAffectationEquipe(idEquipe);
      });
  }
}
