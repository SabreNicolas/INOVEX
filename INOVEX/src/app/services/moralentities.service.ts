import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class moralEntitiesService {

    private _nom : string;
    private _adress : string;
    private _code : string;
    private _unitPrice : number;

    httpClient: HttpClient;
    private headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
    private portAPI = 3000;

    constructor(private http: HttpClient) {
        this.httpClient = http;
        this._nom = '';
        this._adress = '';
        this._code = '';
        this._unitPrice = 0.0;
    }

  createMoralEntity(){
    let requete = "http://localhost:"+this.portAPI+"/moralEntitie?Name="+this._nom+"&Address="+this._adress+"&Code="+this._code+"&UnitPrice="+this._unitPrice;
    console.log(requete);

    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };

    return this.http
      .put<any>(requete,requestOptions);
  }


    //GETTER & SETTER
    get nom(): string {
      return this._nom;
    }

    set nom(value: string) {
      this._nom = value;
    }

    get adress(): string {
      return this._adress;
    }

    set adress(value: string) {
      this._adress = value;
    }

    get code(): string {
      return this._code;
    }

    set code(value: string) {
      this._code = value;
    }

    get unitPrice(): number {
      return this._unitPrice;
    }

    set unitPrice(value: number) {
      this._unitPrice = value;
    }
}
