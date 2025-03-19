import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { Router } from "@angular/router";
import { CartService } from "../services/cart.service";
import { RelatedProducts } from "../models/models";
import { ProductService } from "../services/product.service";
import { NumberToWordsPipe } from "../services/num2text.pipe";

@Component({
  selector: "app-category",
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NumberToWordsPipe],
  templateUrl: "./add-to-cart.component.html",
  styleUrls: ["./add-to-cart.component.css"]
})
export class AddToCartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  recommendedProducts: RelatedProducts[] = []; // Adjust type as needed

  orderId: any;

  constructor(private router: Router, private cartService: CartService, private productService: ProductService) {
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
    this.router.navigate(["/product", productId]);
  }
  ngOnInit(): void {
    this.cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    this.totalPrice = this.calculateTotalPrice();
    this.fetchRecommendedProducts();

    // console.log("cartItems", this.cartItems);
  }

  ngDoCheck(): void {
    // Recalculate total price whenever cartItems change
    this.totalPrice = this.calculateTotalPrice();
  }

  fetchRecommendedProducts(): void {
    this.productService.getRelatedProducts(70000, 0, 8).subscribe(response => {
      this.recommendedProducts = response;
    }, (error) => {
      console.error("Error fetching recommended products:", error);
    });
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
}
