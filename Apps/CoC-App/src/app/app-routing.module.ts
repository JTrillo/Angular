import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NewCaseComponent } from './components/new-case/new-case.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CaseComponent } from './components/case/case.component';
import { EvidenceComponent } from './components/evidence/evidence.component';
import { NewEvidenceComponent } from './components/new-evidence/new-evidence.component';

import { LoggedGuard, CaseGuard, EvidenceGuard } from './services/guards.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent,},
  { path: 'home', component: HomeComponent, canActivate: [LoggedGuard] },
  { path: 'newcase', component: NewCaseComponent, canActivate: [LoggedGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [LoggedGuard] },
  { path: 'profile/:user_id', component: ProfileComponent, canActivate: [LoggedGuard] },
  { path: 'case/:case_id',
    component: CaseComponent,
    canActivate: [LoggedGuard, CaseGuard],
    /*children: [
      { path: 'newevidence', component: NewEvidenceComponent}
    ]*/
  },
  { path: 'case/:case_id/newevidence', component: NewEvidenceComponent, canActivate: [LoggedGuard, CaseGuard]},
  { path: 'evidence/:evi_id', component: EvidenceComponent, canActivate: [LoggedGuard, EvidenceGuard]},
  { path: '**', pathMatch:'full', redirectTo: 'home' } //default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
