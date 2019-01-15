import { Component, OnInit } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  searchBox: string;
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
  	private heroService: HeroService) { }

  ngOnInit() {
  	this.heroes$ = this.searchTerms.pipe(
	  	//Wait 300ms after each keystroke before considering the term
	  	debounceTime(300),

	  	//Ignore new term if same as previous term
	  	distinctUntilChanged(),

	  	//Switch to new search observable each time the term changes
	  	switchMap((term: string) => {
	  		if(term.trim() === ''){
	  			console.log('Hi!');
	  			return of<Hero[]>([]); //Empty observable
	  		}else{
	  			console.log(term);
	  			return this.heroService.searchHeroes(term);
	  		}
	  	})

	  	//switchMap((term: string) => this.heroService.searchHeroes(term))
  	);
  }

  search(): void{
  	this.searchTerms.next(this.searchBox);
  }

}
