import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HyperledgerService, Profile} from './hyperledger.service';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private expirationTime:number;

  constructor(private hyperledger:HyperledgerService,
              private userdata:UserDataService,
              private router:Router) {
    this.expirationTime = 0;
  }

  public login(id:string){
    //Looking for the user
    this.hyperledger.getProfile(id).subscribe(response => {
      let profile:Profile = {
        identifier: response['participantId'],
        firstName: response['firstName'],
        lastName: response['lastName'],
        birthdate: response['birthdate'],
        gender: response['gender'],
        job: response['job'],
        studies: response['studies'],
        office: response['office']
      };
      console.log(profile);
      this.expirationTime = Date.now() + 1800000; //30 min token
      this.userdata.setUserProfile(profile); //Set user profile
      //Get user cases
      this.hyperledger.getUserCases(id).subscribe(response2 => {
        console.log(response2);
        this.userdata.setUserCases([]);

        //Get user evidences
        this.hyperledger.getUserEvidences(id).subscribe(response3 => {
          console.log(response3);
          this.userdata.setUserEvidences([]);

          //Navigate to home
          this.router.navigate(['/home']);
        });
      });
    }, error => {
      console.log(error);
    });
    
  }

  public logout(): void{
    this.expirationTime = 0;
  }

  public isAuthenticated(): boolean{
    return Date.now() < this.expirationTime;
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
