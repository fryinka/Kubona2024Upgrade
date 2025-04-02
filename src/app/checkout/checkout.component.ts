import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NumberToWordsPipe } from "../services/num2text.pipe";
import { CartService } from "../services/cart.service";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { FacebookEventService } from "../services/facebook-events.service";
import { GoogleAnalyticsService } from "../services/google-analytics.service";
import { CookieService } from "ngx-cookie-service";
import { ConversionsAPIService } from "../services/conversions-api.service";

@Component({
  selector: "app-checkout",
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NumberToWordsPipe],
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"]
})
export class CheckoutComponent implements OnInit {
  public checkoutForm: FormGroup;
  public checkoutSuccess: boolean = false;
  public submitted: boolean = false;
  public whatAppUrl: string = "";
  private pageIndex: number = 0;
  private pageSize: number = 200;
  public orderId: number = 0;
  public orderItemId: number = 0;
  public phoneNumber: string = "";
  public total: number = 0;
  public source: string = "";
  public isValidFormSubmitted: boolean = false;
  public Error: string = "";
  public g_clid: string = "";
  public fb_clid: string = "";
  public related: any[] = [];
  public dept = 0;
  public prodId = 0;
  public custExt: boolean = false;
  public whatsappExt: boolean = false;
  public gclid: string = "";
  public fbclid: string = "";
  public verifyNum: string = "";
  private _fbc: string | null = "";
  private _fbp: string | null = "";
  private clientIP: string = "";
  public orderedToday: boolean = false;
  public redirectingToWhatsAPP: boolean = false;


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private cartService: CartService, private breakpointObserver: BreakpointObserver, private facebookService: FacebookEventService,
    private googleService: GoogleAnalyticsService, private cookieService: CookieService, private conversionsAPI: ConversionsAPIService
  ) {
    this.checkoutForm = this.fb.group({
      gsm: ["", [Validators.required, Validators.pattern("^0?[7-9]?[0-9]{9}$")]], // Nigerian phone number validation
      gclid: [this.g_clid],
      fbclid: [this.fb_clid],
    });
  }

  ngOnInit(): void {
    this.getActiveOrder();
    const cookieGExists: boolean = this.cookieService.check("gclid");
    const cookieFBExists: boolean = this.cookieService.check("fbclid");
    const fbcExists: boolean = this.cookieService.check("_fbc");
    const fbpExists: boolean = this.cookieService.check("_fbp");
    if (cookieGExists) {
      this.g_clid = this.cookieService.get("gclid");
    }
    if (cookieFBExists) {
      this.fb_clid = this.cookieService.get("fbclid");
    }
    this._fbc = fbcExists ? this.cookieService.get("_fbc") : null; //fbclid
    this._fbp = fbpExists ? this.cookieService.get("_fbp") : null; //fbp - browser id
    this.conversionsAPI.getIPAddress().subscribe((response: any) => {
      this.clientIP = response;
    }); //IP address

    this.setBrowserSource();
  }
  getActiveOrder() {
    this.cartService.getActiveOrderFromDB().subscribe(response => {
      // console.log(response);
      this.total = response.totalValue;
      this.cookieService.set('norderId',response.orderId.toString());
    });
  }

  completeOrder() {
    this.submitted = true;
    const num = this.checkoutForm.controls["gsm"].value;
    this.phoneNumber = num.length === 10 && !num.startsWith("0") ? "0" + num : num;
    const gclid = this.checkoutForm.controls["gclid"].value;
    const fbclid = this.checkoutForm.controls["fbclid"].value;

    if (this.checkoutForm.invalid) {
      this.Error = "PLEASE ENTER YOUR WHATSAPP NUMBER!";
      return;
    }

    this.cartService.checkExisting(this.phoneNumber).subscribe((response: any) => {
      this.custExt = response;
      const paymentOption = this.custExt ? 101 : 100;
      this.cartService.checkoutOrder(this.source, this.phoneNumber, this.total, gclid, fbclid, this.custExt, paymentOption      )
        .subscribe(          (result) => {
            this.whatAppUrl = result.whatsAppUrl;
            if (this.custExt) {
              this.handleExistingCustomer();
            } else {
              this.handleNewCustomer();
            }
            // Clear the cart after a successful order
            this.cartService.clearCart();
          },
          (error) => console.error(error)
        );
    });
  }

  handleExistingCustomer() {
    if (this.whatAppUrl) {
      this.cookieService.set("WhatsappUrl", this.whatAppUrl);
      this.cookieService.set("Phone", this.phoneNumber);
      const navigationExtras: NavigationExtras = {
        state: {
          orderId: this.orderId,
          total: this.total,
        },
      };
      this.router.navigate(["/thanks"], navigationExtras);
    }
  }

  handleNewCustomer() {
    if (this.whatAppUrl) {
      const navigationExtras: NavigationExtras = {
        state: {
          orderId: this.orderId,
          total: this.total,
        },
      };
      this.router.navigate(["/verify"], navigationExtras);
    }
  }

  triggerCheckoutEvents() {
    this.facebookService.initiateCheckout(this.total, this.orderId);
    this.googleService.ga4eventEmitter("begin_checkout", this.orderId.toString(), this.total);
  }

  setBrowserSource() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .subscribe((result: { matches: boolean; breakpoints: Record<string, boolean> }) => {
        if (result.matches) {
          if (result.breakpoints["(max-width: 599.98px) and (orientation: portrait)"] ||
            result.breakpoints["(max-width: 599.98px) and (orientation: landscape)"]) {
            this.source = "Mobile";
          } else if (result.breakpoints["(min-width: 1280px) and (orientation: portrait)"] ||
            result.breakpoints["(min-width: 1280px) and (orientation: landscape)"]) {
            this.source = "Desktop";
          } else {
            this.source = "Tablet";
          }
        }
      });
  }

}
