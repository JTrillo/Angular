import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userdata:UserDataService,
              private router:Router) {
  }

  public logout(): void{
    this.userdata.reset();
    this.router.navigate(['/signup']);
  }

  public isAuthenticated(): boolean{
    return this.userdata.getUserProfile() !== undefined;
  }

  //Returns true if current user participates in case with id 'case_id'
  public participatesInCase(case_id:string): boolean{
    for(let caso of this.userdata.getUserCases()){
      if(caso.identifier==case_id){
        return true;
      }
    }
    return false;
  }

  //Returns true if current user is the owner of the evidence
  public ownerOfEvidence(evidence_id:string): boolean{
    for(let evidence of this.userdata.getUserEvidences()){
      if(evidence.identifier==evidence_id){
        return true;
      }
    }
    return false;
  }
}
