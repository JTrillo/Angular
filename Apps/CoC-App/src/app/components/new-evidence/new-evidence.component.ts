import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HyperledgerService } from 'src/app/services/hyperledger.service';
import { UserDataService } from 'src/app/services/user-data.service';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-new-evidence',
  templateUrl: './new-evidence.component.html',
  styles: []
})
export class NewEvidenceComponent implements OnInit {

  case_id:string;
  form:FormGroup;
  file:File;
  filename:String = "Choose a file";
  end:boolean = false;

  // Main task 
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  constructor(private activatedRoute:ActivatedRoute,
              private location:Location,
              private hyperledger:HyperledgerService,
              private userdata:UserDataService,
              private router:Router,
              private storage:AngularFireStorage) {

    //CASE ID
    this.activatedRoute.params.subscribe( params => {
      this.case_id = params['case_id'];
    });

    //FORM
    this.form = new FormGroup({
      'identifier': new FormControl('', Validators.required),
      'evidence': new FormControl('', Validators.required),
      'hash_type': new FormControl('', Validators.required),
      'hash_value': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  addEvidence(){
    console.log( this.form.value );
    //TO DO --> Llamar a la transacción del chaicode 'AddEvidence'
    //TO DO --> Si la transacción tiene éxito mostrar mensaje de éxito (en el home?)
    //TO DO --> En caso contrario mostrar mensaje de error (misma ventana)

    // The storage path
    const path = `${this.case_id}/${this.form.value.identifier}`;
    // The main task
    this.task = this.storage.upload(path, this.file);
    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      tap(snap => {
        if(snap.bytesTransferred === snap.totalBytes){
          this.end = true;
        }
      })
    ).subscribe();
  }

  getFile(event: FileList){
    this.file = event.item(0);
    this.filename = this.file.name;
  }

  goBack(){
    this.location.back();
  }

  goHome(){
    this.router.navigate(['/home']);
  }

}
