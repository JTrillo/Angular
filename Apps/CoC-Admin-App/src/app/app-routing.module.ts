import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'list', component: ListComponent},
  { path: '**', pathMatch:'full', redirectTo: 'login' } //default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
