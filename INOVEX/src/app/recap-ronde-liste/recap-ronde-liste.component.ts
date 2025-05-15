import { Component, OnInit } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { ActivatedRoute, Router } from "@angular/router";
import { addDays, format, subDays } from "date-fns";
import { rondierService } from "../services/rondier.service";
import { zone } from "src/models/zone.model";
import Swal from "sweetalert2";
import { PopupService } from "../services/popup.service";
declare let $: any;

@Component({
  selector: "app-recap-ronde-liste",
  templateUrl: "./recap-ronde-liste.component.html",
  styleUrls: ["./recap-ronde-liste.component.scss"],
})
export class RecapRondeListeComponent implements OnInit {
  public listAction: any[];
  public listEvenement: any[];
  public listZone: any[];
  public listConsigne: any[];
  public listActu: any[];
  public date: Date;
  public dateDebString: string;
  public dateFinString: string;
  public quart: number;
  public idEquipe: number;
  public nomEquipe: string;
  public listRondier: any[];
  public dateDebForm: string;
  public dateFormatRonde: string;
  public urlPDF: string;

  constructor(
    public cahierQuartService: cahierQuartService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private rondierService: rondierService,
    private router: Router,
  ) {
    this.listAction = [];
    this.listConsigne = [];
    this.listZone = [];
    this.listEvenement = [];
    this.listActu = [];
    this.date = new Date();
    this.dateDebString = "";
    this.dateFinString = "";
    this.quart = 0;
    this.idEquipe = 0;
    this.nomEquipe = "";
    this.listRondier = [];
    this.dateDebForm = "";
    this.dateFormatRonde = "";
    this.urlPDF = "";

    this.route.queryParams.subscribe((params) => {
      if (params.quart != undefined) {
        this.quart = params.quart;
      } else {
        this.quart = 0;
      }
    });

    //Récupération de l'heure actuelle
    const date = new Date();
    const heure = date.getHours();

    //Choix du quart en cours
    if (heure > 5 && heure < 13) {
      this.quart = 1;
    } else if (heure > 13 && heure < 21) {
      this.quart = 2;
    } else this.quart = 3;
    // console.log(this.quart);

    //Récupération de la date de début et de la date de fin en fonction du quart
    if (this.quart == 1) {
      this.dateDebString = format(this.date, "yyyy-MM-dd") + " 05:00:00.000";
      this.dateFinString = format(this.date, "yyyy-MM-dd") + " 13:00:00.000";
    } else if (this.quart == 2) {
      this.dateDebString = format(this.date, "yyyy-MM-dd") + " 13:00:00.000";
      this.dateFinString = format(this.date, "yyyy-MM-dd") + " 21:00:00.000";
    } else {
      this.dateDebString = format(this.date, "yyyy-MM-dd") + " 21:00:00.000";
      this.dateFinString =
        format(addDays(this.date, 1), "yyyy-MM-dd") + " 05:00:00.000";
    }

    this.dateFormatRonde = format(this.date, "dd/MM/yyyy");
  }

  ngOnInit(): void {
    this.listAction = [];
    this.listConsigne = [];
    this.listZone = [];
    this.listEvenement = [];
    this.listActu = [];
    this.idEquipe = 0;
    this.nomEquipe = "";
    this.listRondier = [];
    // console.log(this.dateDebString);
    // console.log(this.dateFinString);

    //Récupération des action pour la ronde précédente
    this.cahierQuartService
      .getActionsRonde(this.dateDebString, this.dateFinString)
      .subscribe((response) => {
        this.listAction = response.data;
      });

    //Récupération des évènement pour la ronde précédente
    this.cahierQuartService
      .getEvenementsRonde(this.dateDebString, this.dateFinString)
      .subscribe((response) => {
        this.listEvenement = response.data;
      });

    //Récupération des actus pour la ronde précédente
    this.cahierQuartService
      .getActusRonde(this.dateDebString, this.dateFinString)
      .subscribe((response) => {
        this.listActu = response.data;
      });

    //Récupération des zones pour la ronde précédente
    this.cahierQuartService
      .getZonesCalendrierRonde(this.dateDebString, this.dateFinString)
      .subscribe((response) => {
        this.listZone = response.BadgeAndElementsOfZone;
      });

    //On récupére la liste des consignes de la ronde précédente
    this.rondierService
      .listConsignesEntreDeuxDates(
        this.dateDebString.substring(0, 16),
        this.dateFinString.substring(0, 16),
      )
      .subscribe((response) => {
        //@ts-expect-error data
        this.listConsigne = response.data;
      });

    //Récupération de l'id de l'équipe pour la ronde si l'équipe est déjà crée
    this.cahierQuartService
      .getEquipeQuart(
        this.quart,
        format(new Date(this.dateDebString), "yyyy-MM-dd"),
      )
      .subscribe((response) => {
        this.idEquipe = response.data[0].id;
        //Si on est en mode édition
        if (this.idEquipe > 0) {
          //On récupère l'équipe concernée
          this.cahierQuartService
            .getOneEquipe(this.idEquipe)
            .subscribe((response) => {
              this.nomEquipe = response.data[0]["equipe"];
              if (response.data[0]["idRondier"] != null) {
                for (let i = 0; i < response.data.length; i++) {
                  this.listRondier.push({
                    Id: response.data[i]["idRondier"],
                    Prenom: response.data[i]["prenomRondier"],
                    Nom: response.data[i]["nomRondier"],
                    Poste: response.data[i]["poste"],
                    Zone: response.data[i]["zone"],
                    heure_deb: response.data[i]["heure_deb"],
                    heure_fin: response.data[i]["heure_fin"],
                    heure_tp: response.data[i]["heure_tp"],
                    comm_tp: response.data[i]["comm_tp"],
                  });
                }
              }
            });
        }
      });

    //Récupération de l'url de récap de quart
    this.cahierQuartService
      .getUrlPDF(this.dateFormatRonde, this.quart)
      .subscribe((response) => {
        if (response.data.length > 0) {
          this.urlPDF = response.data[0].urlPDF;
        } else this.urlPDF = "";
      });
  }

  downloadFile(consigne: string) {
    window.open(consigne, "_blank");
  }

  priseDeQuart() {
    //Demande de confirmation de création d'équipe
    Swal.fire({
      title: "Avez vous pris connaissance des infos du quart précedent ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        // window.location.href =
        //   "https://fr-couvinove300.prod.paprec.fr:8100/cahierQuart/recapRonde?quart=" +
        //   this.quart;
        this.router.navigate(["/cahierQuart/recapRonde"], {
          queryParams: { quart: this.quart },
        });
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La prise de quart a été annulée.");
      }
    });
  }

  setFilters() {
    // console.log(this.dateDebForm);
    this.date = new Date(this.dateDebForm);
    this.dateFormatRonde = format(this.date, "dd/MM/yyyy");
    //Récupération de la date de début et de la date de fin en fonction du quart
    if (this.quart == 1) {
      this.dateDebString = format(this.date, "yyyy-MM-dd") + " 05:00:00.000";
      this.dateFinString = format(this.date, "yyyy-MM-dd") + " 13:00:00.000";
    } else if (this.quart == 2) {
      this.dateDebString = format(this.date, "yyyy-MM-dd") + " 13:00:00.000";
      this.dateFinString = format(this.date, "yyyy-MM-dd") + " 21:00:00.000";
    } else {
      this.dateDebString = format(this.date, "yyyy-MM-dd") + " 21:00:00.000";
      this.dateFinString =
        format(addDays(this.date, 1), "yyyy-MM-dd") + " 05:00:00.000";
    }
    this.ngOnInit();
  }

  DLFile() {
    window.open(this.urlPDF, "_blank");
  }
}
