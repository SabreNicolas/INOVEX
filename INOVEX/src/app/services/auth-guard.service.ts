import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Location} from "@angular/common";

@Injectable()
export class AuthGuard  {

    constructor(private router: Router, private location: Location) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        // @ts-ignore
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        //Si user logged on fait les tests de droits
        if (localStorage.getItem('user') != undefined){
            //on récupére le user co
            var userLogged = localStorage.getItem('user');
            if (typeof userLogged === "string") {
                var userLoggedParse = JSON.parse(userLogged);
                //test pour admin
                if (this.location.path() === '/admin') {
                    if (userLoggedParse['isAdmin'] === true){
                        return true;
                    }
                    else this.router.navigate(['/']);
                }
                //test pour qse
                else if (this.location.path() === '/qse') {
                    if (userLoggedParse['isQSE'] === true){
                        return true;
                    }
                    else this.router.navigate(['/']);
                }
                //test pour saisie
                else if (this.location.path() === '/saisie') {
                    if (userLoggedParse['isSaisie'] === true || userLoggedParse['isChefQuart'] === true){
                       return true;
                    }
                    else this.router.navigate(['/']);
                }
                //test pour rondier
                else if (this.location.path() === '/reporting') {
                    if (userLoggedParse['isRondier'] === true){
                        return true;
                    }
                    else this.router.navigate(['/']);
                }
                //test pour rapports
                else if (this.location.path() === '/rapports') {
                    if (userLoggedParse['isRapport'] === true){
                        return true;
                    }
                    else this.router.navigate(['/']);
                }
                else return true;
            }
        }
        //SINON on envoi vers la connexion
        else {
            this.router.navigate(['/']);
        }
    }
}