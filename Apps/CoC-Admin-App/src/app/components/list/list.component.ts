import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FirebaseService, Request } from '../../services/firebase.service';

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

  constructor(private firebase:FirebaseService, private router:Router) {
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

  //Accept request
  acceptRequest(){
    let selected:Request = this.selection.selected[0];
  }

  //Cancel request
  cancelRequest(){
    let selected:Request = this.selection.selected[0];
  }

  cancelMultipleRequests(){
    let selected:Request[] = this.selection.selected;
  }
}
