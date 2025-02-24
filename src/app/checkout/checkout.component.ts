import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-checkout",
    imports: [FormsModule, CommonModule, HttpClientModule, ReactiveFormsModule], // Include ReactiveFormsModule
    templateUrl: "./checkout.component.html",
    styleUrls: ["./checkout.component.css"]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  totalPrice: number = 0;
  companyWhatsApp: string = "2347036110000";
  orderId: any;
  transactionId: any;
  expressCode: any;
  orderDetails: any;
  orderNotPlaced: boolean = false;
  redirectingToWhatsAPP: boolean = false;
  checkoutSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      userEmail: ["", [Validators.required, Validators.email]], // Email validation
      phoneNumber: ["", [Validators.required]], // Nigerian phone number validation
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

  numberToWords(num: any) {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

    if (num === 0) return "Zero";

    const convertChunk = (num: any) => {
      let words = "";
      if (num >= 100) {
        words += ones[Math.floor(num / 100)] + " Hundred ";
        num %= 100;
      }
      if (num >= 10 && num < 20) {
        words += teens[num - 10] + " ";
      } else if (num >= 20) {
        words += tens[Math.floor(num / 10)] + " ";
        num %= 10;
      }
      if (num > 0 && num < 10) {
        words += ones[num] + " ";
      }
      return words.trim();
    };

    let words = "";
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        words = `${convertChunk(chunk)} ${scales[scaleIndex]} ${words}`.trim();
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return words;
  }

  priceToWords(price: any) {
    const [integerPart, decimalPart] = price.toFixed(2).split(".");
    const nairaWords = this.numberToWords(parseInt(integerPart)) + " Naira";
    const koboWords =
      decimalPart > 0
        ? " and " + this.numberToWords(parseInt(decimalPart)) + " Kobo"
        : "";
    return nairaWords + koboWords;
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

      const params = new HttpParams()
        .set("userId", email.toString())
        .set("phoneNumber", phoneNumber);

      this.http
        .post(
          "https://friday.kubona.ng/api/checkoutWithWhatsApp",
          productData,
          { params }
        )
        .subscribe(
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
