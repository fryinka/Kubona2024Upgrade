import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Cartlist, CheckoutData } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: BehaviorSubject<Cartlist[]> = new BehaviorSubject<Cartlist[]>([]);
  private orderId: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null); // Add orderId
  private isBrowser: boolean;
  baseURL: string = 'https://admin.kubona.ng/';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient,    private cookieService: CookieService) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const initialCart = this.getCartFromLocalStorage();
      this.cartItems.next(initialCart);
      const storedOrderId = localStorage.getItem('orderId');
      this.orderId.next(storedOrderId ? parseInt(storedOrderId, 10) : null); // Initialize orderId
    }
  }

  private getCartFromLocalStorage(): any[] {
    if (!this.isBrowser) return [];
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  private updateLocalStorage(cart: any[]): void {
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  getCartItems(): Observable<any[]> {
    return this.cartItems.asObservable();
  }

  getOrderId(): Observable<number | null> { // Add getOrderId method
    return this.orderId.asObservable();
  }

  setOrderId(orderId: number | null): void { // Add setOrderId method
    this.orderId.next(orderId);
    if (this.isBrowser) {
      localStorage.setItem('orderId', orderId ? orderId.toString() : '');
    }
  }

  getCartCount(): number {
    return this.cartItems.getValue().length;
  }

  addToCart(item: any): Observable<number> {
    const userId = this.cookieService.get('kubona_shopper');
    const currentItems = this.cartItems.getValue();
    const updatedItems = [...currentItems, item];
    this.cartItems.next(updatedItems);
    this.updateLocalStorage(updatedItems);

    const url = this.baseURL + 'api/Order';
    const headers = { 'content-type': 'application/json' };

    return this.http.post<number>(url, { "productId": item.productId, "itemgroupSizeId": item.itemgroupSizeId, "userId": userId }, { headers: headers })
      .pipe(
        catchError(error => {
          console.error('Error adding to cart:', error);
          return throwError(error);
        })
      );
  }

  removeFromCart(item: any): void {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(cartItem => cartItem.productId !== item.productId);
    this.cartItems.next(updatedItems);
    this.updateLocalStorage(updatedItems);
  }

  onCheckoutWhatsapp(email: string, phoneNumber: string, productData: any) {
    const params = new HttpParams()
      .set("userId", email.toString())
      .set("phoneNumber", phoneNumber);
    const url = this.baseURL + "api/checkoutWithWhatsApp";
    return this.http.post(url, productData, { params });
  }

  getCartItemsFromDB<Cartlist>(pageNumber: number, pageSize: number): Observable<Cartlist[]> {
    var url = this.baseURL + 'api/Order';
    var userId = this.cookieService.get('kubona_shopper');
    var params = new HttpParams()
      .set("userId", userId)
      .set("pageNumber", pageNumber.toString())
      .set("pageSize", pageSize.toString())
    return this.http.get<Cartlist[]>(url, { params });
  }

  getSizeCode(trackingId: string) {
    var url = this.baseURL + 'api/Order/GetSizeId/' + trackingId;
    return this.http.get(url);
  }

  getCustomerHistory(phonenumber: string): Observable<any[]> {
    var url = this.baseURL + 'api/RecentlyViewed/CustomerLookup/' + phonenumber;
    return this.http.get<any[]>(url);
  }

  getActiveOrderFromDB(): Observable<any> {
    var userId = this.cookieService.get('kubona_shopper');
    var url = this.baseURL + 'api/Order/ActiveOrder';
    var params = new HttpParams()
      .set("userId", userId)
    return this.http.get<any>(url, { params });
  }

  checkoutOrder(source: string, customerGSM: string, total: number, gclid: string, fbclid: string, exist: boolean, paymentOption: number) {
    var url = this.baseURL + 'api/CheckOut';
    var userId = this.cookieService.get('kubona_shopper');
    const headers = { 'content-type': 'application/json' };
    const body = { source: source, customerGSM: customerGSM, total: total, gclid: gclid, fbclid: fbclid, exist: exist, paymentOption: paymentOption, userId: userId }
    return this.http.post<CheckoutData>(url, body, { headers: headers });
  }

  checkoutNew(source: string, customerGSM: string, total: number, gclid: string, fbclid: string) {
    const url = this.baseURL + 'api/CheckOut/Checkout';
    const headers = { 'content-type': 'application/json' };
    const body = { source: source, customerGSM: customerGSM, total: total, gclid: gclid, fbclid: fbclid }
    return this.http.post<CheckoutData>(url, body, { headers: headers });
  }

  checkExisting(gsm: string) {
    var url = this.baseURL + 'api/CheckOut/Existing';
    var params = new HttpParams()
      .set("customerGsm", gsm)
    return this.http.get(url, { params: params });
  }

  verifyProcess(orderId: number, total: number, amountEntered: number, correct: boolean) {
    const headers = { 'content-type': 'application/json' };
    var url = this.baseURL + 'api/CheckOut/Verify';
    var body = { orderId: orderId, orderAmt: total, amountEntered: amountEntered, correct: correct };
    return this.http.post(url, body, { headers: headers });
  }

  getOrderInfo() {
    var url = this.baseURL + 'api/CheckOut/GetOrderInfo';
    return this.http.get(url);
  }

  verifyWhatsApp(phoneNumber: string) {
    var url = this.baseURL + 'api/CheckOut/WhatsApp';
    var params = new HttpParams()
      .set("phone", phoneNumber)
    return this.http.get(url, { params: params });
  }

  customerOrderedToday(gsm: string, paymentOption: number, orderId: number): Observable<boolean> {
    var url = this.baseURL + 'api/CheckOut/OrderedToday';
    var params = new HttpParams()
      .set("customerGsm", gsm)
      .set("paymentOption", paymentOption)
      .set("orderId", orderId)
    return this.http.get<boolean>(url, { params: params });
  }

  verifyNewUser(orderId: number, paymentOption: number): Observable<CheckoutData> {
    const url = this.baseURL + 'api/CheckOut/UpdatePayment';
    var params = new HttpParams()
      .set("orderId", orderId)
      .set("paymentOption", paymentOption)
    return this.http.get<CheckoutData>(url, { params: params });
  }

  clearCart(): void {
    this.cartItems.next([]); // Clear BehaviorSubject
    this.orderId.next(0);
    if (this.isBrowser) {
      localStorage.removeItem('cart'); // Clear localStorage
      localStorage.removeItem('orderId');
    }
  }
}