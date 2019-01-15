import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  
  token:string;

  constructor(private http: HttpClient) {
    console.log("SpotifyService loaded");

    /*
    I need take token with a server, so I use Postman for get it
    URL --> https://accounts.spotify.com/api/token
    body (x-www-form-urlencoded)
      grant_type --> client_credentials
      client_id --> ccaf759bf4e2461da40acbff680072cc
      client_secret --> df3dff05c80c4094ad72e4e420a3c42c
    */
    
    this.token = "BQAMSFBXMA_YKKRA-54rTAQT2DWhnOKQPqddpSmNQZfVVLQp1PfYvFRg4zqwadoN4lD0jphKsEGvCnw-4rU";
  }

  getNewReleases(){
    const HEADERS = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });

    return this.http.get('https://api.spotify.com/v1/browse/new-releases', {headers: HEADERS});
  }
}
