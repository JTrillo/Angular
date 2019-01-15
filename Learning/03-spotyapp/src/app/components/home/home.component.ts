import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  
  songs:any[] = [];

  constructor(private spotify:SpotifyService) {
    this.spotify.getNewReleases().subscribe( (response:any) => {
      console.log(response.albums.items);
      this.songs = response.albums.items;
    });
  }

  ngOnInit() {
  }

}
