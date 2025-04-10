import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  RouterOutlet,
} from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  CommonModule,
  isPlatformBrowser,
} from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ScrollService } from "./services/scroll.service";
import { RouterModule } from "@angular/router";
import { CartService } from "./services/cart.service";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CookieService } from 'ngx-cookie-service';
import { GoogleAnalyticsService } from "./services/google-analytics.service";
import { fromEvent, map, merge, of, Subscription } from "rxjs";
import { AnonymousUserService } from "./services/anonUser.service";

declare let gtag: Function;
declare let fbq: Function;

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FooterComponent,
    NavbarComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [GoogleAnalyticsService],
})
export class AppComponent implements OnInit {
  title = "Kubona.ng";
  newsletterForm: FormGroup;
  newsletterSuccess: any;
  cookieGCLID: string = '';
  cookieFBCLID: string = '';
  myDate: Date = new Date();
  expiryDate = (this.myDate.getDay() + 4);
  cookiesEnabled: boolean = false;
  networkStatus: any;
  networkStatus$: Subscription = Subscription.EMPTY;
  cookieService = inject(CookieService)
  private platformId = inject(PLATFORM_ID);

  constructor(
    private router: Router,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private googleService: GoogleAnalyticsService,
    private anonymousUser: AnonymousUserService
  ) {
    this.newsletterForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          if (typeof gtag === 'function') {
            gtag('config', 'UA-1299523-10', {
              'page_path': event.urlAfterRedirects,
            });
            gtag('config', '1062104035', {
              'page_path': event.urlAfterRedirects,
            });
          } else {
            console.warn('gtag function not found.');
          }
          if (typeof fbq === 'function') {
            fbq('track', 'PageView');
          } else {
            console.warn('fbq function not found.');
          }
        }
      }
    });
  }

  ngOnInit() {
    this.anonymousUser.retrieveAnonymousUserId().subscribe(response => {
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollService.scrollToTop();
      }
    });
    this.checkNetworkStatus();
    if (isPlatformBrowser(this.platformId)) {
      if (navigator.cookieEnabled) {
        this.cookiesEnabled = true;
        this.cookieService.set('cookieConsent', "true", {
          expires: this.expiryDate,
          path: '/',
        });
      } else {
        this.cookiesEnabled = false;
      }
    } else {
      this.cookiesEnabled = false; // Default value for server-side
    }
    this.activatedRoute.queryParams.subscribe(response => {
      this.cookieGCLID = response["gclid"];
      this.cookieFBCLID = response["fbclid"];
      const cookieGExists: boolean = this.cookieService.check('gclid');
      const cookieFBExists: boolean = this.cookieService.check('fbclid');
      if (this.cookieGCLID != null) {
        this.cookieService.set('gclid', this.cookieGCLID, {
          expires: this.expiryDate,
          path: '/',
        });
      }
      if (this.cookieFBCLID != null) {
        this.cookieService.set('fbclid', this.cookieFBCLID, {
          expires: this.expiryDate,
          path: '/',
        });
      }
    });
  }

  checkNetworkStatus() {
    if (isPlatformBrowser(this.platformId)) {
      this.networkStatus = navigator.onLine;
      this.networkStatus$ = merge(
        of(null),
        fromEvent(window, 'online'),
        fromEvent(window, 'offline')
      )
        .pipe(map(() => navigator.onLine))
        .subscribe(status => {
          console.log('status', status);
          this.networkStatus = status;
        });
    } else {
      console.log('Network status checks not performed on the server.');
      this.networkStatus = true; // Assume online on server, or handle differently
    }
  }
}