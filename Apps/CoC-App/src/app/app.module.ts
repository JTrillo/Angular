import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NewCaseComponent } from './components/new-case/new-case.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { CaseComponent } from './components/case/case.component';
import { EvidenceComponent } from './components/evidence/evidence.component';
import { NewEvidenceComponent } from './components/new-evidence/new-evidence.component';
import { SignupComponent } from './components/signup/signup.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NewCaseComponent,
    ProfileComponent,
    LoginComponent,
    CaseComponent,
    EvidenceComponent,
    NewEvidenceComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase), //necesary for any module
    AngularFirestoreModule, //only needed for database module
    AngularFireStorageModule //only needed for storage module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
