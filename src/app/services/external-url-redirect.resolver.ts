import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalUrlRedirectResolver implements Resolve<void> {
  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    const externalUrl = route.paramMap.get('externalUrl');
    if (externalUrl) {
      window.location.href = externalUrl;
    } else {
      console.error('no externalUrl provided');
      this.router.navigate(['/']); // Redirect to home or another default route
    }
    return EMPTY; // Return an Observable that completes without emitting a value
  }
}