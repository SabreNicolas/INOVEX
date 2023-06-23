import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {NgForm} from "@angular/forms";
import {loginService} from "../services/login.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide : boolean = true;
  loginKO : boolean = false;
  public pwd : string;
  public MD5pwd : string;
  public login : string;

  constructor(private loginService : loginService, private router : Router) {
    this.login = '';
    this.pwd = '';
    this.MD5pwd = '';
  }

  ngOnInit(): void {
    if (localStorage.getItem('user') != undefined){
      this.router.navigate(['/accueil']);
    }
  }

  //connexion utilisateur
  onSubmit(form : NgForm) {
    this.login = form.value['identifiant'];
    this.pwd = form.value['pwd'];
    this.MD5pwd = Md5.hashStr(this.pwd);

    this.loginService.getUserLoged(this.login,this.MD5pwd).subscribe((response)=>{
      // @ts-ignore
      if(response.data.length > 0) {
        this.loginKO = false;
        // @ts-ignore
        localStorage.setItem('user',JSON.stringify(response.data[0]));
        //stockage du token dans le localStorage
        // @ts-ignore
        localStorage.setItem('token',response.token);
        this.router.navigate(['/accueil']);
      }
      else {
        this.loginKO = true;
      }
    });
  }

  changeVisibility() {
    this.hide = !this.hide;
  }

}
