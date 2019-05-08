import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_ENDPOINT='http://104.155.2.231:3000/api/';
const NETWORK_NAMESPACE = 'uma.coc.network.';

@Injectable({
  providedIn: 'root'
})
export class HyperledgerService {

  constructor(private http: HttpClient) { }

  //Get user wallet
  getWallet() {
    let resource_url = `${API_ENDPOINT}wallet`;
    return this.http.get(resource_url, {withCredentials: true});
  }

  //Get any user profie from blockchain
  getProfile(identifier:string) {
    let resource_url = `${API_ENDPOINT}${NETWORK_NAMESPACE}Agent/${identifier}`;
    return this.http.get(resource_url, {withCredentials: true});
  }

  //Get current user cases from blockchain and stores them in UserDataService
  getUserCases(identifier:string){
    let participant_fqi = `resource%3A${NETWORK_NAMESPACE}Agent%23${identifier}`
    let resource_url = `${API_ENDPOINT}queries/CasesByParticipant?participant_fqi=${participant_fqi}`
    return this.http.get(resource_url, {withCredentials: true});
  }

  //Get current user evidences from blockchain and stores them in UserDataService
  getUserEvidences(identifier:string){
    let owner_fqi = `resource%3A${NETWORK_NAMESPACE}Agent%23${identifier}`
    let resource_url = `${API_ENDPOINT}queries/EvidencesByParticipant?owner_fqi=${owner_fqi}`
    return this.http.get(resource_url, {withCredentials: true});
  }

  //Get evidences from case X
  getCaseEvidences(case_id:string){
    let case_fqi = `resource%3A${NETWORK_NAMESPACE}Case%23${case_id}`
    let resource_url = `${API_ENDPOINT}queries/EvidencesByCase?case_fqi=${case_fqi}`
    return this.http.get(resource_url, {withCredentials: true});
  }

  //1. OpenCase transaction of the blockchain - This tx creates a new case
  postNewCase(case_id:string, description:string){
    let data = {
      id: case_id,
      description: description
    };
    let resource_url = `${API_ENDPOINT}${NETWORK_NAMESPACE}OpenCase`;
    return this.http.post(resource_url, data, {withCredentials: true});
  }

  //2. CloseCase transaction of the blockchain - This tx closes a case
  postCloseCase(case_id:string, resolution:string){
    let data = {
      id: case_id,
      resolution: resolution
    };
    let resource_url = `${API_ENDPOINT}${NETWORK_NAMESPACE}CloseCase`;
    return this.http.post(resource_url, data, {withCredentials: true});
  }

  //3. AddParticipant transaction of the blockchain - This tx includes a participant (in this moment, only agents) in a case
  postAddParticipant(case_id:string, participant_type:string, participant_id:string){
    let data = {
      case_id: case_id,
      participant_type: participant_type,
      participant_id: participant_id
    };
    let resource_url = `${API_ENDPOINT}${NETWORK_NAMESPACE}AddParticipant`;
    return this.http.post(resource_url, data, {withCredentials: true});
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
  openedBy:string,
  participants:string[]
}

export interface Evidence {
  identifier:string,
  hash:string,
  hashType:string,
  description:string,
  additionDate:Date,
  owner:string,
  olderOwners:Owner[],
  case:Case
}

interface Owner {
  owner:string,
  until:Date
}