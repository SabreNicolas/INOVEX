import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        // @ts-ignore
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (localStorage.getItem('user') != undefined){
            return true;
        }
        else {
            this.router.navigate(['/']);
        }
    }
}