import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoralEntitiesComponent } from './moral-entities/moral-entities.component';
import {HttpClientModule} from "@angular/common/http";
import {moralEntitiesService} from "./services/moralentities.service";
import { ListMoralEntitiesComponent } from './list-moral-entities/list-moral-entities.component';

@NgModule({
  declarations: [
    AppComponent,
    MoralEntitiesComponent,
    ListMoralEntitiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    moralEntitiesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
