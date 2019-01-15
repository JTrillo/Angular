import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
//import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({  providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(
  	private http : HttpClient,
  	private messageService : MessageService) { }

  //GET ALL HEROES
  getHeroes(): Observable<Hero[]> {
  	/*this.log('fetched heroes');
  	return of(HEROES);*/
  	return this.http.get<Hero[]>(this.heroesUrl)
	.pipe(
		tap(heroes => this.log('fetched heroes')),
		catchError(this.handleError('getHeroes', []))
	);
  }

  //GET HERO BY ID
  getHero(id: number): Observable<Hero> {
  	/*this.log(`fetched hero id=${id}`);
  	return of(HEROES.find(hero => hero.id === id));*/
  	const url = this.heroesUrl+'/'+id;
  	return this.http.get<Hero>(url)
	.pipe(
		tap(_ => this.log('fetched hero id '+id)),
		catchError(this.handleError<Hero>('getHero id='+id))
	);
  	
  }

  //UPDATE HERO
  updateHero(hero: Hero): Observable<any> {
  	return this.http.put(this.heroesUrl, hero, httpOptions)
  	.pipe(
  		tap(_ => this.log('updated hero id= '+hero.id)),
  		catchError(this.handleError<any>('updateHero'))
  	);
  }

  //ADD NEW HERO
  addHero(hero: Hero): Observable<Hero>{
  	return this.http.post(this.heroesUrl, hero, httpOptions)
  	.pipe(
  		tap((hero: Hero) => this.log('added hero w/ id= '+hero.id)),
  		catchError(this.handleError<Hero>('addHero'))
  	);
  }

  //DELETE HERO
  deleteHero(hero: Hero | number): Observable<Hero>{ //El argumento 'hero' puede ser de tipo 'Hero' o un número
  	const id = typeof hero === 'number' ? hero : hero.id;
  	const url = this.heroesUrl + '/' + id;
  	return this.http.delete<Hero>(url, httpOptions)
  	.pipe(
  		tap(_ => this.log('deleted hero id='+id)),
  		catchError(this.handleError<Hero>('deleteHero'))
  	);
  }

  //SEARCH HERO
  searchHeroes(term: string): Observable<Hero[]>{
  	term = term.trim();
  	if(!term){
  		return;
  	}

  	const url = this.heroesUrl +'?name=' + term;

  	return this.http.get<Hero[]>(url)
  	.pipe(
  		tap(_ => this.log('found heroes matching "'+term+'"')),
  		catchError(this.handleError<Hero[]>('searchHeroes', []))
  	);
  }

  private log(message: string) {
  	this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T> (operation = 'operation', result?: T){
  	return (error: any): Observable<T> => {

  		//Send the error to remote logging infrastructure
  		console.error(error);

  		//Better job of transforming error for user consumption
  		this.log(`${operation} failed: ${error.message}`);

  		//Let the app keep running by returning an empty result
  		return of(result as T);
  	};
  }
}
