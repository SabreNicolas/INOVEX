import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { cahierQuartService } from '../services/cahierQuart.service';
import { ActivatedRoute } from '@angular/router';
import { format, subDays } from 'date-fns';
import { rondierService } from "../services/rondier.service";
import { anomalie } from 'src/models/anomalie.model';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PopupService } from '../services/popup.service';

//@ts-ignore
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-recap-ronde-precedente',
  templateUrl: './recap-ronde-precedente.component.html',
  styleUrls: ['./recap-ronde-precedente.component.scss']
})
export class RecapRondePrecedenteComponent implements OnInit {

  public listAction: any[];
  public listEvenement: any[];
  public listZone: any[];
  public listConsigne: any[];
  public listActu: any[];
  public listAnomalies : anomalie[];
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
  @ViewChild('pdfTable') pdfContent!: ElementRef;
  public listZoneElements: any[] = [];
  public rondeId: number | undefined;
  public listZonesAndElements: any[] = [];

  constructor(
    private cahierQuartService: cahierQuartService,
    private rondierService: rondierService,
    private route: ActivatedRoute,
    private popupService: PopupService
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

    this.route.queryParams.subscribe(params => {
      this.quart = (params.quart ?? 0);
      this.idEquipe = (params.idEquipe ?? 0);
    });
  }

  ngOnInit(): void {
    
    // Récupération de la date de début et de la date de fin en fonction du quart 
    if (this.quart == 1) {
      this.dateDebString = format(subDays(new Date(), 1), 'yyyy-MM-dd') + ' 21:00:00.000';
      this.dateFinString = format(new Date(), 'yyyy-MM-dd') + ' 05:00:00.000';
      this.quartPrecedent = 3;
    } else if (this.quart == 2) {
      this.dateDebString = format(new Date(), 'yyyy-MM-dd') + ' 05:00:00.000';
      this.dateFinString = format(new Date(), 'yyyy-MM-dd') + ' 13:00:00.000';
      this.quartPrecedent = 1;
    } else {
      this.dateDebString = format(new Date(), 'yyyy-MM-dd') + ' 13:00:00.000';
      this.dateFinString = format(new Date(), 'yyyy-MM-dd') + ' 21:00:00.000';
      this.quartPrecedent = 2;
    }
  
    // Récupération des actions pour la ronde précédente
    this.cahierQuartService.getActionsRonde(this.dateDebString, this.dateFinString).subscribe((response: any) => {
      this.listAction = response?.data ?? [];
    });
  
    // Récupération des évènements pour la ronde précédente
    this.cahierQuartService.getEvenementsRonde(this.dateDebString, this.dateFinString).subscribe((response: any) => {
      this.listEvenement = response?.data ?? [];
    });
  
    // Récupération des actus pour la ronde précédente
    this.cahierQuartService.getActusRonde(this.dateDebString, this.dateFinString).subscribe((response: any) => {
      this.listActu = response?.data ?? [];
    });
  
    // Récupération des zones pour la ronde précédente
    this.cahierQuartService.getZonesCalendrierRonde(this.dateDebString, this.dateFinString).subscribe((response: any) => {
      this.listZone = response?.BadgeAndElementsOfZone ?? [];
    });
  
    // On récupère la liste des consignes de la ronde précédente
    this.rondierService.listConsignes().subscribe((response: any) => {
      this.listConsigne = response?.data ?? [];
    });
  
    // Récupération des anomalies pour la ronde précédente
    var dateFr = this.dateDebString.split(' ')[0].split('-')[2] + '/' + this.dateDebString.split(' ')[0].split('-')[1] + '/' + this.dateDebString.split(' ')[0].split('-')[0];
    this.cahierQuartService.getAnomaliesOfOneRonde(dateFr, this.quartPrecedent).subscribe((response: any) => {
      this.listAnomalies = response?.data ?? [];
      console.log(this.listAnomalies);
    });
  
   // Utilisation de la méthode publique getIdUsine pour obtenir la valeur de idUsine
   const idUsine = this.cahierQuartService.getIdUsine();
   this.rondierService.getBadgeAndElementsOfZones(idUsine).subscribe((response: any) => {
     this.listZoneElements = response?.BadgeAndElementsOfZone ?? [];
     // Affichage des éléments récupérés
     for (let i = 0; i < response.BadgeAndElementsOfZone.length; i++) {
       console.log(response.BadgeAndElementsOfZone[i]);
     }
   });
  
    // Récupération de l'id de l'équipe pour la ronde si l'équipe est déjà créée
    this.cahierQuartService.getEquipeQuart(this.quartPrecedent, format(new Date(this.dateDebString), 'yyyy-MM-dd')).subscribe((response: any) => {
      this.idEquipe = response?.data?.[0]?.id ?? 0;
      if (this.idEquipe > 0) {
        this.cahierQuartService.getOneEquipe(this.idEquipe).subscribe((response: any) => {
          this.nomEquipe = response?.data?.[0]?.equipe ?? '';
          if (response?.data?.[0]?.idRondier != null) {
            for (var i = 0; i < response.data.length; i++) {
              this.listRondier.push({
                Id: response.data[i]['idRondier'],
                Prenom: response.data[i]['prenomRondier'],
                Nom: response.data[i]['nomRondier'],
                Poste: response.data[i]['poste'],
                heure_fin: response.data[i]['heure_fin'],
                heure_deb: response.data[i]['heure_deb'],
                heure_tp: response.data[i]['heure_tp']
              });
              if (response.data[i]['poste'] == 'Chef de Quart') {
                this.userPrecedent = response.data[i]['prenomRondier'] + ' ' + response.data[i]['nomRondier'];
              }
            }
          }
        });
      }
    });
  
    this.cahierQuartService.getOneUser().subscribe((response: any) => {
      this.user = (response?.data?.[0]?.Prenom + " " + response?.data?.[0]?.Nom);
    });
  
    this.cahierQuartService.getOneLocalisation().subscribe((response: any) => {
      this.localisation = response?.data?.[0]?.localisation ?? '';
    });
  }

        
  formatTime(time: string | undefined): string {
    if (!time) {
      return ""; // Retourne une chaîne vide si l'heure est indéfinie
    }
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  }

  async toBase64ImageUrl(imgUrl: string): Promise<string> {
    const fetchImageUrl = await fetch(imgUrl)
    const responseArrBuffer = await fetchImageUrl.arrayBuffer()
    const uint8Array = new Uint8Array(responseArrBuffer);
    const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
    const base64String = btoa(binaryString)
    const toBase64 = 
      `data:${ fetchImageUrl.headers.get('Content-Type') || 'image/png' };base64,${base64String}`
    return toBase64 
  }

  // Fonction pour redimensionner l'image tout en conservant les proportions 
  resizeBase64Img(base64 : string, maxWidth : number, maxHeight : number) { 
    var img = new Image(); 
    img.src = base64; 
    var width = img.width; 
    var height = img.height; 
    if (width > maxWidth || height > maxHeight) {
      var ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio; height = height * ratio; 
    }
    else {
      width = maxWidth;
      height = maxHeight;
    }
    return{width, height}; 
  }; 


 
  async createPDF() {
    let quart = '';
    if (this.quartPrecedent === 1) {
      quart = 'Matin';
    } else if (this.quartPrecedent === 2) {
      quart = 'Après-midi';
    } else {
      quart = 'Nuit';
    }
  
    // Formatage direct de la date et de l'heure
    const date = new Date(this.dateDebString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
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
        { text: this.formatTime(rondier.heure_deb) || 'Aucune Valeur', style: 'tableCell', alignment: 'center' },
        { text: this.formatTime(rondier.heure_fin) || 'Aucune Valeur', style: 'tableCell', alignment: 'center' },
        { text: this.formatTime(rondier.heure_tp) || 'Aucune Valeur', style: 'tableCell', alignment: 'center' }
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
          canvas: [
            {
              type: 'rect',
              x: 130,
              y: 0,
              w: 255,
              h: 35,
              r: 0,
              lineWidth: 1,
              lineColor: 'black',
              color: '#ededed'
            }
          ],
          margin: [0, 0, 0, -40]
        },
        {
          text: `Registre de quart : ${this.localisation || ''}`,
          style: 'header',
          alignment: 'center',
          fontSize: 18,
          bold: true,
        },
        {
          text: `Date: ${formattedDate}`,
          margin: [390, -30, 0, 10]
        },
        {
          text: `Quart: ${quart}`,
          margin: [390, -10, 0, 10]
        },
        { text: '\n' },
        {
          columns: [
            {
              width: '*',
              text: ''
            },
            {
              width: 'auto',
              table: {
                headerRows: 1,
                body: tableHeader
              },
              layout: 'lightHorizontalLines'
            },
            {
              width: '*',
              text: ''
            }
          ]
        },
        { text: '\n\n' },
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 20,
              r: 0,
              lineWidth: 1,
              lineColor: 'black',
              color: '#ededed'
            }
          ],
          margin: [0, 0, 0, -28]
        },
        {
          text: 'Consignes',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listConsigne.map((consigne: any) => `${consigne.titre} - ${consigne.commentaire || 'Pas de description'}`) || []
        },
        { text: '\n\n' },
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 20,
              r: 0,
              lineWidth: 1,
              lineColor: 'black',
              color: '#ededed'
            }
          ],
          margin: [0, 0, 0, -28]
        },
        {
          text: 'Actions',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listAction?.map((action: any) => ({
            text: `${action.nom}`,
            color: action.termine ? 'green' : 'red'
          })) || []
        },
        { text: '\n\n' },
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 20,
              r: 0,
              lineWidth: 1,
              lineColor: 'black',
              color: '#ededed'
            }
          ],
          margin: [0, 0, 0, -28]
        },
        {
          text: 'Evenements',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listEvenement?.map((evenement: any) => {
            const demandeTravauxText = evenement.demande_travaux == 0 ? 'Aucune demande' : evenement.demande_travaux;
            return `${evenement.titre} - ${evenement.description || 'Pas de description'} (${evenement.date_heure_debut} - ${evenement.date_heure_fin}) - Cause: ${evenement.cause || 'Non spécifiée'} - Demande de Travaux: ${demandeTravauxText}`;
          }) || []
        },
        { text: '\n\n' },
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 20,
              r: 0,
              lineWidth: 1,
              lineColor: 'black',
              color: '#ededed'
            }
          ],
          margin: [0, 0, 0, -28]
        },
        {
          text: 'Zones contrôlées',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listZone?.map((zone: any) => ({
            text: `${zone.zone} - Contrôlée par: ${zone.prenomRondier} ${zone.nomRondier} (${zone.termine ? 'Terminé' : 'Non terminé'})`,
            color: zone.termine ? 'green' : 'red'
          })) || []
        },
        { text: '\n\n' },
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 20,
              r: 0,
              lineWidth: 1,
              lineColor: 'black',
              color: '#ededed'
            }
          ],
          margin: [0, 0, 0, -28]
        },
        {
          text: 'Actualités',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 5],
          width: '100%'
        },
        {
          ul: this.listActu?.map((actu: any) => `${actu.titre} - ${actu.description || 'Pas de description'} (${actu.date_heure_debut} - ${actu.date_heure_fin})`) || []
        },
        { text: '\n\n' },
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 20,
              r: 0,
              lineWidth: 1,
              lineColor: 'black',
              color: '#ededed'
            }
          ],
          margin: [0, 0, 0, -24]
        },
        {
          text: 'Anomalies',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 5, 0, 2],
          width: '100%'
        },
        {
          ul: tableAnomalies.slice(1).map((anomalie: any) => ({
            text: `${anomalie[0].text} - ${anomalie[1].text}`,
            style: 'tableCell'
          }))
        },
        { text: '\n\n' },
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  text: 'CDQ SORTANT : ...................... / .......................',
                  style: 'signature'
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: 0,
                      y: 0,
                      w: 150,
                      h: 50,
                      r: 0,
                      lineWidth: 1,
                      lineColor: 'black'
                    }
                  ],
                  margin: [0, 10, 0, 0]
                }
              ]
            },
            {
              width: '50%',
              stack: [
                {
                  text: 'CDQ ENTRANT : ...................... / ......................',
                  style: 'signature',
                  alignment: 'right'
                },
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: 0,
                      y: 0,
                      w: 150,
                      h: 50,
                      r: 0,
                      lineWidth: 1,
                      lineColor: 'black'
                    }
                  ],
                  margin: [0, 10, 0, 0],
                  alignment: 'right'
                }
              ]
            }
          ],
          margin: [0, 50, 0, 0]
        },
        { text: '\n' },
        {
          text: 'Annexe : Élément de zone',
          style: 'header',
          alignment: 'center',
          margin: [0, 10, 0, 5],
          width: '100%',
          pageBreak: 'before'
        },
        {
          canvas: [
            {
              type: 'rect',
              x: -40,
              y: 0,
              w: 600,
              h: 0,
              r: 0,
              lineWidth: 1,
              lineColor: 'black',
              color: '#ededed'
            }
          ],
          margin: [0, 0, 0, 0]
        },
        { text: '\n' },
        {
          ul: elementsOfControlledZones.map((element: any) => ({
            text: `${element[0].text} - ${element[1].text}`,
            style: 'tableCell'
          })) || []
        },
        { text: '\n\n' }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        tableCell: {
          margin: [0, 5, 0, 5]
        },
        signature: {
          fontSize: 12,
          bold: true
        }
      }
    };
  
    //@ts-ignore
    let pdfCreate = pdfMake.createPdf(pdfContent);
    pdfCreate.download('Résumé quart ' + quart + ' du ' + formattedDate);
  
    // Blob pour stockage et envoi
    pdfCreate.getBlob((blob: any) => {
      var file = new File([blob], quart + ' - ' + this.userPrecedent + ".pdf");
      this.cahierQuartService.stockageRecapPDF(file, quart, formattedDate).subscribe((response: any) => {
        if (response == "Envoi mail OK") {
          this.popupService.alertSuccessForm("Le mail a bien été envoyé !");
        } else {
          this.popupService.alertErrorForm('Erreur envoi du mail ....');
        }
      });
    });
  
    await this.delay(1000);
    // window.location.href = "https://localhost:8100/cahierQuart/newEquipe?quart=" + this.quart;
  }
  
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  priseDeQuart() {
    Swal.fire({
      title: 'Avez-vous pris connaissance des infos du quart précédent ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
       window.location.href = "https://localhost:8100/cahierQuart/newEquipe?quart=" + this.quart;
        this.createPDF();
      } else {
        this.popupService.alertErrorForm('La prise de quart a été annulée.');
      }
    });
  }

  downloadFile(url: string) {
    window.open(url, '_blank');
  }
}