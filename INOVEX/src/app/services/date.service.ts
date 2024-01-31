import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';
import {NgForm} from "@angular/forms";

@Injectable()
export class dateService {

    //récupérer les jours de la période
    getDays(start : Date, end : Date) {
        for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
          var dd = String(dt.getDate()).padStart(2, '0');
          var mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = dt.getFullYear();
          var day = dd + '/' + mm + '/' + yyyy;
          arr.push(day);
        }
        return arr;
    };

    //Pop-up en cas de mauvaise entrée de dates
    mauvaiseEntreeDate(form: NgForm) {
      form.controls['dateFin'].reset();
      form.value['dateFin'] = '';
      Swal.fire({
        icon: 'error',
        text: 'La date de Fin est inférieure à la date de Départ !',
      })
    }

    //changer les dates pour saisir les 2 derniers jours
    set2Days(form: NgForm){
      var date = new Date();
      var yyyy = date.getFullYear();
      var dd = String(date.getDate() - 1).padStart(2, '0');
      var ddBefore = String(date.getDate() - 2).padStart(2, '0');
      var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
      //Si après décrémentation du jour on a 0, on prend le dernier jour du mois dernier
      if(dd === '00'){
        dd = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(2, '0');
        mm = String(date.getMonth()).padStart(2, '0');
      }
      var day = yyyy + '-' + mm + '-' + dd;
      if(ddBefore === '00'){
        ddBefore = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(2, '0');
        mm = String(date.getMonth()).padStart(2, '0');
      }
      var dayBefore = yyyy + '-' + mm + '-' + ddBefore;
      (<HTMLInputElement>document.getElementById("dateDeb")).value = dayBefore;
      (<HTMLInputElement>document.getElementById("dateFin")).value = day;
      form.value['dateDeb'] = dayBefore;
      form.value['dateFin'] = day;
  }

    //changer les dates pour saisir hier
    setYesterday(form: NgForm){
        var date = new Date();
        var yyyy = date.getFullYear();
        var dd = String(date.getDate() - 1).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        if(dd === '00'){
          dd = String(new Date(yyyy, date.getMonth(), 0).getDate()).padStart(2, '0');
          mm = String(date.getMonth()).padStart(2, '0');
        }
        var day = yyyy + '-' + mm + '-' + dd;
        console.log(<HTMLInputElement>document.getElementById("dateDeb"));
        //@ts-ignore
        document.getElementById('dateDeb').value = day;
        (<HTMLInputElement>document.getElementById("dateFin")).value = day;
        form.value['dateDeb'] = day;
        form.value['dateFin'] = day;
    }

    //Fonction non utilisée
    resetForm(form: NgForm){
        form.controls['dateDeb'].reset();
        form.value['dateDeb']='';
        form.controls['dateFin'].reset();
        form.value['dateFin']='';
    }


    //changer les dates pour saisir la semaine en cours
    setCurrentWeek(form: NgForm){
        var date = new Date();
        //le début de la semaine par défaut est dimanche (0)
        var firstday = new Date(date.setDate(date.getDate() - date.getDay()+1));
        var lastday = new Date(date.setDate(date.getDate() - date.getDay()+7));
        var ddF = String(firstday.getDate()).padStart(2, '0');
        var mmF = String(firstday.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyyF = firstday.getFullYear();
        var firstDayOfWeek = yyyyF + '-' + mmF + '-' + ddF;
        var ddL = String(lastday.getDate()).padStart(2, '0');
        var mmL = String(lastday.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyyL = lastday.getFullYear();
        var LastDayOfWeek = yyyyL + '-' + mmL + '-' + ddL;

        (<HTMLInputElement>document.getElementById("dateDeb")).value = firstDayOfWeek;
        (<HTMLInputElement>document.getElementById("dateFin")).value = LastDayOfWeek;
        form.value['dateDeb'] = firstDayOfWeek;
        form.value['dateFin'] = LastDayOfWeek;
    }

    //changer les dates pour saisir le mois en cours
    setCurrentMonth(form: NgForm){
        var date = new Date();
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        var dd = String(new Date(yyyy, date.getMonth()+1, 0).getDate()).padStart(2, '0');

        var Fisrtday = yyyy + '-' + mm + '-' + '01';
        var Lastday = yyyy + '-' + mm + '-' + dd;
        (<HTMLInputElement>document.getElementById("dateDeb")).value = Fisrtday;
        (<HTMLInputElement>document.getElementById("dateFin")).value = Lastday;
        form.value['dateDeb'] = Fisrtday;
        form.value['dateFin'] = Lastday;
    }

    //changer les dates pour saisir le mois précédent
    setLastMonth(form: NgForm){
        var date = new Date();
        var mm : String;
        var yyyy : number;
        if (date.getMonth() === 0){
          mm = "12";
          yyyy = date.getFullYear()-1;
        }
        else {
          mm = String(date.getMonth()).padStart(2, '0'); //January is 0!
          yyyy = date.getFullYear();
        }
    
        var Lastday = yyyy + '-' + mm;
        (<HTMLInputElement>document.getElementById("dateDeb")).value = Lastday;
        form.value['dateDeb'] = Lastday;
    }

    //afficher le dernier jour de chaque mois de l'année en cours
    setYear(){
        var listDays : string[];
        listDays = [];
        var date = new Date();
        var yyyy = date.getFullYear();
        for (let i = 1; i < 13; i++) {
          var dd = String(new Date(yyyy, i, 0).getDate()).padStart(2, '0');
          if(i<10){
            listDays.push(dd + '/' + 0+i + '/' + yyyy);
          }
          else listDays.push(dd + '/' + i + '/' + yyyy);
        }
        return listDays
    }

    //afficher le dernier jour de chaque mois de l'année en cours
    setLastYear(){
        var listDays : string[];
        listDays = [];
        var date = new Date();
        var yyyy = date.getFullYear()-1;
        for (let i = 1; i < 13; i++) {
          var dd = String(new Date(yyyy, i, 0).getDate()).padStart(2, '0');
          if(i<10){
            listDays.push(dd + '/' + 0+i + '/' + yyyy);
          }
          else listDays.push(dd + '/' + i + '/' + yyyy);
        }
        return listDays;
      }
}