import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HyperledgerService, Case, Evidence } from 'src/app/services/hyperledger.service';
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
  file_extension:string;

  // Main task 
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  executing_tx:boolean;
  uploading:boolean;
  end:boolean;

  readonly hash_utility_url:string = "http://descargar.cnet.com/MD5-SHA-Checksum-Utility/3000-2092_4-10911445.html";

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

    this.executing_tx = false;
    this.uploading = false;
    this.end = false;
  }

  ngOnInit() {
  }

  addEvidence(){
    console.log( this.form.value );
    let identifier = this.form.value.identifier;
    let hash = this.form.value.hash_value;
    let hash_type = this.form.value.hash_type;
    let description = this.form.value.description;
    //Llamar a la transacción del chaicode 'AddEvidence'
    this.executing_tx = true;
    this.hyperledger.postAddEvidence(identifier, hash, hash_type, description, this.file_extension, this.case_id).subscribe(response =>{
      console.log(response);
      this.executing_tx = false;
      this.uploading = true;
      //Si la transacción tiene éxito mostrar mensaje de éxito, subir la evidencia al repo de ficheros
      this.uploadEvidence(identifier);
    });
  }

  uploadEvidence(identifier:string){
    // The storage path
    const path = `${this.case_id}/${identifier}.${this.file_extension}`;
    // The main task
    this.task = this.storage.upload(path, this.file);
    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      tap(snap => {
        if(snap.bytesTransferred === snap.totalBytes){
          this.uploading = false;
          this.end = true;
          
          //Add evidence to user data service
          let caso:Case = this.userdata.getCase(this.case_id);
          let evidence:Evidence = {
            identifier: this.form.value.identifier,
            hash_value: this.form.value.hash_value,
            hash_type: this.form.value.hash_type,
            description: this.form.value.description,
            extension: this.file_extension,
            additionDate: new Date(),
            owner: this.userdata.getUserProfile().identifier,
            olderOwners: [],
            case: caso
          };
          let evidences = this.userdata.getUserEvidences();
          evidences.push(evidence);
          this.userdata.setUserEvidences(evidences);
        }
      })
    ).subscribe();
  }

  getFile(event: FileList){
    this.file = event.item(0);
    this.filename = this.file.name;
    let aux = this.filename.split(".");
    this.file_extension = aux[aux.length-1];
  }

  goBack(){
    this.location.back();
  }

  goHome(){
    this.router.navigate(['/home']);
  }

}
