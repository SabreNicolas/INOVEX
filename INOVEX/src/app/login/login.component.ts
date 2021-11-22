import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide : boolean = true;

  constructor() { }

  ngOnInit(): void {
    var mdpCrypt = Md5.hashStr('admin');
  }

  changeVisibility() {
    this.hide = !this.hide;
  }

}
