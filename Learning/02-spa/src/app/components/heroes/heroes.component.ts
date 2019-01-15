import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Heroe, HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Heroe[] = [];

  constructor(private heroesService: HeroesService,
              private router: Router
  ) {
    
  }

  ngOnInit() {
    this.heroes = this.heroesService.getHeroes();
  }

  heroInfo(id:number){
    this.router.navigate(['/hero', id]);
  }
}