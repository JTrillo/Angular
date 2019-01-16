import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { NewCaseComponent } from './components/new-case/new-case.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'newcase', component: NewCaseComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'profile/:user_id', component: ProfileComponent},
  { path: '**', pathMatch:'full', redirectTo: 'home' } //default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
