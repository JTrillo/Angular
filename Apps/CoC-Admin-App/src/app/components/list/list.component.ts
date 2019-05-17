import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FirebaseService, Request } from '../../services/firebase.service';
import { HyperledgerService } from '../../services/hyperledger.service';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private firebase:FirebaseService, private router:Router, private hyperledger:HyperledgerService) {
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
      this.dataSource = new MatTableDataSource<Request>(this.requests);
      this.dataSource.paginator = this.paginator;
    });
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
          let blob = response2;
          let url = window.URL.createObjectURL(blob);
          window.open(url);
          //Delete request from Firestore
          this.firebase.deleteRequest(selected.email).then(response3=>{
            console.log(response3);
            //Send email
            this.sendMail(`${selected.firstname} ${selected.lastname}`, selected.email, true);
            this.router.navigate(['/list']);
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
      //Send email - TO DO --> Modal to ask a reason
      this.sendMail(`${selected.firstname} ${selected.lastname}`, selected.email, false, "Reason: your Github ID does not exist.");
    });
  }

  //Decline more than one request
  declineMultipleRequests(){
    let selected:Request[] = this.selection.selected;
    selected.forEach(element=>{
      //Delete request from Firestore
      this.firebase.deleteRequest(element.email).then(response=>{
        console.log(response);
        //Send email
        this.sendMail(`${element.firstname} ${element.lastname}`, element.email, false, "Reason: your Github ID does not exist.");
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
  
}
