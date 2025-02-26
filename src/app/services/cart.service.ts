import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Initialize cart only in the browser
    if (this.isBrowser) {
      const initialCart = this.getCartFromLocalStorage();
      this.cartItems.next(initialCart);
    }
  }

  // Initialize cart from localStorage
  private getCartFromLocalStorage(): any[] {
    if (!this.isBrowser) return []; // SSR safe check
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  // Update localStorage whenever cart changes
  private updateLocalStorage(cart: any[]): void {
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  // Return cart items as an observable
  getCartItems(): Observable<any[]> {
    return this.cartItems.asObservable();
  }

  // Get the number of items in the cart
  getCartCount(): number {
    return this.cartItems.getValue().length;
  }

  // Add an item to the cart and update localStorage
  addToCart(item: any): void {
    const currentItems = this.cartItems.getValue();
    const updatedItems = [...currentItems, item];
    this.cartItems.next(updatedItems); // Update BehaviorSubject
    this.updateLocalStorage(updatedItems); // Update localStorage
  }

  // Remove an item from the cart and update localStorage
  removeFromCart(item: any): void {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(cartItem => cartItem.productId !== item.productId);
    this.cartItems.next(updatedItems); // Update BehaviorSubject
    this.updateLocalStorage(updatedItems); // Update localStorage
  }
}