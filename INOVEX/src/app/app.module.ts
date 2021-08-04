import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoralEntitiesComponent } from './moral-entities/moral-entities.component';
import {HttpClientModule} from "@angular/common/http";
import {moralEntitiesService} from "./services/moralentities.service";
import { ListMoralEntitiesComponent } from './list-moral-entities/list-moral-entities.component';
import { CategoriesComponent } from './categories/categories.component';
import { ListCategoriesComponent } from './list-categories/list-categories.component';

@NgModule({
  declarations: [
    AppComponent,
    MoralEntitiesComponent,
    ListMoralEntitiesComponent,
    CategoriesComponent,
    ListCategoriesComponent
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
