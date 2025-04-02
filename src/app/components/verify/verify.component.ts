import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { FacebookEventService } from '../../services/facebook-events.service';
import { CookieService } from 'ngx-cookie-service';
import { SeoService } from '../../services/seo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class VerifyComponent implements OnInit {
  public whatAppUrl: string = "";
  public orderId: number = 0;
  public total: number = 0;
  public verifyForm!: FormGroup; // Added definite assignment assertion
  submitted: boolean = false;
  paymentOption: number = 0;
  url: string = "";

  constructor(private cartService: CartService, private activatedRoute: ActivatedRoute, private router: Router, private builder: FormBuilder, private googleService: GoogleAnalyticsService,
    private facebookService: FacebookEventService, private cookieService: CookieService, private seoService: SeoService
  ) {
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state) {
        const state = navigation.extras.state as { [key: string]: any };
        // this.orderId = state['orderId'] ?? null;
        this.total = state['total'] ?? null;
      }
    });
  }

  ngOnInit() {
    this.seoService.updateDescription("Verify New Customer");
    this.seoService.updateTitle(
      "Verify New Customer - Kubona - Premium Italian Leather Shoes."
    );
    this.verifyForm = this.builder.group({
      paymentOption: ["", [Validators.required]],
    });
    this.orderId = Number(this.cookieService.get('norderId'))
    // this.url = this.cookieService.get('WhatsppUrl');
  }

  get f() {
    return this.verifyForm.controls;
  }

  completeOrder() {
    this.submitted = true;
    if (this.verifyForm.valid) {
      this.paymentOption = this.verifyForm.controls["paymentOption"].value;
      if (this.paymentOption == 104) {
        this.facebookService.initiateLeadGen(this.total, this.orderId); // sends lead event to FB if option is 104
      }
      this.cartService.verifyNewUser(this.orderId, this.paymentOption).subscribe((response: { whatsAppUrl: string }) => {
        this.url = response.whatsAppUrl;
        this.router.navigate(["/externalRedirect", { externalUrl: this.url },]);
        this.cookieService.delete('norderId');
      });
      // this.cookieService.delete('WhatsppUrl');
    }
  }
}