import { Component, AfterViewInit, OnInit } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { NavigationEnd, Router } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CartService } from "../cart.service";

@Component({
    selector: "app-category",
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./add-to-cart.component.html",
    styleUrls: ["./add-to-cart.component.css"]
})
export class AddToCartComponent implements AfterViewInit, OnInit {
  cartItems: any[] = [];
  totalPrice: any;
  menRelatedProducts: any = [];
  womenRelatedProducts: any = [];
  recommendedProducts: any[] = []; // Adjust type as needed
  private apiUrl =
    "https://friday.kubona.ng/api/RelatedProducts?departmentId=0&itemGroupId=0&pageSize=8";

  orderId: any;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private cartService: CartService
  ) {
    this.orderId = this.generateOrderId();
  }

  generateOrderId(): number {
    return Math.floor(1000000 + Math.random() * 9000000);
  }

  navigateToCheckout() {
    this.router.navigate(['/whatsapp'], { queryParams: { totalPrice: this.totalPrice } });
  }

  hasItemsInCart(): boolean {
    return this.cartItems.length > 0;
  }

  isCartEmpty(): boolean {
    return !this.hasItemsInCart();
  }

  viewProduct(productId: number) {
    this.router.navigate(["/product-details", productId]);
  }
  ngOnInit(): void {
    this.cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    this.totalPrice = this.calculateTotalPrice();
    this.get_men_related_products();
    this.get_women_related_products();
    this.fetchRecommendedProducts();

    console.log("cartItems", this.cartItems);
  }

  ngDoCheck(): void {
    // Recalculate total price whenever cartItems change
    this.totalPrice = this.calculateTotalPrice();
  }

  get_men_related_products() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Product/Products/70610?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=10"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.menRelatedProducts = res;
          setTimeout(() => this.initializeCarousel1(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  get_women_related_products() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Product/Products/70710?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=10"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.womenRelatedProducts = res;
          setTimeout(() => this.initializeCarousel2(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  fetchRecommendedProducts(): void {
    this.httpClient.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        // Assign data to recommendedProducts
        this.recommendedProducts = data;
      },
      (error) => {
        console.error("Error fetching recommended products:", error);
      }
    );
  }

  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.productPrice * item.productQty;
    }, 0);
  }

  addMoreToBuy() {
    this.router.navigate(["/"]);
  }

  increaseQuantity(itemId: number) {
    const item = this.cartItems.find((cartItem) => cartItem.id === itemId);

    console.log('item.sizeQty', item.sizeQty)
  
    if (item) {
      if (item.productQty < item.sizeQty) {
        item.productQty += 1;
        this.saveCart();
      } else {
        // Replace this with a user-friendly error message (e.g., toast notification)
        alert('Cannot increase quantity: Maximum size quantity reached for selected size');
      }
    }
  }  

  numToWords(n: number) {
    console.log('number we have', n)
    if (n === 0) {
      return 'zero';
    }
  
    const lessThanTwenty = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
      'eighteen', 'nineteen'
    ];
  
    const tens = [
      '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];
  
    const scales = ['', 'thousand', 'million', 'billion', 'trillion'];
  
    const convertChunk = (num: number) => {
      let chunkResult = '';
      const hundreds = Math.floor(num / 100);
      num %= 100;
  
      if (hundreds !== 0) {
        chunkResult += `${lessThanTwenty[hundreds]} hundred`;
      }
  
      if (num === 0) {
        return chunkResult.trim();
      }
  
      if (chunkResult !== '') {
        chunkResult += ' and ';
      }
  
      if (num < 20) {
        chunkResult += lessThanTwenty[num];
      } else {
        const tensDigit = Math.floor(num / 10);
        const onesDigit = num % 10;
        chunkResult += `${tens[tensDigit]}${onesDigit !== 0 ? '-' + lessThanTwenty[onesDigit] : ''}`;
      }
  
      return chunkResult.trim();
    };
  
    const convertGroup = (num: number) => {
      let groupResult = '';
      let chunkCount = 0;
  
      while (num > 0) {
        const chunk = num % 1000;
        if (chunk !== 0) {
          const chunkWords = convertChunk(chunk);
          groupResult = `${chunkWords} ${scales[chunkCount]} ${groupResult}`.trim();
        }
        num = Math.floor(num / 1000);
        chunkCount++;
      }
  
      return groupResult.trim();
    };
  
    return convertGroup(n);
  }  

  decreaseQuantity(itemId: number) {
    const item = this.cartItems.find((cartItem) => cartItem.id === itemId);
    if (item) {
      if (item.productQty > 1) {
        item.productQty -= 1;
      } else {
        this.removeFromCart(itemId, item);
      }
      this.saveCart();
    }
  }

  removeFromCart(itemId: number, item: any) {
    const index = this.cartItems.findIndex(
      (cartItem) => cartItem.id === itemId
    );
    if (index !== -1) {
      this.cartItems.splice(index, 1); // Remove the item at the found index
      this.saveCart();
      this.cartService.removeFromCart(item);
      // this.location.replaceState(this.location.path()); // Ensures the URL remains the same
    }
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
    this.router.navigate(["/cart"]);
  }
  initializeCarousel1() {
    $(".owl-new-arrival").owlCarousel({
      loop: true,
      margin: 20,
      nav: true,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 2,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
        },
      },
    });
  }
  initializeCarousel2() {
    $(".owl-new-arrival2").owlCarousel({
      loop: true,
      margin: 20,
      nav: true,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 2,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
        },
      },
    });
  }

  ngAfterViewInit(): void {}
}
