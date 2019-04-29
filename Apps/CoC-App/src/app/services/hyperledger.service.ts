import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_ENDPOINT='http://34.76.28.34:3000/api/';
const NETWORK_NAMESPACE = 'uma.coc.network.';
const HTTP_OPTIONS_GET = {
  headers: new HttpHeaders({
    'x-api-key': '1234567890'
  })
};
const HTTP_OPTIONS_POST = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'x-api-key': '1234567890'
  })
}
@Injectable({
  providedIn: 'root'
})
export class HyperledgerService {

  constructor(private userdata: UserDataService,
              private http: HttpClient) { }

  //Get any user profie from blockchain
  getProfile(identifier:string) {
    let resource_url = `${API_ENDPOINT}${NETWORK_NAMESPACE}Agent/${identifier}`;
    return this.http.get(resource_url, HTTP_OPTIONS_GET);
  }

  //Get current user cases from blockchain and stores them in UserDataService
  getUserCases(identifier:string){
    let participant_fqi = `${NETWORK_NAMESPACE}Agent#${identifier}`
    let resource_url = `${API_ENDPOINT}queries/CasesByParticipant?participant_fqi=${participant_fqi}`
    return this.http.get(resource_url, HTTP_OPTIONS_GET);
  }

  //Get current user evidences from blockchain and stores them in UserDataService
  getUserEvidences(identifier:string){
    let owner_fqi = `${NETWORK_NAMESPACE}Agent#${identifier}`
    let resource_url = `${API_ENDPOINT}queries/EvidencesByParticipant?owner_fqi=${owner_fqi}`
    return this.http.get(resource_url, HTTP_OPTIONS_GET);
  }

  //Get evidences from case X
  getCaseEvidences(case_id:string){
    let case_fqi = `${NETWORK_NAMESPACE}Case#${case_id}`
    let resource_url = `${API_ENDPOINT}queries/EvidencesByCase?case_fqi=${case_fqi}`
    return this.http.get(resource_url, HTTP_OPTIONS_GET);
  }

  //Create a new case
  postNewCase(case_id:string, description:string){
    let data = {
      id: case_id,
      description: description
    };
    let resource_url = `${API_ENDPOINT}${NETWORK_NAMESPACE}OpenCase`;
    return this.http.post(resource_url, data, HTTP_OPTIONS_POST);

  }
}

export interface Profile {
  identifier:string,
  firstName:string,
  lastName:string,
  birthdate:Date,
  gender:string,
  job:string,
  studies:string,
  office:string
}

export interface Case {
  identifier:string,
  description:string,
  openingDate:Date,
  resolution?:string,
  closureDate?:Date,
  status:string,
  openedBy:Profile,
  participants:Profile[]
}

export interface Evidence {
  identifier:string,
  hash:string,
  hashType:string,
  description:string,
  additionDate:Date,
  owner:Profile,
  olderOwners:Owner[],
  case:Case
}

interface Owner {
  owner:string,
  until:Date
}