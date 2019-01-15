import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//import { Heroe, HeroesService} from '../../../services/heroes.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(/*private heroesService: HeroesService,*/
              private router: Router) { }

  ngOnInit() {
  }

  buscarHeroes(term:string) {
    //console.log(term);
    //console.log(this.heroesService.searchHeroes(term.trim()));
    if(term.trim()!="" && term.trim()!=undefined && term.trim()!=null){
      this.router.navigate(['/search', term]);
    }
  }
}
