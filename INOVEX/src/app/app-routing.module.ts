import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoralEntitiesComponent } from './moral-entities/moral-entities.component';

const routes: Routes = [
{
    path: 'clients',
    component: MoralEntitiesComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
