import { Component, OnInit } from "@angular/core";
import { rondierService } from "../services/rondier.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { delay } from "rxjs/operators";
import { PopupService } from "../services/popup.service";

@Component({
  selector: "app-gestion-badge",
  templateUrl: "./gestion-badge.component.html",
  styleUrls: ["./gestion-badge.component.scss"],
})
export class GestionBadgeComponent implements OnInit {
  public listAffect: any[];
  public isUser = false; //true si on affecte un user, false si on affecte une zone de contrôle
  public badgeId = 0;
  public labelSelect: string;

  constructor(
    private rondierService: rondierService,
    private route: ActivatedRoute,
    private router: Router,
    private popupService: PopupService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; //permet de recharger le component au changement de paramètre
    this.listAffect = [];
    this.route.queryParams.subscribe((params) => {
      if (params.isUser.includes("true")) {
        this.isUser = true;
      } else this.isUser = false;

      this.badgeId = params.badgeId;
    });

    if (this.isUser) {
      this.labelSelect = "Utilisateur : *";
    } else this.labelSelect = "Zone de contrôle : *";
  }

  ngOnInit(): void {
    if (this.isUser) {
      this.rondierService.listUserLibre().subscribe((response) => {
        // @ts-expect-error data
        this.listAffect = response.data;
      });
    } else {
      this.rondierService.listZoneLibre().subscribe((response) => {
        // @ts-expect-error data
        this.listAffect = response.data;
      });
    }
  }

  //Affectation du badge
  onSubmit(form: NgForm) {
    let typeAffect: string;
    if (this.isUser) {
      typeAffect = "userId";
    } else typeAffect = "zoneId";

    this.rondierService
      .updateAffect(this.badgeId, form.value["affect"], typeAffect)
      .subscribe((response) => {
        if (response == "Mise à jour de l'affectation OK") {
          this.popupService.alertSuccessForm("Badge affecté avec succés !");
          this.router.navigateByUrl("/admin/badges");
        } else {
          this.popupService.alertSuccessForm(
            "Erreur lors de l'affectation du badge....",
          );
        }
      });
  }
}
