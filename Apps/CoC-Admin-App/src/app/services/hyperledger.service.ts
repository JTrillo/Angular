import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HyperledgerService {
  url = "https://104.155.2.231:3001/api/";

  constructor(private http:HttpClient) { }

  createAgent(firstname:string, lastname:string, birthdate:string, gender:string, job:string, studies:string, office:string, participantId:string){
    let resource_url = `${this.url}uma.coc.network.Agent`;
    let data = {
      $class: "uma.coc.network.Agent",
      firstName: firstname,
      lastName: lastname,
      birthdate: `${birthdate}T00:00:00.000Z`,
      gender: gender,
      job: job,
      studies: studies,
      office: office,
      participantId: participantId
    };
    return this.http.post(resource_url, data);
  }

  issueIdentity(participantId:string){
    let resource_url = `${this.url}system/identities/issue`;
    let data = {
      participant: `uma.coc.network.Agent#${participantId}`,
      userID: participantId,
      options: {}
    };
    return this.http.post(resource_url, data, {responseType: 'blob'});
  }
}
