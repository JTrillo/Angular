import { Component} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { FirebaseService, Request } from '../../services/firebase.service';
import { HyperledgerService } from '../../services/hyperledger.service';

declare var jQuery:any; //To import jQuery

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: []
})
export class ListComponent{
  requests:Request[];

  reason:FormControl;

  numSelected:number=0;
  selectedRows:number[]=[];

  github_used:boolean;
  github_selected:string;

  constructor(private firebase:FirebaseService, private hyperledger:HyperledgerService) {
    this.requests = [];
    this.firebase.getRequests().subscribe(response=>{
      this.requests = [];
      response.forEach(element=>{
        let request:Request = {
          email: element['email'],
          github: element['github'],
          firstname: element['firstname'],
          lastname: element['lastname'],
          birthdate: element['birthdate'],
          gender: element['gender'],
          job: element['job'],
          studies: element['studies'],
          office: element['office']
        };
        this.requests.push(request);
      });
    });

    this.reason = new FormControl('', Validators.required);
    this.github_used = false;
  }

  //Quantity of rows selected
  checkboxClicked(id:string){
    if((<HTMLInputElement>document.getElementById(id)).checked){
      this.numSelected = this.numSelected + 1;
      this.selectedRows.push(+id);
      this.selectedRows.sort();
    }else{
      this.numSelected = this.numSelected - 1;
      this.selectedRows = this.selectedRows.filter(element => element !== +id);
      this.selectedRows.sort();
    }
  }

  //Accept one request
  acceptRequest(){
    let selected:Request = this.requests[this.selectedRows[0]];
    this.github_used = false;
    this.github_selected = selected.github;
    //If request is accepted, we have to create the agent
    this.hyperledger.createAgent(selected.firstname, selected.lastname, selected.birthdate, selected.gender,
      selected.job, selected.studies, selected.office, selected.github).subscribe(response=>{
        //Then we have to issue the identity
        this.hyperledger.issueIdentity(selected.github).subscribe(response2=>{
          console.log(response2);
          //Download the card
          let cardData = response2;
          let filename = `${selected.github}@cocv2.card`;
          let type = 'application/octet-stream';

          var file = new Blob([cardData], {type: type});

          if (window.navigator.msSaveOrOpenBlob) { //IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
          } else { //Other browsers
              var url = window.URL.createObjectURL(file);
              var a = document.createElement("a");
              //a.id = identifier;
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
          }
          
          //Delete request from Firestore
          this.firebase.deleteRequest(selected.email).then(()=>{
            //Delete request locally
            this.requests = this.requests.filter(element => element.email !== selected.email);
            this.selectedRows = [];
            this.numSelected = 0;
            //Send email
            this.sendMail(`${selected.firstname} ${selected.lastname}`, selected.email, true);
          });
        });
    }, error =>{
      this.github_used = true;
    });
    
  }

  //Decline one request
  declineRequest(){
    let selected:Request = this.requests[this.selectedRows[0]];
    //Delete request from Firestore
    this.firebase.deleteRequest(selected.email).then(()=>{
      //Delete request locally
      this.requests = this.requests.filter(element => element.email !== selected.email);
      this.selectedRows = [];
      this.numSelected = 0;
      //Close modal
      jQuery('#declineRequest').modal('hide');
      //Send email
      this.sendMail(`${selected.firstname} ${selected.lastname}`, selected.email, false, `Reason: ${this.getReason(this.reason.value)}.`);
    });
  }

  //Decline more than one request
  declineMultipleRequests(){
    let selected:Request[] = [];
    this.selectedRows.forEach(element =>{
      selected.push(this.requests[element]);
    });
    this.selectedRows = [];
    this.numSelected = 0;
    //Close modal
    jQuery('#declineMultipleRequests').modal('hide');

    let emails = [];
    selected.forEach(element=>{
      emails.push(element.email);
      //Delete request from Firestore
      this.firebase.deleteRequest(element.email).then(()=>{
        //Delete request locally
        this.requests = this.requests.filter(aux => aux.email !== element.email);  
      });
    });
    //Send email
    this.sendMailToMany(emails, this.reason.value);
  }

  sendMail(name:string, receiver:string, accepted:boolean, reason?:string){
    let subject = "";
    let body = `Dear ${name},\r\n\r\n`;
    if(accepted){
      subject = "Welcome to the Chain of Custody system";
      body += "The attachment sent is necessary for the correct use of CoC Application." +
      "\r\n" + "First time you sign in, you will have to upload this file.";
    }else{
      subject = "Your request has been declined";
      body += "Your request to participate in Chain of Custody system for the management of digital evidences has been declined." + 
      "\r\n" + reason +
      "\r\n" + "If you think there has been a misunderstanding, please send a new request or contact with us.";
    }
    body += "\r\n\r\n" + "Best Regards," +
    "\r\n" + "CoC App Administration Team";

    let link = `mailto:${receiver}`
             + `?subject=${encodeURIComponent(subject)}`
             + `&body=${encodeURIComponent(body)}`;

    window.location.href = link;
  }

  sendMailToMany(emails:string[], reason:string){
    let name = "user";
    let receivers = emails[0];
    for(let i=1; i<emails.length; i++){
      receivers = receivers.concat(`;${emails[i]}`);
    }
    this.sendMail(name, receivers, false, `Reason: ${this.getReason(reason)}.`);
  }

  resetVariable(multiple:boolean){
    let radioButtons;
    if(multiple){
      radioButtons = document.getElementsByName("radioDeclineMultiple");
    }else{
      radioButtons = document.getElementsByName("radioDecline");
    }
    radioButtons.forEach(element=>{
      (<HTMLInputElement>element).checked = false;
    });
    this.reason.setValue('');
  }

  getReason(reason:string):string{
    //console.log(reason);
    if(reason === 'no_github'){
      return "Your Github ID does not exist";
    }else if(reason === 'unknown'){
      return "We can not verify who you are"
    }else{
      return reason;
    }
  }
  
}
