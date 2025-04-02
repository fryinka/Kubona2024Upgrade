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
  orderId: number | null = 0;

  constructor(private router: Router, private cartService: CartService,) {
  }

  generateOrderId() {
    this.cartService.getOrderId().subscribe(response => {
      this.orderId = response;
    })
  }

  navigateToCheckout() {
    this.router.navigate(['/whatsapp']);
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
    this.generateOrderId();
  }

  ngDoCheck(): void {
    // Recalculate total price whenever cartItems change
    this.totalPrice = this.calculateTotalPrice();
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
}