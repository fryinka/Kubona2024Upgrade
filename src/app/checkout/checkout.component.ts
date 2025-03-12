import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NumberToWordsPipe } from "../services/num2text.pipe";
import { CartService } from "../services/cart.service";
@Component({
  selector: "app-checkout",
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NumberToWordsPipe], // Include ReactiveFormsModule
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  totalPrice: number = 0;
  companyWhatsApp: string = "2347036110000";
  orderId: number = 0;
  transactionId: string = "";
  expressCode: string = "";
  orderDetails: any;
  orderNotPlaced: boolean = false;
  redirectingToWhatsAPP: boolean = false;
  checkoutSuccess: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router, private cartService: CartService,) {
    this.checkoutForm = this.fb.group({
      userEmail: ["", [Validators.required, Validators.email]], // Email validation
      phoneNumber: ["", [Validators.required, Validators.pattern("^0?[7-9]?[0-9]{9}$")],], // Nigerian phone number validation
      deliveryState: ["", Validators.required], // Required state selection
      typicalSize: ["", Validators.required], // Required size selection
      paymentOption: ["", Validators.required], // Required payment option
    });
  }

  ngOnInit(): void {
    this.totalPrice = Number(
      this.route.snapshot.queryParamMap.get("totalPrice")
    );

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      // Check if the cart array is empty
      this.router.navigate(["/"]); // Navigate to the home route if the cart is empty
    }
  }


  onCheckoutWhatsapp() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    } else if (this.checkoutForm.valid) {
      const email = this.checkoutForm.get("userEmail")?.value;
      const phoneNumber = this.checkoutForm.get("phoneNumber")?.value;

      let productData = JSON.parse(localStorage.getItem("cart") || "[]");

      productData = productData.map((v: any) => {
        return {
          ...v,
          quantity: v.productQty,
        };
      });

      this.cartService.onCheckoutWhatsapp(email, phoneNumber, productData).subscribe(
        (response) => {
          this.orderDetails = response;
          this.orderId = this.orderDetails["orderId"];
          this.transactionId = this.orderDetails["baed1d8c6c804b08"];
          this.redirectingToWhatsAPP = true;
          localStorage.removeItem("cart");
            window.location.href = `https://wa.me/${this.companyWhatsApp}?text=Hello%2C%20I%20have%20just%20placed%20an%20order.%20My%20order%20ID%20is%20${this.orderId}.%20Thank%20you!`;
        },
        (error) => {
          this.orderNotPlaced = true;
        }
      );
    }
  }
}
