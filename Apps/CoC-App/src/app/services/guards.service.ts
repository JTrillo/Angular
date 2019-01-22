import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(private router:Router,
              private auth:AuthService) { }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot){
    if(this.auth.isAuthenticated()){
      return true;
    }else{
      console.error("You have not permission to view this page");
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class CaseGuard implements CanActivate {

  constructor(private router:Router,
              private auth:AuthService) { }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot){
    let case_id:string = route.params['case_id'];
    if(this.auth.participatesInCase(case_id)){
      return true;
    }else{
      console.error("You are not involved this case");
      this.router.navigate(['/home']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class EvidenceGuard implements CanActivate {

  constructor(private router:Router,
              private auth:AuthService) { }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot){
    let evidence_id:string = route.params['evi_id'];
    //console.log(route);
    //console.log(state);
    if(this.auth.ownerOfEvidence(evidence_id)){
      return true;
    }else{
      console.error("You are not the current owner of the evidence");
      this.router.navigate(['/home']);
      return false;
    }
  }
}