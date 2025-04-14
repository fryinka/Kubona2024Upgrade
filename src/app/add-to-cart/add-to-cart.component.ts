import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { CartService } from "../services/cart.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NumberToWordsPipe } from "../services/num2text.pipe";

@Component({
  selector: "app-category",
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NumberToWordsPipe],
  templateUrl: "./add-to-cart.component.html",
  styleUrls: ["./add-to-cart.component.css"],
})
export class AddToCartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  orderId: number | null = null;

  constructor(
    private router: Router,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.fetchCartItems();
    this.generateOrderId();
  }

  fetchCartItems(): void {
    this.cartService.getCartItemsFromDB(0,50).subscribe({
      next: (cartItems) => {
        console.log(cartItems)
        this.cartItems = cartItems || [];
        this.totalPrice = this.calculateTotalPrice();
      },
      error: (error) => {
        console.error("Failed to fetch cart items:", error);
        alert("Failed to load cart items. Please try again.");
      }
    });
  }

  generateOrderId() {
    this.cartService.getOrderId().subscribe({
      next: (orderId) => {
        this.orderId = orderId;
      },
      error: (error) => {
        console.error("Failed to generate order ID:", error);
      }
    });
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

  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.internetPrice * item.quantity;
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
        this.updateCartItem(item);
      } else {
        alert('Cannot increase quantity: Maximum size quantity reached for selected size');
      }
    }
  }

  decreaseQuantity(itemId: number) {
    const item = this.cartItems.find((cartItem) => cartItem.id === itemId);
    if (item) {
      if (item.productQty > 1) {
        item.productQty -= 1;
        this.updateCartItem(item);
      } else {
        // this.removeFromCart(itemId);
      }
    }
  }

  // removeFromCart(itemId: number) {
  //   const index = this.cartItems.findIndex((cartItem) => cartItem.orderItemId === itemId);
  //   if (index !== -1) {
  //     const removedItem = this.cartItems.splice(index, 1)[0];
  //     this.cartService.removeFromCart(removedItem).subscribe({
  //       next: () => {
  //         this.totalPrice = this.calculateTotalPrice();
  //       },
  //       error: (error) => {
  //         console.error("Failed to remove item from cart:", error);
  //         alert("Failed to remove item. Please try again.");
  //       }
  //     });
  //   }
  // }

  updateCartItem(updatedItem: any): void {
    this.cartService.addToCart(updatedItem).subscribe({
      next: () => {
        this.totalPrice = this.calculateTotalPrice();
      },
      error: (error) => {
        console.error("Failed to update cart item:", error);
        alert("Failed to update item. Please try again.");
      }
    });
  }
}