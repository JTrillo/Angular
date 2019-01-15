import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Heroe, HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  heroes: Heroe[] = [];
  term: string;
  constructor(private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    
    
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe( params => {
      this.term = params["term"];
      this.heroes = this.heroesService.searchHeroes(this.term);
    });
  }

  heroInfo(id:number){
    this.router.navigate(['/hero', id]);
  }

}
