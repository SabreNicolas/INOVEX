import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { loginService } from "../services/login.service";
import { Md5 } from "ts-md5";
import { PopupService } from "../services/popup.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  public nom: string;
  public prenom: string;
  public pwd: string;
  public MD5pwd: string;
  public login: string;
  public isRondier: number; //0 ou 1
  public isSaisie: number; //0 ou 1
  public isQSE: number; //0 ou 1
  public isRapport: number; //0 ou 1
  public isAdmin: number; //0 ou 1
  public isChefQuart: number; //0 ou 1
  public loginUsed: boolean;
  constructor(
    private loginService: loginService,
    private popupService: PopupService,
    private router: Router
  ) {
    this.nom = "";
    this.prenom = "";
    this.pwd = "temporaire";
    this.MD5pwd = Md5.hashStr(this.pwd);
    this.login = "";
    this.isRondier = 0;
    this.isSaisie = 0;
    this.isQSE = 0;
    this.isRapport = 0;
    this.isAdmin = 0;
    this.isChefQuart = 0;
    this.loginUsed = false;
  }

  ngOnInit(): void {
    this.nom = "";
    this.prenom = "";
    this.pwd = "temporaire";
    this.MD5pwd = Md5.hashStr(this.pwd);
    this.login = "";
    this.isRondier = 0;
    this.isSaisie = 0;
    this.isQSE = 0;
    this.isRapport = 0;
    this.isAdmin = 0;
    this.isChefQuart = 0;
    this.loginUsed = false;
  }

  //création de l'utilisateur
  onSubmit(form: NgForm) {
    this.nom = form.value["nom"].replace(/'/g, "''");
    this.prenom = form.value["prenom"].replace(/'/g, "''");
    this.login = form.value["identifiant"].replace(/'/g, "''");

    //GESTION DES DROITS
    const rondier = document.getElementsByName("rondier");
    const saisie = document.getElementsByName("saisie");
    const qse = document.getElementsByName("qse");
    const rapport = document.getElementsByName("rapports");
    const admin = document.getElementsByName("admin");
    const chefQuart = document.getElementsByName("chefQuart");

    if ((rondier[0] as HTMLInputElement).checked) {
      this.isRondier = 1;
    } else this.isRondier = 0;
    if ((saisie[0] as HTMLInputElement).checked) {
      this.isSaisie = 1;
    } else this.isSaisie = 0;
    if ((qse[0] as HTMLInputElement).checked) {
      this.isQSE = 1;
    } else this.isQSE = 0;
    if ((rapport[0] as HTMLInputElement).checked) {
      this.isRapport = 1;
    } else this.isRapport = 0;
    if ((chefQuart[0] as HTMLInputElement).checked) {
      this.isChefQuart = 1;
    } else this.isChefQuart = 0;
    if ((admin[0] as HTMLInputElement).checked) {
      this.isAdmin = 1;
    } else this.isAdmin = 0;

    this.loginService
      .createUser(
        this.nom,
        this.prenom,
        this.login,
        this.MD5pwd,
        this.isRondier,
        this.isSaisie,
        this.isQSE,
        this.isRapport,
        this.isChefQuart,
        this.isAdmin,
      )
      .subscribe((response) => {
        // console.log(response);
        if (response == "Création de l'utilisateur OK") {
          this.popupService.alertSuccessForm("L'utilisateur a bien été créé !");
        } else {
          this.popupService.alertErrorForm(
            "Erreur lors de la création de l'utilisateur ....",
          );
        }
      });

    this.resetFields(form);
  }

  resetFields(form: NgForm) {
    form.controls["nom"].reset();
    form.value["nom"] = "";
    form.controls["prenom"].reset();
    form.value["prenom"] = "";
    form.controls["identifiant"].reset();
    form.value["identifiant"] = "";
  }

  verifLogin(form: NgForm) {
    const login = form.value["identifiant"].replace(/'/g, "''");
    this.loginService.getLogin(login).subscribe((response) => {
      // @ts-expect-error data data
      if (response.data.length > 0) {
        this.loginUsed = true;
      } else {
        this.loginUsed = false;
        this.login = login;
      }
    });
  }

    goToAdmin() {
    this.router.navigate(["/admin"]);
  }
}
