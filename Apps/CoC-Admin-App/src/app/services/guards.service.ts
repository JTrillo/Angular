import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(private router:Router, private firebase:FirebaseService) { }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<boolean>{
    return this.firebase.user.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if(!loggedIn){
          console.error("You have not permission to view this page");
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
