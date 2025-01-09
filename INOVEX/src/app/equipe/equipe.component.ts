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
import { Router } from "@angular/router";

import { format } from "date-fns";
import { PopupService } from "../services/popup.service";
declare let $: any;
@Component({
  selector: "app-equipe",
  templateUrl: "./equipe.component.html",
  styleUrls: ["./equipe.component.scss"],
})
export class EquipeComponent implements OnInit {
  public listUsers: user[];
  public listAjout: any[];
  public listZone: zone[];
  public idEquipe: number;
  public name: string;
  public periode: string;
  public quart: number;
  public dateDuJour: string;
  public radioSelect: string;
  public equipesEnregistrees: any[];
  public idEquipeEnregistree: string;
  public heure_deb: string;
  public heure_fin: string;

  constructor(
    private cahierQuartService: cahierQuartService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private router: Router,
  ) {
    this.listUsers = [];
    this.listAjout = [];
    this.listZone = [];
    this.equipesEnregistrees = [];
    this.name = "";
    this.idEquipe = 0;
    this.periode = "matin";
    this.quart = 0;
    this.radioSelect = "";
    this.idEquipeEnregistree = "0";
    this.heure_deb = "";
    this.heure_fin = "";

    //Permet de savoir si on est en mode édition ou création
    this.route.queryParams.subscribe((params) => {
      if (params.idEquipe != undefined) {
        this.idEquipe = params.idEquipe;
      } else {
        this.idEquipe = 0;
      }

      if (params.quart != undefined) {
        this.quart = params.quart;
      } else {
        this.quart = 0;
      }

      if (this.quart == 1) {
        this.periode = "matin";
      } else if (this.quart == 2) {
        this.periode = "apres-midi";
      } else {
        this.periode = "nuit";
      }
    });

    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    const dateFormateur = new Intl.DateTimeFormat("fr-FR", options);
    this.dateDuJour = dateFormateur.format(date);
  }

  ngOnInit(): void {
    //Récupération de la date de début et de la date de fin en fonction du quart
    if (this.quart == 1) {
      this.heure_deb = "05:00";
      this.heure_fin = "13:00";
    } else if (this.quart == 2) {
      this.heure_deb = "13:00";
      this.heure_fin = "21:00";
    } else {
      this.heure_deb = "21:00";
      this.heure_fin = "05:00";
    }

    //Si on est en mode édition
    if (this.idEquipe > 0) {
      $("#gauche").show();
      $("#droite").show();
      $("#newEquipe").show();
      //On récupère l'quipe concernée
      this.cahierQuartService
        .getOneEquipe(this.idEquipe)
        .subscribe((response) => {
          this.name = response.data[0]["equipe"];
          this.quart = response.data[0]["quart"];
          if (response.data[0]["quart"] == 1) {
            this.periode = "matin";
          } else if (response.data[0]["quart"] == 2) {
            this.periode = "apres-midi";
          } else {
            this.periode = "nuit";
          }

          let zoneId;
          if (response.data[0]["idRondier"] != null) {
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i]["idZone"] > 0) {
                zoneId = response.data[i]["idZone"];
              } else zoneId = 0;
              this.listAjout.push({
                Id: response.data[i]["idRondier"],
                Prenom: response.data[i]["prenomRondier"],
                Nom: response.data[i]["nomRondier"],
                posteUser: response.data[i]["poste"],
                Zone: zoneId,
              });
            }
          }
        });
    }

    //On récupère la liste des utilisateurs rondiers sans équipe => finalement on récupère même ceux ayant déjà une équipe :)
    this.cahierQuartService
      .getUsersRondierSansEquipe()
      .subscribe((response) => {
        // @ts-expect-error data
        this.listUsers = response.data;
        // this.list2.push()

        //On récupère les zones disponibles dans cette usine
        this.cahierQuartService.getZones().subscribe((response) => {
          //@ts-expect-error data
          this.listZone = response.data;
        });
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
    if (this.radioSelect == "enregistree") {
      nomEquipe = nomEquipe.split("-")[1];
    }
    //Boucle qui permet de vérifier que chaque utilisateur à bien un poste ou une zone de contrôle
    for (const user of this.listAjout) {
      //var rechercheZone = user.Nom +"_"+user.Prenom+"_zone";
      //var idZone = parseInt((<HTMLInputElement>document.getElementById(rechercheZone)).value);
      //if(Number.isNaN(idZone)){
      //this.popupService.alertErrorForm('Veuillez affecter une ronde à chaque personne ! La saisie a été annulée.');
      //return
      //}

      const recherchePoste = user.Nom + "_" + user.Prenom + "_poste";
      const idPoste = (
        document.getElementById(recherchePoste) as HTMLInputElement
      ).value;
      if (idPoste == "") {
        this.popupService.alertErrorForm(
          "Veuillez affecter un poste à chaque personne ! La saisie a été annulée.",
        );
        return;
      }
    }
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
            this.update(this.quart);
          }
          //Sinon on créé l'équipe
          else {
            this.cahierQuartService
              .nouvelleEquipe(
                nomEquipe,
                this.quart,
                format(new Date(), "yyyy-MM-dd"),
              )
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
          this.popupService.alertSuccessForm("La création a été annulée.");
        }
      });
    }
  }

  //Fonction qui permet d'ajouter les rondiers un par un à une équipe
  ajoutAffectationEquipe(idEquipe: number) {
    for (const user of this.listAjout) {
      const idUser = user.Id;
      //var rechercheZone = user.Nom +"_"+user.Prenom+"_zone";
      //var idZone = parseInt((<HTMLInputElement>document.getElementById(rechercheZone)).value);
      //On force à 0 l'idZone car on ne gère plus l'affectation zone par utilisateur => cahier de quart le remplace
      const idZone = 0;
      const recherchePoste = user.Nom + "_" + user.Prenom + "_poste";
      const poste = (
        document.getElementById(recherchePoste) as HTMLInputElement
      ).value;

      if (idUser > 0) {
        this.cahierQuartService
          .nouvelleAffectationEquipe(
            idUser,
            idEquipe,
            idZone,
            poste,
            this.heure_deb,
            this.heure_fin,
          )
          .subscribe((response) => {
            this.popupService.alertSuccessForm("Nouvelle équipe créée");
            this.listAjout = [];
            this.router.navigate(["/cahierQuart"]);
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
  update(quartNombre: number) {
    this.cahierQuartService
      .udpateEquipe(this.name, quartNombre, this.idEquipe)
      .subscribe((response) => {
        const idEquipe = this.idEquipe;
        this.updateAffectationEquipe(idEquipe);
      });
  }

  //Fonction qui permet de changer les rondiers d'une équipe
  updateAffectationEquipe(idEquipe: number) {
    this.cahierQuartService
      .deleteAffectationEquipe(idEquipe)
      .subscribe((response) => {
        this.ajoutAffectationEquipe(idEquipe);
      });
  }

  //Fonction permettant d'afficher la création d'une nouvelle équipe
  showNewEquipe() {
    this.listUsers = [];
    //On récupère la liste des utilisateurs rondiers sans équipe => finalement on récupère même ceux ayant déjà une équipe :)
    this.cahierQuartService
      .getUsersRondierSansEquipe()
      .subscribe((response) => {
        // @ts-expect-error data
        this.listUsers = response.data;
      });
    this.listAjout = [];
    this.idEquipeEnregistree = "0";
    $("#gauche").show();
    $("#droite").show();
    $("#newEquipe").show();
    $("#equipesEnregistrees").hide();
  }

  //Fonction permettant d'afficher la création d'une équipe déjà enregistrée
  showEquipeEnregistree() {
    this.listUsers = [];
    //On récupère la liste des utilisateurs rondiers sans équipe => finalement on récupère même ceux ayant déjà une équipe :)
    this.cahierQuartService
      .getUsersRondierSansEquipe()
      .subscribe((response) => {
        // @ts-expect-error data
        this.listUsers = response.data;
      });
    this.listAjout = [];
    this.idEquipeEnregistree = "0";
    $("#gauche").show();
    $("#droite").show();
    $("#newEquipe").hide();
    $("#equipesEnregistrees").show();
    //On récupère l'quipe concernée
    this.cahierQuartService
      .getNomsEquipesEnregistrees()
      .subscribe((response) => {
        this.equipesEnregistrees = response.data;
        //console.log(this.equipesEnregistrees)
      });
  }

  //Fonction qui permet de charger une équipe lors de sa sélection
  chargerRondiersEquipeEnregistree() {
    this.listAjout = [];
    const id = this.idEquipeEnregistree.split("-")[0];
    //console.log(this.idEquipeEnregistree)
    if (this.idEquipeEnregistree != "-") {
      this.cahierQuartService
        .getOneEnregistrementEquipe(id)
        .subscribe((response) => {
          if (response.data[0]["idRondier"] != null) {
            for (let i = 0; i < response.data.length; i++) {
              this.listAjout.push({
                Id: response.data[i]["idRondier"],
                Prenom: response.data[i]["prenomRondier"],
                Nom: response.data[i]["nomRondier"],
                posteUser: response.data[i]["posteUser"],
              });
            }
          }
        });
    }
  }
}
