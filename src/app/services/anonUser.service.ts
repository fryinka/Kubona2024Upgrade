import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

const ANONYMOUS_USER_ID_KEY = makeStateKey<string>('anonymousUserId');

@Injectable({
    providedIn: 'root'
})
export class AnonymousUserService {

    private apiUrl = 'https://localhost:44397/api/User'; // API endpoint

    constructor(
        @Inject(PLATFORM_ID) private platformId: any, 
        private http: HttpClient,
        private transferState: TransferState, 
        private cookieService: CookieService
    ) {}

    retrieveAnonymousUserId(): Observable<string | null> {
        let userId: string | null = null;

        if (isPlatformBrowser(this.platformId)) {
            userId = this.cookieService.get('kubona_shopper'); // Check cookie
        } else {
            userId = this.transferState.get<string>(ANONYMOUS_USER_ID_KEY, '');
            this.transferState.remove(ANONYMOUS_USER_ID_KEY);
        }

        if (userId) {
            return of(userId); // Return the stored ID
        } else {
            return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
                tap(fetchedUserId => {
                    if (fetchedUserId) {
                        this.storeAnonymousUserId(fetchedUserId.userId); // Store the new ID
                    }
                }),
                catchError(error => {
                    console.error('Error fetching anonymous user ID:', error);
                    return of(null);
                })
            );
        }
    }

    storeAnonymousUserId(userId: string): void {
        if (isPlatformBrowser(this.platformId)) {
            this.cookieService.set('kubona_shopper', userId);
        } else {
            this.transferState.set(ANONYMOUS_USER_ID_KEY, userId);
        }
    }

}
