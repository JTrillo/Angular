import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FirebaseService, Request } from '../../services/firebase.service';
import { HyperledgerService } from '../../services/hyperledger.service';

declare var jQuery:any; //To import jQuery

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: []
})
export class ListComponent{
  displayedColumns: string[] = ['email', 'github', 'firstname', 'lastname', 'birthdate', 'gender', 'job', 'studies', 'office', 'select'];
  dataSource:MatTableDataSource<Request>;
  selection = new SelectionModel<Request>(true, []);
  requests:Request[];

  reason:FormControl;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private firebase:FirebaseService, private router:Router, private hyperledger:HyperledgerService) {
    this.requests = [];
    this.firebase.getRequests().subscribe(response=>{
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
      this.dataSource = new MatTableDataSource<Request>(this.requests);
      this.dataSource.paginator = this.paginator;
    });

    this.reason = new FormControl('', Validators.required);
  }

  //Quantity of rows selected
  selectedRows():number{
    let numSelected = this.selection.selected.length;
    return numSelected;
  }

  //If selected rows is equal the number of rows, this method will return true
  isAllSelected():boolean{
    if(this.dataSource === undefined) return false;
    return this.selectedRows() === this.dataSource.data.length;
  }

  //Select/deselect all rows
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  //Select/deselect one row
  toggleOne(row?: Request, position?:number): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${position}`;
  }

  //Accept one request
  acceptRequest(){
    let selected:Request = this.selection.selected[0];
    console.log(selected);
    //If request is accepted, we have to create the agent
    this.hyperledger.createAgent(selected.firstname, selected.lastname, selected.birthdate, selected.gender,
      selected.job, selected.studies, selected.office, selected.github).subscribe(response=>{
        console.log(response);
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
          this.firebase.deleteRequest(selected.email).then(response3=>{
            console.log(response3);
            //Refresh
            this.router.navigate(['/list']);
            //Send email
            this.sendMail(`${selected.firstname} ${selected.lastname}`, selected.email, true);
          });
        });
    });
    
  }

  //Decline one request
  declineRequest(){
    let selected:Request = this.selection.selected[0];
    //Delete request from Firestore
    this.firebase.deleteRequest(selected.email).then(response=>{
      console.log(response);
      //Close modal
      jQuery('#declineRequest').modal('hide');
      //Refresh
      this.router.navigate(['/list']);
      //Send email
      this.sendMail(`${selected.firstname} ${selected.lastname}`, selected.email, false, `Reason: ${this.reason.value}`);
    }); 
  }

  //Decline more than one request
  declineMultipleRequests(){
    let selected:Request[] = this.selection.selected;
    //Close modal
    jQuery('#declineMultipleRequests').modal('hide');
    selected.forEach(element=>{
      //Delete request from Firestore
      this.firebase.deleteRequest(element.email).then(response=>{
        console.log(response);
        //Refresh
        this.router.navigate(['/list']);
        //Send email
        this.sendMail(`${element.firstname} ${element.lastname}`, element.email, false, `Reason: ${this.reason.value}`);  
      });
    });
    
    
  }

  sendMail(name:string, receiver:string, accepted:boolean, reason?:string){
    let subject = "";
    let body = `Dear ${name},\r\n`;
    if(accepted){
      subject = "Welcome to the Chain of Custody system";
      body = "The attachment sent is necessary for the correct use of CoC Application." +
      "\r\n" + "First time you sign in, you will have to upload this file.";
    }else{
      subject = "Your request has been declined";
      body = reason;
    }
    body += "\r\n\r\n" + "Best Regards," +
    "\r\n" + "CoC App Administration Team";

    let link = `mailto:${receiver}`
             + `?subject=${encodeURIComponent(subject)}`
             + `&body=${encodeURIComponent(body)}`;

    window.location.href = link;
  }

  resetVariable(multiple:true){
    if(multiple){
      (<HTMLInputElement>document.getElementById("declineMultipleReason")).value = "";
      this.reason.setValue('');
    }else{
      (<HTMLInputElement>document.getElementById("declineReason")).value = "";
      this.reason.setValue('');
    }
  }
  
}
