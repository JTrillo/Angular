import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ListComponent } from './components/list/list.component';

import { LoggedGuard } from './services/guards.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'list', component: ListComponent, canActivate: [LoggedGuard]},
  { path: '**', pathMatch:'full', redirectTo: 'list' } //default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
