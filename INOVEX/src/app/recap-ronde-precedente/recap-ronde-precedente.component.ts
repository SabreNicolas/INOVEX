import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { ActivatedRoute, Router } from "@angular/router";
import { addDays, format, subDays } from "date-fns";
import { rondierService } from "../services/rondier.service";
import { zone } from "src/models/zone.model";
import Swal from "sweetalert2";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import * as pdfMake from "pdfmake/build/pdfMake";
import * as pdfFonts from "pdfMake/build/vfs_fonts";
declare let $: any;
import jsPDF from "jspdf";
import { PopupService } from "../services/popup.service";
import { anomalie } from "src/models/anomalie.model";
import { HttpClient } from "@angular/common/http";
import { color } from "html2canvas/dist/types/css/types/color";

//@ts-expect-error data
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-recap-ronde-precedente",
  templateUrl: "./recap-ronde-precedente.component.html",
  styleUrls: ["./recap-ronde-precedente.component.scss"],
})
export class RecapRondePrecedenteComponent implements OnInit {
  public listAction: any[];
  public listEvenement: any[];
  public listZone: any[];
  public listConsigne: any[];
  public listActu: any[];
  public listAnomalies: anomalie[];
  public dateDebString: string;
  public dateFinString: string;
  public quartPrecedent: number;
  public user: string;
  public userPrecedent: string;
  public localisation: string;
  public quart: number;
  public idEquipe: number;
  public nomEquipe: string;
  public listRondier: any[];
  @ViewChild("pdfTable") pdfContent!: ElementRef;
  public paprecB64 : any;
  public listZoneRemonter: any[];
  public listElements: Map<string, string>;

  constructor(
    public cahierQuartService: cahierQuartService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    private rondierService: rondierService,
    private router: Router,
    private http: HttpClient
  ) {
    this.listAction = [];
    this.listConsigne = [];
    this.listZone = [];
    this.listEvenement = [];
    this.listActu = [];
    this.listAnomalies = [];
    this.dateDebString = "";
    this.dateFinString = "";
    this.quartPrecedent = 0;
    this.quart = 0;
    this.idEquipe = 0;
    this.nomEquipe = "";
    this.listRondier = [];
    this.user = "";
    this.userPrecedent = "";
    this.localisation = "";
    this.listZoneRemonter = [];
    this.listElements = new Map();

    this.route.queryParams.subscribe((params) => {
      if (params.quart != undefined) {
        this.quart = params.quart;
      } else {
        this.quart = 0;
      }
      if (params.idEquipe != undefined) {
        this.idEquipe = params.idEquipe;
      } else {
        this.idEquipe = 0;
      }
    });
  }

  ngOnInit(): void {
    //Récupération de la date de début et de la date de fin en fonction du quart
    if (this.quart == 1) {
      this.dateDebString =
        format(subDays(new Date(), 1), "yyyy-MM-dd") + " 21:00:00.000";
      this.dateFinString = format(new Date(), "yyyy-MM-dd") + " 05:00:00.000";
      this.quartPrecedent = 3;
    } else if (this.quart == 2) {
      this.dateDebString = format(new Date(), "yyyy-MM-dd") + " 05:00:00.000";
      this.dateFinString = format(new Date(), "yyyy-MM-dd") + " 13:00:00.000";
      this.quartPrecedent = 1;
    } else {
      this.dateDebString = format(new Date(), "yyyy-MM-dd") + " 13:00:00.000";
      this.dateFinString = format(new Date(), "yyyy-MM-dd") + " 21:00:00.000";
      this.quartPrecedent = 2;
    }

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

    //Récupération des zones devant être remonté sur le récap pour la ronde précédente
    this.cahierQuartService
      .getZonesPDF(this.dateDebString)
      .subscribe((response) => {
        this.listZoneRemonter = response.data;
        let dateFR = this.dateDebString.substring(8,10)+'/'+this.dateDebString.substring(5,7)+'/'+this.dateDebString.substring(0,4);
        //On va maintenant récupérer les elements de controle des zones ainsi que leur valeur sur la date et le quart
        this.listZoneRemonter.forEach(zone =>{
          this.cahierQuartService
          .getElementsPDF(zone.Id, dateFr, this.quartPrecedent)
          .subscribe((response) => {
            response.data.forEach((elem: { nomZone: string; nom: string; value: string; }) =>{
              this.listElements.set(elem.nomZone+"__"+elem.nom, elem.value);
            });
          });
        });
    });

    // Récupération des zones pour la ronde précédente
    this.cahierQuartService.getZonesCalendrierRonde(this.dateDebString, this.dateFinString).subscribe((response: any) => {
      this.listZone = response?.BadgeAndElementsOfZone ?? [];
    });

    //On récupére la liste des consignes de la ronde précédente
    this.rondierService.listConsignes().subscribe((response) => {
      //@ts-expect-error data
      this.listConsigne = response.data;
    });

    //Récupération de l'id de l'équipe pour la ronde si l'équipe est déjà crée
    this.cahierQuartService
      .getEquipeQuart(
        this.quartPrecedent,
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
                    heure_fin: response.data[i]['heure_fin'],
                    heure_deb: response.data[i]['heure_deb'],
                    heure_tp: response.data[i]['heure_tp']
                  });
                  if (response.data[i]["poste"] == "Chef de Quart") {
                    this.userPrecedent =
                      response.data[i]["prenomRondier"] +
                      " " +
                      response.data[i]["nomRondier"];
                  }
                }
              }
            });
        }
      });

    this.cahierQuartService.getOneUser().subscribe((response) => {
      //@ts-expect-error data
      this.user = response.data[0].Prenom + " " + response.data[0].Nom;
    });

    this.cahierQuartService.getOneLocalisation().subscribe((response) => {
      //@ts-expect-error data
      this.localisation = response.data[0].localisation;
    });

    const dateFr =
      this.dateDebString.split(" ")[0].split("-")[2] +
      "/" +
      this.dateDebString.split(" ")[0].split("-")[1] +
      "/" +
      this.dateDebString.split(" ")[0].split("-")[0];

    this.cahierQuartService
      .getAnomaliesOfOneRonde(dateFr, this.quartPrecedent)
      .subscribe((response) => {
        //@ts-expect-error data
        this.listAnomalies = response.data;
      });

    //transformation logo paprec en base64
    //TODO POUR LES SIGNATURES AUSSI
    this.http.get('assets/paprec.png', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.paprecB64 = reader.result;
        }
        reader.readAsDataURL(res);
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.createPDF();
      } else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm("La prise de quart a été annulée.");
      }
    });
  }

  async toBase64ImageUrl(imgUrl: string): Promise<string> {
    const fetchImageUrl = await fetch(imgUrl);
    const responseArrBuffer = await fetchImageUrl.arrayBuffer();
    const uint8Array = new Uint8Array(responseArrBuffer);
    const binaryString = Array.from(uint8Array)
      .map((byte) => String.fromCharCode(byte))
      .join("");
    const base64String = btoa(binaryString);
    const toBase64 = `data:${fetchImageUrl.headers.get("Content-Type") || "image/png"};base64,${base64String}`;
    return toBase64;
  }

  // Fonction pour redimensionner l'image tout en conservant les proportions
  resizeBase64Img(base64: string, maxWidth: number, maxHeight: number) {
    const img = new Image();
    img.src = base64;
    let width = img.width;
    let height = img.height;
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio;
      height = height * ratio;
    } else {
      width = maxWidth;
      height = maxHeight;
    }
    return { width, height };
  }

  
  //**************** */
  async createPDF() {
    //this.listElements = new Map();
    let quart = '';
    if (this.quartPrecedent === 1) {
      quart = 'Matin';
    } else if (this.quartPrecedent === 2) {
      quart = 'Apres-midi';
    } else {
      quart = 'Nuit';
    }
  
    // Formatage direct de la date et de l'heure
    const date = new Date(this.dateDebString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
    //tableau de l'équipe
    const tableHeader = [
      [
        { text: 'Poste', style: 'tableHeader', alignment: 'center' },
        { text: 'Nom / Prénom', style: 'tableHeader', alignment: 'center' },
        { text: 'Heure Début', style: 'tableHeader', alignment: 'center' },
        { text: 'Heure Fin', style: 'tableHeader', alignment: 'center' },
        { text: 'Travaux pénible', style: 'tableHeader', alignment: 'center' }
      ]
    ];
  
    for (let rondier of this.listRondier) {
      tableHeader.push([
        { text: rondier.Poste || '', style: 'tableCell', alignment: 'center' },
        { text: `${rondier.Nom || ''} ${rondier.Prenom || ''}`, style: 'tableCell', alignment: 'center' },
        { text: rondier.heure_deb || '', style: 'tableCell', alignment: 'center' },
        { text: rondier.heure_fin || '', style: 'tableCell', alignment: 'center' },
        { text: rondier.heure_tp || '', style: 'tableCell', alignment: 'center' }
      ]);
    }

    //tableau des zones à faire remonter
    const tableZones: any[] = [];
  
    if(this.listZoneRemonter.length > 0){
      this.listZoneRemonter.forEach(zone =>{
        tableZones.push([
          { text: zone.nom , style: 'tableHeader', alignment: 'left', color:'#5495d8', fontSize:'15' },
          { text: '', style: 'tableHeader', alignment: 'left', color:'#5495d8', fontSize:'15' },
        ]);
        this.listElements.forEach((value: string, key: string) => {
          //si l'element se trouve dans la zone
          if(zone.nom === key.split("__")[0]){
            tableZones.push([
              { text: key.split("__")[1] , style: 'tableCell', alignment: 'center' },
              { text: value, style: 'tableCell', alignment: 'center', color:'#1b253' },
            ]);
          }
        });
      });
    }
    else{
      tableZones.push([
        { text: 'Pour faire remonter une zone, veuiller ajouter " - PDF" à la fin du nom de zone ' , style: 'tableCell', alignment: 'left', color:'#5495d8', fontSize:'10' },
        { text: '', style: 'tableCell', alignment: 'left', color:'#5495d8', fontSize:'10' },
      ]);
    }
  
    const tableAnomalies: any[] = [
      [
        { text: 'Zone', style: 'tableHeader', alignment: 'center' },
        { text: 'Commentaire', style: 'tableHeader', alignment: 'center' }
      ]
    ];
  
    for (const anomalie of this.listAnomalies) {
      const zone = this.listZone.find(z => z.zoneId === anomalie.zoneId);
      const zoneName = zone ? zone.zone : 'Zone inconnue';
      tableAnomalies.push([
        { text: zoneName, fontSize: 10, style: "tableCell", alignment: 'center' },
        { text: anomalie.commentaire, fontSize: 10, style: "tableCell", alignment: 'center' }
      ]);
    }
  
    // Filtrer les zones contrôlées (en vert)
    const controlledZones = this.listZone.filter(zone => zone.termine);
  
    // Récupérer les éléments des zones contrôlées
    const elementsOfControlledZones: any[] = [];
    for (const zone of controlledZones) {
      for (const element of zone.elements) {
        elementsOfControlledZones.push([
          { text: element.nom, fontSize: 8, style: 'tableCell', alignment: 'left' },
          { text: element.value, fontSize: 8, style: 'tableCell', alignment: 'left' }
        ]);
      }
    }
  
    const pdfContent: any = {
      content: [
        {
          columns: [
            {
              image: this.paprecB64,
              width: 120,
            },
            {
              text: `Registre de quart :\n${this.localisation || ''}`,
              bold: true,
              fontSize: 18,
            },
            {
              text: `Date: ${formattedDate}\nQuart: ${quart}`,
            }
          ]
        },
        { text: '\n' },
        {
          width: 'auto',
          table: {
          headerRows: 1,
          body: tableHeader
          },
          layout: 'lightHorizontalLines'
        },
        { text: '\n' },
        {
          width: 'auto',
          table: {
            widths: ['*', '*'],
            body: tableZones
          },
          layout: 'lightHorizontalLines'
        },
        { text: '\n' },
        {
          text: 'Consignes :',
          style: 'subheader',
          color:'#5495d8', 
          fontSize:'15',
          alignment: 'center',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listConsigne.map((consigne: any) => `${consigne.titre} - ${consigne.commentaire || 'Pas de description'}`) || "Pas de consignes..."
        },
        { text: '\n' },
        
        {
          text: 'Actions :',
          style: 'subheader',
          alignment: 'center',
          color:'#5495d8', 
          fontSize:'15',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listAction?.map((action: any) => ({
            text: `${action.nom}`,
            color: action.termine ? 'green' : 'red'
          })) || "Pas d'actions..."
        },
        { text: '\n' },
        {
          text: 'Evenements :',
          style: 'subheader',
          alignment: 'center',
          color:'#5495d8', 
          fontSize:'15',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listEvenement?.map((evenement: any) => {
            const demandeTravauxText = evenement.demande_travaux == 0 ? 'Aucune demande' : evenement.demande_travaux;
            return `${evenement.titre} - ${evenement.description || 'Pas de description'} (${evenement.date_heure_debut} - Cause: ${evenement.cause || 'Non spécifiée'} - Demande de Travaux: ${demandeTravauxText}`;
          }) || "Pas d'evenements...."
        },
        { text: '\n' },
        {
          text: 'Zones contrôlées :',
          style: 'subheader',
          alignment: 'center',
          color:'#5495d8', 
          fontSize:'15',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listZone?.map((zone: any) => ({
            text: `${zone.zone} - Contrôlée par : ${zone.prenomRondier} ${zone.nomRondier} (${zone.termine ? 'Terminé' : 'Non terminé'})`,
            color: zone.termine ? 'green' : 'red'
          })) || 'Pas de zones...'
        },
        { text: '\n' },
        {
          text: 'Actualités :',
          style: 'subheader',
          alignment: 'center',
          color:'#5495d8', 
          fontSize:'15',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listActu?.map((actu: any) => `${actu.titre} - ${actu.description || 'Pas de description'} (${actu.date_heure_debut} - ${actu.date_heure_fin})\n------\n`) || "Pas d'actualités..."
        },
        { text: '\n' },
        {
          text: 'Anomalies :',
          style: 'subheader',
          alignment: 'center',
          color:'#5495d8', 
          fontSize:'15',
          margin: [0, 5, 0, 2],
          width: '100%'
        },
        {
          ul: tableAnomalies.slice(1).map((anomalie: any) => ({
            text: `${anomalie[0].text} - ${anomalie[1].text}`,
            style: 'tableCell'
          }))
        },
        { text: '\n' },
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  text: 'CDQ SORTANT : '+this.userPrecedent,
                  style: 'signature'
                },
                {
                  image:
                    "data:image/png;base64,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",
                  width: 125,
                  height: 100,
                },
              ]
            },
            {
              width: '50%',
              stack: [
                {
                  text: 'CDQ ENTRANT : '+this.user,
                  style: 'signature',
                  alignment: 'right'
                },
                {
                  image:
                    "data:image/png;base64,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",
                  width: 125,
                  height: 100,
                },
              ]
            }
          ],
          margin: [0, 50, 0, 0]
        }
      ]
    };

    const pdfCreate = pdfMake.createPdf(pdfContent);
    pdfCreate.download(
      "Résumé quart du " +
        quart +
        " du " +
        this.formatDateTime(this.dateDebString),
    );

    //On récupère le blob pour créer un file que l'on va envoyer à l'API pour le stocker avec multer
    pdfCreate.getBlob((blob) => {
      const file = new File(
        [blob],
        "_" +
          this.formatDateTime(this.dateDebString).replace(":", "h") +
          "-" +
          quart +
          " - " +
          this.userPrecedent.replace("'", "") +
          ".pdf",
      );
      this.cahierQuartService
        .stockageRecapPDF(file, quart, this.formatDateTime(this.dateDebString))
        .subscribe((response) => {
          if (response == "Envoi mail OK") {
            this.popupService.alertSuccessForm("Le mail a bien été envoyé !");
          } else {
            this.popupService.alertErrorForm("Erreur envoi du mail ....");
          }
        });
    });

    await this.delay(1000);
    this.router.navigate(["/cahierQuart/newEquipe"], {
      queryParams: { quart: this.quart },
    });
  }
  //**************** */
  
  async createPDF_old() {
    let quart = "";
    if (this.quartPrecedent == 1) {
      quart = "Matin";
    } else if (this.quartPrecedent == 2) {
      quart = "Apres-midi";
    } else {
      quart = "Nuit";
    }
    const data = [{ text: "Rondier" }, { text: "Poste" }];

    const tableBody: any[] = [
      [
        {
          text: "Rondier",
          margin: [0, 0, 0, 0],
          fontSize: 10,
          style: "tableCell",
        },
        {
          text: "Poste",
          margin: [0, 0, 0, 0],
          fontSize: 10,
          style: "tableCell",
        },
      ],
    ];

    for (const rondier of this.listRondier) {
      tableBody.push([
        {
          text: rondier.Poste,
          fontSize: 10,
          style: "tableHeader",
          margin: [0, 0, 0, 0],
        },
        {
          text: rondier.Nom + " " + rondier.Prenom,
          fontSize: 10,
          style: "tableHeader",
          margin: [0, 0, 0, 0],
        },
      ]);
    }

    const tableConsgines: any[] = [
      [
        {
          text: "Consignes :",
          margin: [0, 0, 0, 0],
          fontSize: 10,
          style: "tableCell",
        },
      ],
    ];

    for (const consigne of this.listConsigne) {
      tableConsgines.push([
        {
          text: consigne.titre + " - " + consigne.commentaire,
          fontSize: 10,
          style: "tableHeader",
          margin: [0, 0, 0, 0],
        },
      ]);
    }

    const tableAnomalies: any[] = [
      [
        {
          text: "Anomalies :",
          margin: [0, 0, 0, 0],
          fontSize: 10,
          style: "tableCell",
        },
        { text: "" },
      ],
    ];

    for (const anomalie of this.listAnomalies) {
      const base64 = await this.toBase64ImageUrl(anomalie.photo);

      const { width, height } = this.resizeBase64Img(base64, 500, 500);
      tableAnomalies.push([
        {
          text: anomalie.commentaire,
          fontSize: 10,
          style: "tableHeader",
          margin: [0, 0, 0, 0],
        },
        { image: base64, width: 300 },
      ]);
    }

    const tableActions: any[] = [
      [
        {
          text: "Actions :",
          margin: [0, 0, 0, 0],
          fontSize: 10,
          style: "tableCell",
        },
      ],
    ];

    for (const action of this.listAction) {
      if (action.termine == 0) {
        var color = "lightcoral";
      } else {
        var color = "lightgreen";
      }
      tableActions.push([
        {
          text: action.nom,
          fontSize: 10,
          style: "tableHeader",
          margin: [0, 0, 0, 0],
          fillColor: color,
        },
      ]);
    }

    const tableEvents: any[] = [
      [
        {
          text: "Evènements :",
          margin: [0, 0, 0, 0],
          fontSize: 10,
          style: "tableCell",
        },
      ],
    ];

    for (const event of this.listEvenement) {
      if (event.importance == 0) {
        var color = "lightgreen";
      } else if (event.importance == 1) {
        var color = "lightsalmon";
      } else {
        var color = "lightcoral";
      }
      if (event.equipementGMAO != "" && event.demande_travaux != 1) {
        var text =
          event.date_heure_debut.split(" ")[1] +
          " - " +
          event.titre +
          " -- " +
          event.description +
          " - " +
          event.equipementGMAO +
          " - " +
          event.demande_travaux;
      } else {
        var text =
          event.date_heure_debut.split(" ")[1] +
          " - " +
          event.titre +
          " -- " +
          event.description +
          " - Pas de DI";
      }
      tableEvents.push([
        {
          text: text,
          fontSize: 10,
          style: "tableHeader",
          margin: [0, 0, 0, 0],
          fillColor: color,
        },
      ]);
    }

    const tableRonde: any[] = [
      [
        {
          text: "Zones :",
          margin: [0, 0, 0, 0],
          fontSize: 10,
          style: "tableCell",
        },
      ],
    ];

    for (const zone of this.listZone) {
      if (zone.termine == 0) {
        var color = "lightcoral";
      } else {
        var color = "lightgreen";
      }
      tableRonde.push([
        {
          text: zone.zone,
          fontSize: 10,
          style: "tableHeader",
          margin: [0, 0, 0, 0],
          fillColor: color,
        },
      ]);
    }

    const tableDateQuart = [
      [
        {
          text: "Date : " + this.formatDateTime(this.dateDebString),
          fontSize: 10,
        },
      ],
      [{ text: "Quart : " + quart, fontSize: 10 }],
    ];

    const tableSignature = [
      [{ text: "Signature CDQ :", fontSize: 10 }, { text: "" }],
      [
        {
          stack: [
            {
              text: "Sortant : " + this.userPrecedent,
              fontSize: 10,
              margin: [0, 0, 0, 0],
            },
            {
              image:
                "data:image/png;base64,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",
              width: 125,
              height: 100,
            },
          ],
        },
        {
          stack: [
            {
              text: "Entrant : " + this.user,
              fontSize: 10,
              margin: [0, 0, 0, 0],
            },
            {
              image:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWYAAADVCAYAAABkD1p5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACHMSURBVHhe7Z3ZyyXFGcbL3MfoH6CY22iIC0hcwBlQoyCouOKNa8bL0Si5dCNXiUbNnZO4zI24okLAFUZBkxDQCUS9HTXeu/0BX/pnV2FP2326ll6qu54flJ4+852tz+mn3nrqfatO2KswQgghsuEn9v9CCCEyQcIshBCZIWEWQojMkDALIbbN11/XbUVImIUQ2+Xqq435+c+NeeYZe8c6UFaGEGK7IMqffWbMSScZ89VX9s78UcQshNgm775rzJln1rexMjheCRJmIcQ2ee01Y1591R5UHD5sb+SPrAwhxHog6t23zx4MQJR88sn2oGJFdoYiZiFE3vznP8Y88IAxZ51lzP79tWfsA0J82mn2oAKhXskkoIRZCJEfTkQRY9qDD9YCDdz25f777Q3LSuwMWRlCiDxAjBFfxBNvmOMuQiyJtp0Bx44dH0lniCJmIcSy4Bs3rQoi5T5RRlAPHuz/9zaI+C232ANLc0IwUxQxCyHmB2FFgImOnUXRB+LKhB+2BMLMcQgIMYUmjpCIeyEkzEKI+UGUb73VHnSAeJKDfOWVdcQbKsZtXKGJI3M7Q8IshJifLu8XnBhfddUPxSFjcPfdxjz2mD2oQOyfftoe5IeEWQixDETMRM5EwwjlzTePK8ZN2h1B5naGhFkIsQxM+mEvEB2nWhU+tO0MIub2xGAmSJiFEGXQ9rXpEF55xR7khdLlhBBlgBA75ojQE1DELIQoBzcBOEamx4RImIUQIjNkZQghRGZImIUQIjMkzEIIkRkSZiGEyAwJsxBCZIaEWQghMkPCLIQQmSFhFkKIzJAwCyEEq8+xi4rvRq8TI2EWQqTxv//ZGyuE3VPY0oqV59jk9fHH7T8si0qyhRDhvPOOMS++aMwHHxjz8cf2zhXihNmRyTrNipiFEH589JExDz1kzBlnGHPJJcYcOmTMHXfYf1wpLMzf3GIKSyODzVolzEKI3bAi2+WXG3POOfWGqJ98Ut9/yinG3HVXfXvNNJcDhddeszeWQ1aGEOLHYFX87W/GvP66Md9+a+9s8eij2xDmDLedkjALIX7MCSfYGz0QLX/xhT3YAPjM+M2OhbedkpUhxNwQobHf3dVX19kAuUG0PMTvfmdvbISDB+0Ny+HD9sYyKGIWYi4QY/xL9p5DnB3Hjh0/AbU0Tz1lzO2324MOthYtQ9vOgAW/F0XMQkwJBQsULjBU3r+/nkhrijKQP5sTn35qb/SwtWgZ8JXb1sWC2RkSZiHGBuHlokaMaQhv079sgiC0hXppvvzS3uhgrEyMHItSbr7Z3rAs2GFKmIUYC6yKu++ufWP8Y8S4T3T37auzGhgu57aF/i5hTo2WX37ZmBtvrHOhuZ0TfCftnOaFSrTlMQsxBgjx0NCX6JhJJvJmKWzIlb6MjFhvmcKUZ5815oUXjo+Ub7jBmOeesweZQMfqdtIG7A0yNGZGwizEGHAxc1G3QYwRYaJjojGOcwYRpZCki5C8ZQSYiPill+qy7S5OPLEu50bwc4EoOYOcZgmzEGPQvqAZFl95ZR1x5S7GTRDTa6+1Bw18o2UyOt56y5jnn7d3DJBjkQpWVNPCwGpqVwdOjDxmIcYA8UVgKFk+etSYI0fq4zWJMrhyawdR7YEDu20aouw77zTm1FPrNDtfUYY337Q3MoLvkO+NTpXvcmZRBkXMQrQh+sWa4MLMKb94DhBYFifC/730UmNuu83+QwtnVVC23RbzUD780Jizz7YHmcBvYMFOVcIsBHAhkkXBerxkV3C80MTPoiC2557b7/tiVbDc5xtv2DtGgLS0++6zBwIkzKJs+qrxgIgpg7V5F8etvUwGRd+CRinEZntsGAmzKA9nVSDIfYUfjoUXs1kMrAo+OyluqVaFD2+/bczFF9sDIWEWZYAYEx0zbGbGvR0dNyFSJsWNSjAmftY2gZcCHRYTcmNaFT7kmNO8IBJmsW0QYXzjLquizVpT3FLxWXt5KoYmGQtFwiy2DWLcXjWsCQK8hmq8sSHF7e9/rwV57nUrTj+93pLqmmvyKi7JCAmz2D633lpHzA5nVZCvyv9LiY5ditsSVgUCzPZUpOPllhqXIRJmsX0QZcS5VKsCMSarYm6rguIUxPi66+roWHgjYRbrA984tPCD7IuSrAoHwjh3dHzBBXVZ91atCuyxiTt2lWSLdcDFQMaAW+N4aCKvTYmiDOedZ29MDAJ8zz11Fd/779fl6FsSZYIBt+EBbWIUMYt8QXzb1XiOUvOLQ8FXZg2LKXBWBRN5W85B5neHGDcXNpp42ylFzCI/mgvOsx0TC+i0I+SFN8tcFMqiH3rIHgxA1HrZZfZgJHg+VoX75ps693jrhSHYFu2FjAgWJkQRs8gDhNe3Gs9dKCWtY0F62xNP1BN4Lr3Nd/Gfoc1VfUDgiYyvuGL8rAqXR83azLQc4TfZtDD4DU5Zro8wC7EIX321t3fkyN7emWfu7Z10EhFCf+Pf9+3b23v66fpxJfDFF3t7jz66t3f66d3n5MEH7R96cOKJ3c/h2264wT7RSHz4Yf3+Tznl+Nd58kn7Bxly2mnHv1d+ixNRPbsQC3HLLcf/0LsaYnz//Xt7x47ZBxUA4nTZZd3no9kQNV8OHOh+Dt+GsI8BHc2uzzZ2BzAmd911/Hvl9zsRsjLEcuAds1deG4aJpVXjxa7g5rv4D89/ySX2IJLY3UZC86hZaS7HjA7stva2U0wC8v+x+V6ehVgKNzx0VsUrr5RjVTguuOD4SCykhUSYbdsgtBHp+oJVcc89ca9JVJ0r/Eab73UiO0MRs1gWt7hQadV4TdjOP2Q7piakrJEd4QOZHJShp7BrwtGVfO/agNUH1tLIdRLQVZE6GNGx/dTISJjFODBrjTXBD7WdWiR2g5h1bYDqy5NP+q3OtmsHbF+6dhsJ3YDVhxy3m4K2nQET5DQrj1nE41LcXDUUF23XFv5iN6mly/i3PiB0qTnNLJwPKRuw+kBqYI4wqmsXNu3aqDYSRcwiDMSY6JgCj67CD5i4KmqT3HuvMY88Yg8i8J0woyNN7TyxGqbe1YTPkut2UxRAUfjkQKxHzmlWxCz8aFfj7Vp4foIIYvPcdJO9EYlvsQ1ZFfjSKcyx1RTMvU60L6xS2Aw8uA6a5dojIGEW/fCDcwu3IMZEW31i7IZ4TITEpFSVDjYDq7LF4iwGH1jfIkfoMA4cqFMAc02Zc7TnUbDxRkTCLH4M4osYEx3zg+srkUaMiR6I1rAv+P/W846J4uigzjij9lfJDx6LlAlAoljf98L6yDmB780EJtkleMtrWHujmd3CNfCrX9mDcZDHLLpBlPuGZ/wQL7qojpBL8ZJ3ZR6w3OXDD9uDBFJXgiPa9J0043WWtArwqa+/vk49yzky3gUdNNfCBMGIhFl0g5/MD8/hrAp2ji6tGq+5cFAf2BB/+Ut6itdcOc2pk40xIMBuR5Otr0iXiIRZdIOdQdSMCFMeTWSAOG8dBBhLBs82dJILYaRsOWXH59SV4ObMafZFO2EHI2EuAUQWnxhxDYHHlSDGgCASHY+xDROe6aFD8UP0FJsBEWS9DR8uvDCtQm8X2gk7CQnzlnHVeG6NY+UXd5Pq7XaBGBE9x2xCSuEGwh7LnDnNTXhNfGNS/3Ks2lsREuatQZSLGLPDQjubAo+4pMXlQ5hq09KYicFUm8F3FbgxOiTsG+cbayfs0VC63BZAjCkAYYYbX5j/d6W4qfCjn6lSyJhgI7UOsfWFaBMrIBZ2A/GBCBfrI4Wf/ay2TqYWZc4fE5Z0JM1J6a1CxCxWCrt/sIh8e2eFrsbf8LelLakZQuouH7sazx2ynCV/2/U8vo1lN31gUf6ux4e0qXYdcTu4tJdFZUeXjVN9SrEqEFYElu2Ymj/WrsYax+yycPSoBNkH1jbuOo9jNtY0RnCG4G+6Hu/b2LHEl9R1msfedeSll+rn3NVR+nY8K6X6hGJVDEVSbsF5/k5iHMbbb3ef07EbQoj4DOGzvVRfm3PbKZpPZ7MLhJb34dtJsAj/hqk+oVgViG3XD5UIurS98aYgNXoMaUPikmoz+Ig/IIpdjw9pITaNY2iz2V0tpOOZE65PLEb2B0y4FqtPKFbHVVfVP06iY34AWBUlgeC4lhqptWHn5rYITNkQJSL1PlJ87xCLIUYcmw0f2Bc6nDFsI9+OZy7YFq1pMcZ0Vpbq0WJ10COXsjceFx+RJRf+LpHi3/m7VO9xjOgxtPG56BC6SLEZeF7fjmvIIvNpu849nU+IVeHTxva2U2H/v+b7Y8I9kurRYjHckIcmatzwNsVfRaRToqmU105pXRODqb63b9TG63Y9PqS1rRmekw4nNRrvayEdzxwQKDGKbb7HSDujeqSYFWyHdlYFX2bppIpxVyOiirlwx4geYxti0+5UUoQtxGJIPf/O98WqmKtz8+145oIgq/n+IoOu6pFicuhJGebsSnGbaBv0rHEz8bssitSGWOzycLtAzKd8Tz6N8+JI9b197Z0xcprnPm8hHc8cEHg1319k0FU9UkyCm50lj7g9vOlqJdkZRIRz2gWIRag4jzE5ldrcxGCq7x2SWrZ0hxTachNmaBd8RQRd1aPEqMRU45WSVYHAzCnIzRYqznQeXc8zd+N9EzGnnLeQ1LKUyca5Gp9njIneqWhbYQRngVSPEqPhW41Hultp1XhcSF3nY84WKs5jZhCkttRI1vdz83ddj1+68fkZxaRM6s4F13XzvXPNB17r1aPEaNAzNr+Q5hdTajUeF/pUs/IxjffiOyGYQ2cyVgtJLcvp+2KkwHWTU/aFD67WwLXAScrqEWI02nmMrhqvtAIQBz/G1EhvzEYEHBJxpXq7iGEun5/34cvcRTbtxvfEe8jVqvChSwsCqB4hRgXfmIm8UsXY0fbZlmyIUsgEWBMml7qe06fxWCK9pXz1dvON2lI7pJjmrIoQqyln2nYGLSCnufpr0Qknlom80qyHMchJlLnYU4bBqZ/FRX1EgEtHz3QQvszVmTirYou0rc2Az1n9tTgOV43nUtxKzC9OgYgnh+E7PukYE0WIetfz+7ZmpI5IL+3f+toDU3aunAM6qrX5xqGgJc3PjaZ4oq2l4LPPjHnmmR/2xmvCLtFHj9oDsRO2KmIb/9iNRJuwZdH55x+/k8d33xnz+uu7n5/HPfig39ZKvtx4ozHPP28PAmGXEPbga8JOHOxssgScm/vuswcDsDvJt9/ag0T4XjiP7BRz8cX2zgJgRyH0BdjY+MiRWlOG+F6eSwSLgmgYU95Fx31NS2n6MUYOLL7s0I4YRHNdUTmvP0UUNsXym9y3RDoe0aov2EBdzxHSsCqGvs8tw+g7IiOrOnMF4XzjplWxq2nBeX8Qmq5z6NsQ2pALGAF2tgBiPvWkUYqI9qWq8RmWmBj0PVf8XdfjhxrfC9fN1q2KCanOYgEQ8bYXDuprpVXjjUVK9gIXckxqFBd+SjSG8CAgPqSMBuh0dtE3ApiqNdfhGMK3Q+LveN6Y73GNTBysVWe0AFi7uOvH5BrRc2nVeIgagtAXzYUQG1nREKQ5L2Zei4mnpuD4vD5/03zfoW2oA+D5Uzq3kDbUUTQZymnm91OKVeFG3GgFmuHbqUdQndlC6Fq7okSrgouo7R2mXlgpXuSEP+7j4HX6bAPExwdnncQ0XtuHuaoNfb/zrg6JDoTzWYpV0Wd/BhaNhFA9eyFwYt3JLM2q4OJimNk3LE2NmmOH4SETUTHge/PZht4f58WHoehxqPlE5sAIxNdCiG2+HQUgxLwfOg3fz7B2fO3PiRIDqmcuBKLiksSYaAYh8YnyEK7Y6Cdl0m+KaBnhQEBChc1nQoxz1PVY3+YbmQOvlTIS8Wm+33nsb2NtoBFu376h5AD+nRH3RJpSvcKKcB4PJ27CYcSqYYgaM9MfK5IpQ++xoi+Eg/ef4tH6ToilZFH4RuZN+D5jRyRDLaSj2DIZZmpVr7QC+k6c8ot/gIss5QJG1GJIEapUuvzy2Ma584HX7Hq8b/OJzNvQgU0xMTi1lbQG0Jauc9Ns6M7M9mf1qpni4/Eg1qIm1f+kxUSwKYIRA+9xl1+e0nwnxFI6wBQ/f4zv2DXOnyLmmq7EgKZVsUByQPUOMiLU4yFtRdSk+p+05roOvnQ9j28LgeFjSlaET/OdEKNj6Hq8T/ONzPsg4o49D7w2HUNM1L5lXGIALZNMreqdLIzzjTPzeFZJiq1Ai/FAu57Ht4UwZrS4q/lMdCFsXY/1bb6ReR+8x5DOgd8F14zoBi3JLFOr+tYWgpPgk45CW8DjWSWp/ieta12HXXQ9h28Lme3Hwuh6jrGb7/A+JXr3jcyH4Pvus1V4f3yWkHO8dpzAbmAkXX2DC9EcPnQ1Z1Us5PGslhT/kxbqgXY9h28L7QRSRwQ+zXdCLDWCH0sweR53XvjuiaRLsirciNtV47nzu/LEgOoTLAQnzp3EZpNVkUaK/0kL9UC7nsO3hXra/C66nmfs5iNsqRH82BNvoZ3c2hmyPyN2ps6J6hMsSHs2lGGISCPV/6SF+JEp2RG+0WmT1BGBT6Nz8yElgo/57KXjrAof+xNtWTE/scsyL8PBg/aG5fPP7Y0N8vLL9QLpl19uzIUX1ouQn3BC3bjNfSwk/thjaQvNswh5c3H5GN58097w4NRT7Y0IPvkk/LNy/qaGxfh9+M1v7I0I+OzvvGMPRC9ff23Mq68ac9ZZ9aLzLPTf3szCwUL0+/YZ8/TT69/cwgr0MtADuh7OWRhbgaEuw9XYPF+83pi8Ykj1P2m+r51qnYQO6YdGBETUnDuG9imjhzlymn0j81IhOi40U6v6VAvDLiJbybZgIoYfSMqMfbNx0cd0VmNkMPgKJu+v6/G+LWZI32Wf9KWExX4XvpOg/F3X431aTHpiSexKENh4plb1CUUyCCEX6FT+p69INEnNYPAVjTE8bZ/JtiZufQ7eIx3Irug+ZfTgkzmR+vlTc5q3THNETUOMiY4LyNSqPq2Ixgly88czVQsV59RIluYrmCkTgLTQz8Z5931vKaMH39FKyueP6XRLgom+AjO1ql+GCIZIKtVbjWmh6WWpEbyvBzpG57Qr6k2B7yr2PPjaLDEr7PVZL1uGFLdQcS1IjJtUvxARxK5qqzlaSL5qqmDyOX0Yo+IQoRobRDnF7/f9/L5RuY/1sjUQVjogl+K28vziuajOlPBmiSi53bi4fbxPGMP/9fVAU+0M2thFEqlLZYa8n77XQtzpIEN99DWDGHdV49E4FoNUZ0p4McZwfawWYmmkCqZvJBsznG83RMy309kFz5E6+Rmaytb29Hn90ib2fBcjIxNL7KQ6S2KQnESZyCwkkhtDMH3EMmWSrdmwHlLEmfeRYl/QOMeh8J55HFbFGJ3LWiA69q3GQ7CxMrQY2SDV2RI7SUm3GrPROcR4k2MIJufAh7E6sFhx5n2m+v8hVlGpOKsCMR6Kjvl3siqIkgudyIuhOnOilxSP1k30tL1Fhre+3ifPQcSbKhS+r9fXfLMTxoqaaXx235EBNkKqZUND1EvygmNBYLvOX7MhxkTS2v4tihP4j63Ozot33zXmtdfq9TROO83eOTOsX/HBB/bAkxNPrOv577rL3tED62I8/7w9aMFaF3fcMfwcvrD+xt1324NI3n67XodjiDvvNObQIXswAqecYsz11xtz3nn2DgtrTXz6ab2uxbff2jsT8f2MwphbbzXmmWfsgYW1Krher7rKmDPPtHeKKL6X55xwW0u5nnepXE+iNfcefFtoxNUe+jNhNHZmAhBxpw7xfSfDxnitJVppOcWpYE1w3pxVwXUrq2I0qjObGXzBzQuGL34JYvzSkGwJQMSwCRC9GP84hFT/F6vAlzHymudsEuVwEGH5xpORp5XB8n6ffWYPKo4dm9/OYCnO0CHySy8Zc8019iAzWHb02mvtQSRPPmnMbbfZgwF2WTW5gO301FP5fmdzwBKaLKv53nvGHDli7xRLs+x6zH3gUTXBs50T1skdy7fMBcQHvzaFt96yNzz405/S14WeEt4bnVWJoswax8w7sMYxjeuLOZ22ZywWI8+ImR/OySfbgwomFb76yh7MQGx0ec89xjz8sD0IhNfcxbnnpgvrGBNzX3zh/z5YBP+CC9IW/p+CG26oO47U87kmuKaIjg8friNkjtuwyLyi5izINyujbWewK8Ett9iDiXnoIWPuv98eBII433STMWefbe+oQJj+/e/6/19+WWcUfPddLXIhosXQ+/zz6wwFZsVDheWjj4w55xx7EMmjj4ZlizD6ICrNYQTC+eL9lxQlu+wmouEuMW5CJgXCTCAklgVhzhI36+vanFuS51JUMtRiik5Sq+J8c5qbkKmS+ropjSyR0InZNcOEnKrxVk31zWRKVxL7XMnqMalySzVEJySrgL/tep6QFpNBQgZKaqFLaHOCnFqgsyZ8tmNSNV725Dn5Bwyn2tYF3tgckJGxFrAIKB4hC8KHMYbxzz5rbwSAjfD++/VEE5bMlDjL4uOPa8+/JC8ZO6LPssBDxqJjo1IsC64v2RZ5YgU6T5bMaR6jxHfu5lsEMmdOcxdE3Knvod2IjnnOKQp01gZb97vzwjXDim+yKlZF9c1lTvNHRpvLzhhbOOZqPktNjlEAMoYAItB0JrGdII/jeyptec0hsDNUjbdq8s3KcDBMJ+fSwfCLDI2pGSODYQmwCRjCDw3fYwpompBy9txz9mAEyN74xz/q9S/IXGlmrPCZfvnL+vavf23ML35RD9mbmS9bxKW4YTdo7YmiyF+YSZkjdc4xZ07zGqrXuvDJp07NafbtAEQ4rhqPNDduI8r4wqIY8p38c1CK3S7HnmsSkCKEqSeqpuCvfx3Oj77uOnsjEqLtoaIY4Q/RMbnGzWo8RBn4fzOnX2ye/IUZWEqQGWVm2lk3o12yPRVEg6ylsDZ8RJPlLVNLplkbRMSDGFMAQrEQo0L+78S4zVzBiMiC/K2MHMDjJs0oh+o1Xy67rF6reBcpFY6ODz/cvtc7Nq4aD7EdioQZLd58s9Y4LgwJsy9MTlGKTDn1GsCC+eYbe9ADdsepp9qDSBhy33efPRA7eeCBH3zjXTCPghC7TSKUa1wcEuZQiJ7//OewNS6WwmfBocsvN+aNN+xBBDw/ryOGaa//0sRlXlx5pQo/hIQ5GiJoBO1f/zLmv//1szlc2tdPf/qDv9veMgn++U9jXnghXfx91ofGQ7/9dnsQibZk8qOd+gnMnVx0US3Gc685LrJFwjwmiHWXfRBbBp3qAfsu3J9bTvNWYbKP5WyJhhFivGP5xqIDCXPu3HuvMY88Yg8C8RXm1HxtHz97iyC0oZYDE35EybIqxA7WkS5XMkwAxdIszNkFO3LHQvYHE4Br8NzHgqwKbIldnnEfTOpJlMUAipjXwBlnxGWDhHy1ZGf4iisTfoj5FVeUkypHJkWzGs8x1xIBoigkzFPDmhup4hXjAbOlE8ts+jLkZ2NXkMGBIJcy0YdVgRg//nh/ihvR75zbnokiWL+VwcWTY7kqlXcXXlgvhIRPHAsTijETc5deam94QvTbBVYFFZd4yEzwbV2UQ6rxgMm7obxkIQJZZ8TMxcPF4DaW5OLIZRPJrjxnok2EOkbUYvOMYyry3GuRynf99XH7Cq4VxJjGb0rVeGJh1ivMzV20gTU0lsoDRYQZ7rJ4UF90i9hRIh0idIg8k0yhhNoYDjoPbJPScpKpyGMCcxdYFm4HEFXjialBmFcJG0g2F00P2fduLEJ34mBDUp/98tijLmWhfu3iEUbX/pI0tzcevy0tOC9mZL2Tfww79++3BxVzTsIQWeK7fvCBvSMAbI3f/taYm276sdWAn/zii7WXG1vwceCAMU88YQ+ENyy16bxiVxotq0IsxLqzMtp5pFPbGQjnbbeNl7OLreEWEYoR+TYxdomoYa7ivfdUjSeyYN3CPPe2UwgyOcUp5ctTkTLBuCXcxDAjKrxjIVbIuoW5PQk4h52RUiI9FRLlWogp/mAXEH4Xyi8WK2bdwgxtO4OImch5SmIr8aagZFHme0eI+9Y4nuO3IMQErL/ApF2txkU6Ne2lG5eCtDg2RC1JlImG3d54dMrNvfHazPFbEGIC1h8xL5XTHJtjPAZEyeyEXcrOIc43bloVuyDfWAvOixWzfmEGKtS4YB2ksrEN1NQsIc6sfczu3aVkXvhux6RqPLEhtiHMpDpdfbU9qJhz4mcOcSZCplz6978vb+PTdqfbhO9Z1Xhig2xDmGHunOYmTL6R3zx2Gl2Ja1a0QZT5/E1kVYiNsx1hnjunuQ05zn/4gzGHDtk7IkGAiY6vu045yYCfTKdLJ6tqPFEI2xFmomUu4ObwdokLmPWX//jHugLPJ4LGpjj//HpT1hIWnkdoQ6Ncvtu5Rj9CZMB2hBkY9ua0dQ8l3KSzffmlvcOCGGNT0JGU4Bm7rApGNYgsk7PKLxail20Js8iLdjWegxFNLutnC5EhEmYxLkPVeI4l188WInO0S7ZIh2iYlEWq8Wi7qvHcHEAzghZCHIciZhGH841VjSfE6EiYRRztop4uEOCDB5XiJkQgEmYRT7uoB5xVoWo8IaKRxyziIRJ2IMakwTGp98ordYQsURYiCkXMIh6XgSGrQohRkTCLeuKOcvbPP5+3jF0I0cn2hdmJDhttMsTW8LrGZVU8/nhdCOKyKpRfLMTibNtjZi1fJqjIq0V8yCQoHc4DpdGcl/3763PSTHXTORJicbYdMeN/NpeMxAc9etQeFIRvNR4QLRM1CyEWY9vCTCS4xLZTOcBnJzpmtIAwN6PiNtg7dFrkHJNdIbtHiEXZtpWBwLRXMSthqO4sHApAiJD7RLmZ4saiQjmtzCdEwWw/j5l94JoQQW6db77pF2OEl+IPLB3EmL0RJcZCZMW2rQxHu0INUdpy3m3bwkF4+bxEx6rGEyJ7yqj8a1aoASliWwbhRYDbVgXiLFEWInvKiJi7Isi5dtEeAybxQkWVzywRFmKVlBExuwjSgWiRPpYzvEcm8VjfmHxjco9DkCgLsVrKiJihndPMMD+37Y0Q465qPFhblC+EiKYcYUbkcs1pRoR9FpxnHQttYirE5inDygAizpxymttWBet59Iky7520NqJ8IcTmKSdiBoS4uevG3PYAwhtajUcetgo/hCiKsoQZmjnN2BjkNM8leghx205pQ1TM3niIcQ42ixBidsoTZuwD1h1mXYglikywLYiam9AxaG88IYSlPGFeGpcd4qwKyqNDc5SFEJtGwjw32BmIs7bxF0L0IGGOBTvCpbmVuMazEGIyJMwhuGj38OHjF5xXfrEQYkQkzEMgxn3VeA4m7dhPUAghRkDC3IezKYaq8YDJO8q75RkLIUZAwtwEAaYCz2dvPESYSHmptDshxGaRMDvIb8au2BUduxQ3VeMJISZEwuxw+cVdUI130UX1BJ+q8YQQEyNhdhApU67tImaiYVXjCSEWQMLchMXo8Za1jb8QYkEkzEIIkRnlrMcshBArQcIshBCZIWEWQojMkDALIURmSJiFECIzJMxCCJEZEmYhhMgMCbMQQmSGhFkIIbLCmP8DrHXiA8HUk8oAAAAASUVORK5CYII=",
              width: 125,
              height: 100,
            },
          ],
        },
      ],
    ];

    const pdfContent = {
      pageOrientation: "landscape",
      content: [
        {
          text: "Registre de quart : " + this.localisation,
          style: "header",
          alignment: "center",
          fontSize: 18,
          bold: true,
        },
        { text: "\n" },
        {
          columns: [
            {
              width: "20%",
              margin: [0, 0, 10, 0],
              stack: [
                {
                  table: {
                    widths: ["100%"],
                    body: tableDateQuart,
                  },
                },
                { text: "\n" },
                {
                  table: {
                    widths: ["50%", "50%"],
                    body: tableBody,
                  },
                },
              ],
            },
            {
              width: "50%",
              margin: [0, 0, 10, 0],
              table: {
                widths: ["100%"],
                body: tableConsgines,
              },
            },
            {
              width: "30%",
              margin: [0, 0, 0, 0],
              table: {
                widths: ["100%"],
                body: tableActions,
              },
            },
          ],
        },
        { text: "\n" },
        {
          columns: [
            {
              width: "70%",
              margin: [0, 0, 10, 0],
              stack: [
                {
                  table: {
                    widths: ["100%"],
                    body: tableEvents,
                  },
                },
                { text: "\n" },
                {
                  table: {
                    widths: ["25%", "25%"],
                    body: tableSignature,
                  },
                },
              ],
            },
            {
              width: "30%",
              margin: [0, 0, 0, 0],
              table: {
                widths: ["100%"],
                body: tableRonde,
              },
            },
          ],
        },
        {
          text: "",
          pageBreak: "after",
        },
        {
          width: "100%",
          margin: [0, 0, 0, 0],
          table: {
            body: tableAnomalies,
          },
        },
      ],
    };

    //@ts-expect-error data
    const pdfCreate = pdfMake.createPdf(pdfContent);
    pdfCreate.download(
      "Résumé quart du " +
        quart +
        " du " +
        this.formatDateTime(this.dateDebString),
    );

    //On récupère le blob pour créer un file que l'on va envoyer à l'API pour le stocker avec multer
    pdfCreate.getBlob((blob) => {
      const file = new File(
        [blob],
        "_" +
          this.formatDateTime(this.dateDebString).replace(":", "h") +
          "-" +
          quart +
          " - " +
          this.userPrecedent.replace("'", "") +
          ".pdf",
      );
      this.cahierQuartService
        .stockageRecapPDF(file, quart, this.formatDateTime(this.dateDebString))
        .subscribe((response) => {
          if (response == "Envoi mail OK") {
            this.popupService.alertSuccessForm("Le mail a bien été envoyé !");
          } else {
            this.popupService.alertErrorForm("Erreur envoi du mail ....");
          }
        });
    });

    await this.delay(1000);
    // window.location.href =
    //   "https://fr-couvinove300.prod.paprec.fr:8100/cahierQuart/newEquipe?quart=" +
    //   this.quart;
    this.router.navigate(["/cahierQuart/newEquipe"], {
      queryParams: { quart: this.quart },
    });
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  formatDateTime(dateTimeString: string): string {
    // Diviser la chaîne de caractères en date et heure
    const [date, time] = dateTimeString.split(" ");

    // Diviser la date en année, mois et jour
    const [year, month, day] = date.split("-");

    // Prendre seulement les heures et minutes de l'heure
    const [hour, minute] = time.split(":");

    // Reformer la date et l'heure au format souhaité
    const formattedDateTime = `${day}-${month}-${year} ${hour}:${minute}`;
    return formattedDateTime;
  }
}
