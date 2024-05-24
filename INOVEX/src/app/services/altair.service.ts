import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { idUsineService } from "./idUsine.service";

@Injectable({
  providedIn: 'root'
})
export class AltairService {

  httpClient: HttpClient;
  private headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
  }
  // private portAPI = 3102;
  private ip = "https://paprec.altairsystem.fr:443/altairtestrest";
  //private ip = "localhost";
  private idUsine : number | undefined;

  constructor(private http: HttpClient, private idUsineService : idUsineService) {
      this.httpClient = http;
      //@ts-ignore
      this.idUsine = this.idUsineService.getIdUsine();
  }


  //Créer une nouvelle équipe
  login(){
    let requete = this.ip+"/rest/system/login"
    console.log(requete)
            
    const requestOptions = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    var headers = {
      headers : requestOptions
    }

    var url = "https://cors-anywhere.herokuapp.com/" + requete

    var payload = "{\r\n  \"username\":\"psautet\",\r\n  \"password\":\"psautet\",\r\n  \"site\":\"PLUZUNET\",\r\n  \"passwordprehashed\": false\r\n\r\n}"
    console.log(payload)
    console.log(requestOptions)
    console.log(this.http.post<any>(requete,payload,headers))

    return this.http.post<any>(url,payload,headers);
  }

}
