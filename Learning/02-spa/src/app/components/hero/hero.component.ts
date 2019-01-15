import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Heroe, HeroesService } from '../../services/heroes.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  
  hero: Heroe;

  constructor(private activatedRoute: ActivatedRoute,
              private heroService: HeroesService,
              private location: Location
  ) {

    this.activatedRoute.params.subscribe( params => {
      this.hero = this.heroService.getHero(params['id']);
      console.log(this.hero);
    });
  }

  ngOnInit() {
  }

  goBack(): void{
    this.location.back();
  }

}
