import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  form:FormGroup;
  failUserId:string;
  showFail:boolean

  constructor(private router:Router,
              private auth:AuthService) {
    this.form = new FormGroup({
      'identifier': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
    this.showFail = false;
  }

  ngOnInit() {
  }

  signin(){
    console.log(this.form.value);
    let identifier = this.form.value.identifier;
    let password = this.form.value.password;
    let success:boolean = this.auth.login(identifier, password);
    if(success){
      this.router.navigate(['/home']);
    }else{
      this.failUserId = identifier;
      this.showFail = true;
    }
  }

  signup(){
    this.router.navigate(['/signup']);
  }
}
