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
      'Access-Control-Allow-Origin' : '*',
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

    const requestOptions = {
        headers: new HttpHeaders(this.headerDict),
    };

    // const formData = new FormData();
    // // @ts-ignore
    
    // formData.append('password', 'nsabre');
    // formData.append('username', 'nsabre');
  
    const formData = "{\r\n \"username\":\"nsabre\",\r\n \"password\":\"nsabre\",\r\n}"
    console.log(formData)
    //@ts-ignore
    return this.http.post<any>(requete,formData,requestOptions);
  }

}