import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms'

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit{
  email:FormControl;
  emailSent:boolean;
  emailError:boolean;
  aux:string;

  constructor(private router:Router, private firebase:FirebaseService) {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.emailSent = false;
    this.emailError = false;
  }

  ngOnInit() {
    const url = this.router.url;
    if(url.includes('signIn')){ //Esto quiere decir que el componente se ha inicializado gracias al link de autenticación
      this.firebase.confirmSignIn(url).then(response=>{ //Si la confirmación tiene éxito, navegar al listado de requests
        window.localStorage.removeItem('emailCoCAdmin');
        this.router.navigate(['/list']);
      }).catch(err=>{
        console.log(err);
      });
    }
  }

  sendEmailLink(){
    if(this.email.valid){
      //Check if the email exists in the collection of admins
      this.firebase.getAdmin(this.email.value).subscribe(response=>{
        if(response !== undefined){ //Email exists
          //Send link to admin email
          this.firebase.sendEmailLink(this.email.value).then(response=>{
            //Store email in local storage
            window.localStorage.setItem('emailCoCAdmin', this.email.value);
            this.emailError = false;
            this.emailSent = true;
          }).catch(err=>{
            console.log(err);
          });
        }else{ //Email does not exist
          this.aux = this.email.value;
          this.emailError = true;
        }
      });
    }
  }

}
