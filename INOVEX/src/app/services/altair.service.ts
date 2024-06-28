import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { idUsineService } from "./idUsine.service";

@Injectable({
  providedIn: 'root'
})
export class AltairService {

  private headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
  }
  // private portAPI = 3102;
  private ip = "https://paprec.altairsystem.fr:443/altairtestrest";
  //private ip = "localhost";
  private idUsine : number | undefined;

  constructor(private http: HttpClient, private idUsineService : idUsineService) {
      //@ts-ignore
      this.idUsine = this.idUsineService.getIdUsine();
  }


  //Créer une nouvelle équipe
  login(){
    let requete = this.ip+"/rest/system/login"
    console.log(requete)
            
    const requestOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://paprec.altairsystem.fr',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    });
    
    var headers = {
      headers : requestOptions
    }

    //var url = "https://cors-anywhere.herokuapp.com/" + requete
    var url = requete

    var payload = "{\r\n  \"username\":\"psautet\",\r\n  \"password\":\"psautet\",\r\n  \"site\":\"PLUZUNET\",\r\n  \"passwordprehashed\": false\r\n\r\n}"
    console.log(payload)
    console.log(requestOptions)
    console.log(this.http.post<any>(requete,payload,headers))

    return this.http.post<any>(url,payload,headers);
  }

}
