import {Component,ChangeDetectionStrategy,ViewChild,TemplateRef,OnInit} from '@angular/core';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours,parseISO,format,addWeeks,addMonths} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView,DAYS_OF_WEEK} from 'angular-calendar';
import { cahierQuartService } from '../services/cahierQuart.service';
import { DatePipe } from '@angular/common';
import {rondierService} from "../services/rondier.service";
import { zone } from 'src/models/zone.model';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { PopupService } from '../services/popup.service';
import { MatDialog } from '@angular/material/dialog';
declare var $ : any;

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.scss']
})

export class CalendrierComponent implements OnInit{
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;
  @ViewChild('myCreateEventDialog') createEventDialog = {} as TemplateRef<any>;

  public view: CalendarView = CalendarView.Week;
  public listZone : zone[];
  public listZoneSelection : number[];
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public modalData: {
    nom : string;
    event: CalendarEvent;
    dateDeb : any;
    dateFin : any;
    ronde : any;
    isAction : boolean | undefined;
  } | undefined;
  public refresh: Subject<any> = new Subject();
  public events: CalendarEvent[];
  public colors: any ;
  public weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  public weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
  public activeDayIsOpen: boolean = true;
  public dateDeb !: any;
  public periodicite : number;
  public quart : number[];
  public occurences : number;
  public nomAction : string;
  public radioSelect : string;
  public dialogRef = {};

  constructor(private modal: NgbModal, private dialog : MatDialog, private popupService : PopupService, private rondierService : rondierService, public cahierQuartService : cahierQuartService, private datePipe: DatePipe) {
    this.events = [];
    this.nomAction = "";
    this.radioSelect = "";
    this.listZone = [];
    this.listZoneSelection = [];
    this.periodicite =0;
    this.quart = [];
    this.occurences = 10;
    this.colors = {
      red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
        secondaryText:'black'
      },
      blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
        secondaryText:'black'
      },
      yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
        secondaryText:'black'
      },
      green: {
        primary: "#01D758",
        secondary: "#87E990",
        secondaryText:'black'
      }
    };

    
  }
  
  ngOnInit(): void {

    //On cache les blocs de création
    $('#CreationRondeAction').hide();
    $('#CreationRonde').hide();
    $('#CreationAction').hide();
    
    this.listZone = [];
    this.listZoneSelection = [];
    this.dateDeb = undefined;
    this.periodicite = 0;
    this.nomAction = "";


    //On vide le tableau d'évènement
    this.events = [];

    //On récupère les zones du calendrier
    this.cahierQuartService.getAllZonesCalendrier().subscribe((response)=>{
      //On parcours les zones pour les ajouter une par une dans le tableau d'évènement
      var tabRondes : any[] = [];
      tabRondes.push(response.data[0])
      for(var i =1 ; i < response.data.length; i++){
        var event = response.data[i];
        var eventP = response.data[i-1];
        if(eventP.date_heure_debut.split('T')[1] == '05:00:00.000Z'){
          var color = '#71C1F9'
          var texte = "Quart du matin"
        }
        else if((eventP.date_heure_debut.split('T')[1] == '13:00:00.000Z')){
          var color = '#73FF97'
          var texte = "Quart de l'après-midi"
        }
        else {
          var color = '#F1FF6A'
          var texte = "Quart de nuit"
        }

        if(eventP.date_heure_debut == event.date_heure_debut){
          tabRondes.push(event);
        }
        else{
          this.events.push(
            {
              start: new Date(eventP.date_heure_debut.split('-')[0],eventP.date_heure_debut.split('-')[1]- 1, eventP.date_heure_debut.split('-')[2].split('T')[0] ,eventP.date_heure_debut.split('-')[2].split('T')[1].split(':')[0],0,0),
              end: new Date(eventP.date_heure_fin.split('-')[0],eventP.date_heure_fin.split('-')[1]- 1, eventP.date_heure_fin.split('-')[2].split('T')[0] ,eventP.date_heure_fin.split('-')[2].split('T')[1].split(':')[0],0,0),
              title: texte,
              allDay: false,
              color: {
                primary: color,
                secondary: color,
                secondaryText:'black'
              },
              id : event.id,
              ronde : tabRondes
            }
          )
          tabRondes = [];
          tabRondes.push(event)
        }
        
      }
      this.setView(CalendarView.Day)
      // this.setView(CalendarView.Week)
    })

    //On récupère les actions du calendrier
    this.cahierQuartService.getAllActionsCalendrier().subscribe((response)=>{
      //On parcours les actions pour les ajouter une par une dans le tableau d'évènement
      for(const event of response.data){
        if(event.date_heure_debut.split('T')[1] == '05:00:00.000Z'){
          var color = this.colors.blue
        }
        else if((event.date_heure_debut.split('T')[1] == '13:00:00.000Z')){
          var color = this.colors.green
        }
        else {
          var color = this.colors.yellow
        }
        this.events.push(
          {
            //@ts-ignore"
            start: new Date(event.date_heure_debut.split('-')[0],event.date_heure_debut.split('-')[1]- 1, event.date_heure_debut.split('-')[2].split('T')[0] ,event.date_heure_debut.split('-')[2].split('T')[1].split(':')[0],0,0),
            //@ts-ignore
            end: new Date(event.date_heure_fin.split('-')[0],event.date_heure_fin.split('-')[1]- 1, event.date_heure_fin.split('-')[2].split('T')[0] ,event.date_heure_fin.split('-')[2].split('T')[1].split(':')[0],0,0),
            title: event.nom,
            allDay: false,
            color: color,
            id : event.id,
            isAction:true
          }
        )
      }
      this.setView(CalendarView.Week)
    })
  
    //On récupère la liste des zones d'une usine pour la création d'évènement du calendrier
    this.rondierService.listZone().subscribe((response)=>{
      // @ts-ignore
      this.listZone = response.data;
    });
    
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  //Fonction de la librairie calendar pour modifier la durée d'un évènement (non utilisée pour nous)
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  //fonction permettant d'afficher un évènement quand on clique dessus
  handleEvent(action: string, event: CalendarEvent): void {
    var dateDeb = format(event.start,'dd/MM/yyyy hh:mm:ss')
    //@ts-ignore
    var dateFin = format(event.end,'dd/MM/yyyy hh:mm:ss')
    this.modalData = { 
                      'nom': event.title, 
                      'event' :event,
                      'dateDeb' : dateDeb,
                      'dateFin' : dateFin,
                      'ronde' : event.ronde,
                      'isAction' : event.isAction
                    };
    //console.log(this.modalData)                    
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  //Fonction permettant d'afficher le bloc de création (choix zone ou action)
  addEvent(): void {
    $("#divCreation").show();
    $('#hideCreation').show();
    $('#create').hide();
  }

  //Fonction permettant de supprimer un évènement
  deleteEvenement(id: any, deleteOccurence : boolean) {
    Swal.fire({title: "Etes vous sûr de vouloir supprimer cet évènement ?" ,icon: 'warning',showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Oui, supprimer',cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        //SI on veut supprimer l'occurence (fonctionne uniquement sur les actions)
        if(deleteOccurence){
          //On supprime les actions de l'occurence
          this.cahierQuartService.deleteEvents(id).subscribe((response)=>{
            if (response == "Suppression de l'occurence du calendrier OK"){
              this.popupService.alertSuccessForm("L'occurence a bien été supprimé !");
              this.ngOnInit();
            }
            else {
              this.popupService.alertErrorForm("Erreur lors de la suppression de l'occurence....")
            }
          });
        }
        else{
          this.cahierQuartService.deleteCalendrier(id).subscribe((response)=>{
            if (response == "Suppression de l'evenement du calendrier OK"){
              this.popupService.alertSuccessForm("L'évènement a bien été supprimé !");
              this.ngOnInit();
            }
            else {
              this.popupService.alertErrorForm("Erreur lors de la suppression de l'évènement....")
            }
          });
        }
      }  
      else {
        // Pop-up d'annulation de la suppression
        this.popupService.alertErrorForm('La suppression a été annulée.');
      }
    });
  }

  //Fonction de la libraire calendar pour choisir la vue
  setView(view: CalendarView) {
    this.view = view;
  }

  //Fonction de la libraire calendar pour choisir la vue
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  //Fonction pour montrer le bloc de création d'actions
  showCreationAction(){
    $('#CreationRondeAction').show();
    $('#CreationRonde').hide();
    $('#CreationAction').show();
    $('#hideCreation').show();
  }

  //Fonction pour montrer le bloc de création de zones
  showCreationRonde(){
    $('#CreationRondeAction').show();
    $('#CreationRonde').show();
    $('#CreationAction').hide();
    $('#hideCreation').show();
  }

  //Fonction permettant de créer un évènement dans le calendrier
  async createEvenementCalendrier(){
    this.loading();
    //On parcours la liste des quarts choisis
    for(const quart of this.quart){
      //On récupère l'heure de fin en fonction du quart
      if(quart == 1){
        var heureDeb = '05:00:00'
        var heureFin = '13:00:00'
      }
      else if(quart == 2){
        var heureDeb = '13:00:00'
        var heureFin = '21:00:00'
      }
      else{
        var heureDeb = '21:00:00'
        var heureFin = '05:00:00'
      }

      //Si on a pas de periodicité, l'ajout ne se fait qu'une fois
      if(this.periodicite == 0){
        //Si on est dans le quart 3, le jour de fin est le jour suivant
        if(quart != 3){
          var dateFin = this.dateDeb + ' ' + heureFin
        }
        else{
          var dateFin = format(addDays(parseISO(this.dateDeb), 1),'yyyy-MM-dd') + ' ' + heureFin
        }
        var dateDeb2 = this.dateDeb + ' ' + heureDeb
        //Si on ajoute une zone
        if(this.radioSelect == "zone"){
          //On parcours la liste des zones pour toutes les ajouter
          for(const zone of this.listZoneSelection){   
            this.cahierQuartService.newCalendrierZone(zone,dateDeb2,quart,dateFin).subscribe((response) => {
              var dateFin = "";
            })
          }
        }
        //si on ajoute une action
        else {
          this.cahierQuartService.newAction(this.nomAction, dateDeb2, dateFin).subscribe((response)=>{
            this.cahierQuartService.newCalendrierAction(response.data[0].id, response.data[0].date_heure_debut, quart, response.data[0].date_heure_fin).subscribe((response) => {
              var dateFin = "";
            })
          })
        }
          
      }
      else {
        //Si on a une periodicite, on boucle pour ajouter autant de fois que d'occurences demandées
        for(var i = 0; i < this.occurences; i++){
          await this.pause(1);
          console.log("ici");
          //Si on est en quotidient
          if(this.periodicite == 1){
            var dateDeb2 = format(addDays(parseISO(this.dateDeb), i),'yyyy-MM-dd') + ' ' + heureDeb
          }
          //Si on est en hebdo
          else if(this.periodicite == 2){
            var dateDeb2 = format(addWeeks(parseISO(this.dateDeb), i),'yyyy-MM-dd') + ' ' + heureDeb
          }
          //Si on est en mensuel
          else {
            var dateDeb2 = format(addMonths(parseISO(this.dateDeb), i),'yyyy-MM-dd') + ' ' + heureDeb
          }
          //Si on est dans le quart 3, le jour de fin est le jour suivant
          if(quart != 3){
            var dateFin = dateDeb2.split(' ')[0] + ' ' + heureFin
          }
          else{
            var dateFin = format(addDays(parseISO(dateDeb2.split(' ')[0]), 1),'yyyy-MM-dd') + ' ' + heureFin
          }
          //Si on ajoute une zone
          if(this.radioSelect == "zone"){
            //On parcours la liste des zones pour toutes les ajouter
            for(const zone of this.listZoneSelection){   
              this.cahierQuartService.newCalendrierZone(zone,dateDeb2,quart,dateFin).subscribe((response) => {
                var dateFin = "";
              })
            }
          }
          //Si on ajoute une action
          else {
            this.cahierQuartService.newAction(this.nomAction, dateDeb2, dateFin).subscribe((response)=>{
              console.log("ici");
              this.cahierQuartService.newCalendrierAction(response.data[0].id, response.data[0].date_heure_debut, quart, response.data[0].date_heure_fin).subscribe((response) => {
                var dateFin = "";
              })
            })
          }
        }
      }
    }
    this.removeloading();
    this.dialog.closeAll();
  }

  pause(millisecondes : number){
    return new Promise<void>(resolve => setTimeout(resolve, millisecondes));
  }

  //Fonction qui permet de cacher le bloc de création
  hideCreation(){
    $('#CreationRondeAction').hide();
    $('#CreationRonde').hide();
    $('#CreationAction').hide();
    $('#create').show();
    $('#hideCreation').hide();
    $('#divCreation').hide();
  }

  maxOccurence(){
    this.occurences = 1000;
  }

  loading(){
    $("#spinner").addClass('loader');
    $("#spinnerBloc").addClass('loaderBloc');
  }

  removeloading(){
      var element = document.getElementById('spinner');
      // @ts-ignore
      element.classList.remove('loader');
      var element = document.getElementById('spinnerBloc');
      // @ts-ignore
      element.classList.remove('loaderBloc');
  }

  ouvrirDialogCreerEvent(){
    this.dialogRef = this.dialog.open(this.createEventDialog,{
      width:'60%',
      disableClose:true,
      autoFocus:true,
    })
    this.dialog.afterAllClosed.subscribe((response)=>{
      this.ngOnInit();
    })
  }
}
