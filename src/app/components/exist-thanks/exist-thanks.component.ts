import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { FacebookEventService } from '../../services/facebook-events.service';
import { ConversionsAPIService } from '../../services/conversions-api.service';
import { CartService } from '../../services/cart.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-exist-thanks',
  imports: [CommonModule,],
  templateUrl: './exist-thanks.component.html',
  styleUrl: './exist-thanks.component.css'
})
export class ExistThanksComponent implements OnInit {
  public orderId: number = 0;
  public url: string = '';
  public phoneNumber: string = "";
  public total: number = 0;
  public orderedToday: boolean = false;
  private userAgent: string = "";
  private event_source_url: string = "";
  private unixTime = Math.floor(new Date().getTime() / 1000.0);
  private _fbc: string | null = "";
  private _fbp: string | null = "";
  private clientIP: string | null = "";
  private data: any;


  constructor(private cookieService: CookieService, private activatedRoute: ActivatedRoute, private router: Router,
    private googleService: GoogleAnalyticsService, private facebookService: FacebookEventService, private conversionsAPI: ConversionsAPIService,
    private orderService: CartService) {
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state) {
        const state = navigation.extras.state as { [key: string]: any };
        // this.orderId = state['orderId'] ?? null;
        this.total = state['total'] ?? null;
      }
    });
  }


  ngOnInit(): void {
    this.orderId = Number(this.cookieService.get('norderId'))
    this.userAgent = navigator.userAgent;
    this.event_source_url = window.location.href;
    const fbcExists: boolean = this.cookieService.check('_fbc');
    const fbpExists: boolean = this.cookieService.check('_fbp');
    const phoneExists: boolean = this.cookieService.check('Phone');

    this._fbc = fbcExists ? this.cookieService.get('_fbc') : null;
    this._fbp = fbpExists ? this.cookieService.get('_fbp') : null;
    this.conversionsAPI.getIPAddress().subscribe((response: any) => {
      this.clientIP = response;
    });
    this.phoneNumber = this.cookieService.get('Phone');
    this.url = this.cookieService.get('WhatsappUrl');

    this.orderService.customerOrderedToday(this.phoneNumber, 101, this.orderId).subscribe(response => {
      this.orderedToday = response;
      if (!this.orderedToday) {
        this.facebookService.initiatePurchase(this.total, this.orderId);
        this.googleService.ga4eventEmitter('purchase', this.orderId.toString(), this.total);
      }
    });

    setTimeout(() => {
      this.router.navigate(['/externalRedirect', { externalUrl: this.url }]).catch(error => {
        console.error('Navigation error:', error);
      });
    }, 2000);
    this.cookieService.delete('norderId');
  }


  // sendConversionData() {
  //   this.data = this.conversionsAPI.getEventData("Purchase", this.unixTime, "website", this.orderId.toString(), this.event_source_url, this.clientIP, this.userAgent, this._fbc, this._fbp, [null], "NGN", this.total.toString());
  //   const send = JSON.stringify(this.data, null, 2);
  //   this.conversionsAPI.sendToFB(send).subscribe(response => {
  //     console.log(response);
  //     this.cookieService.delete('Phone');
  //     this.cookieService.delete('WhatsappUrl');
  //   }, error => {
  //     console.log(error);
  //   });
  // }
}
