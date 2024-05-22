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
  private ip = "https://paprec.altairsystem.fr/altairtestrest";
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
    var headers = {
        'Content-Type': 'application/json'
        }    
        
    const requestOptions = {
        headers: new HttpHeaders(headers),
    };
    
    var payload = "{\r\n  \"username\":\"psautet\",\r\n  \"password\":\"psautet\",\r\n  \"site\":\"PLUZUNET\",\r\n  \"passwordprehashed\": false\r\n\r\n}"
    console.log(payload)
    console.log(requestOptions)
    console.log(this.http.post<any>(requete,payload,requestOptions))

    return this.http.post<any>(requete,payload,requestOptions);
  }

}
