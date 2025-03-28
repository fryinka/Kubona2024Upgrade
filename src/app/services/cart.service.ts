import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Cartlist, CheckoutData } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: BehaviorSubject<Cartlist[]> = new BehaviorSubject<Cartlist[]>([]);
  private isBrowser: boolean;
  baseURL: string = 'https://localhost:44397/';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient,
    private cookieService: CookieService) {
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
  addToCart(item: any): Observable<any> {
    const userId = this.cookieService.get('kubona_shopper');
    const currentItems = this.cartItems.getValue();
    const updatedItems = [...currentItems, item];
    this.cartItems.next(updatedItems); // Update BehaviorSubject
    this.updateLocalStorage(updatedItems); // Update localStorage
    const url = this.baseURL + 'api/Order';
    const headers = { 'content-type': 'application/json' };
    alert("Code now here!")
    return this.http.post<any>(url, { "productId": item.productId, "itemgroupSizeId": item.itemgroupSizeId , "userId":userId}, { 'headers': headers });
  }

  // Remove an item from the cart and update localStorage
  removeFromCart(item: any): void {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(cartItem => cartItem.productId !== item.productId);
    this.cartItems.next(updatedItems); // Update BehaviorSubject
    this.updateLocalStorage(updatedItems); // Update localStorage
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
    var params = new HttpParams()
    .set("pageNumber", pageNumber.toString())
    .set("pageSize", pageSize.toString())
    
    return this.http.get<Cartlist[]>(url, { params });
  }
  
  getSizeCode(trackingId: string){
    var url = this.baseURL + 'api/Order/GetSizeId/' + trackingId ;
    return this.http.get(url);
  }

  getCustomerHistory(phonenumber: string): Observable<any[]> {
    var url = this.baseURL + 'api/RecentlyViewed/CustomerLookup/' + phonenumber;
    return this.http.get<any[]>(url);
  }

  insertItemIntoOrder(productId: number, itemgroupSizeId: number): Observable<any> {


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const headers = { 'content-type': 'application/json' };

    var url = this.baseURL + 'api/Order';

    return this.http.post<any>(url, { "productId": productId, "itemgroupSizeId": itemgroupSizeId }, { 'headers': headers });
  }

  // deleteItemInCart(cartItemId: number) {
  //   if (window.confirm('Are you sure you want to delete the item?')) {
  //     this.cartlist.splice(cartItemId, 1);
  //   }
  // }


  // removeSingleItem(cartItemId:number): Observable<any> {
  //     var url = this.baseURL + 'api/CartManage';
  //   if (window.confirm('Are you sure you want to delete the item?')) {
  //         return this.http.get(`${url}/${cartItemId}`);
  //       } else {return null}
  //     }
    

  //remove all items in cart
  emptyCart() {
    
  }






  getActiveOrder<ActiveOrder>(): Observable<ActiveOrder> {

    var url = this.baseURL + 'api/Order/ActiveOrder';
    return this.http.get<ActiveOrder>(url);


  }

  checkout(source: string, customerGSM: string, total: number){


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const headers = { 'content-type': 'application/json' };

    var url = this.baseURL + 'api/CheckOut';

    return this.http.post<CheckoutData>(url, { "source": source, "customerGSM": customerGSM, "total": total}, { 'headers': headers });

    
  }

  checkoutOrder(source: string, customerGSM: string, total: number, gclid: string, fbclid: string, exist: boolean, paymentOption:number) {
    var url = this.baseURL + 'api/CheckOut';
    const headers = { 'content-type': 'application/json' };
    const body = { source: source, customerGSM: customerGSM, total: total, gclid: gclid, fbclid: fbclid, exist: exist, paymentOption: paymentOption }
    return this.http.post<CheckoutData>(url, body, { headers: headers });
  }

  checkoutNew(source: string, customerGSM: string, total: number, gclid: string, fbclid: string){
    const url = this.baseURL + 'api/CheckOut/Checkout';
    const headers = { 'content-type': 'application/json' };
    const body = { source: source, customerGSM: customerGSM, total: total, gclid: gclid, fbclid: fbclid}
    return this.http.post<CheckoutData>(url, body, { headers: headers });
  }
  
  checkExisting(gsm:string){
    var url=this.baseURL + 'api/CheckOut/Existing';
    var params = new HttpParams()
      .set("customerGsm", gsm)
    return this.http.get(url,{params:params});
  }

  verifyProcess(orderId: number, total: number, amountEntered: number, correct: boolean) {
    const headers = { 'content-type': 'application/json' };
    var url = this.baseURL + 'api/CheckOut/Verify';
    var body = {orderId:orderId,orderAmt:total,amountEntered:amountEntered,correct:correct};
    return this.http.post(url, body,{ headers:headers });
  }

  getOrderInfo(){
    var url=this.baseURL + 'api/CheckOut/GetOrderInfo';
    return this.http.get(url);
  }

  verifyWhatsApp(phoneNumber:string){
    var url=this.baseURL + 'api/CheckOut/WhatsApp';
    var params = new HttpParams()
      .set("phone", phoneNumber)
    return this.http.get(url,{params:params});
  }

  customerOrderedToday(gsm: string, paymentOption: number, orderId: number): Observable<boolean>{
    var url = this.baseURL + 'api/CheckOut/OrderedToday';
    var params = new HttpParams()
      .set("customerGsm", gsm)
      .set("paymentOption", paymentOption)
      .set("orderId",orderId)
    return this.http.get<boolean>(url, { params:params });
  }

  verifyNewUser(orderId: number, paymentOption: number): Observable<CheckoutData> {
    const url = this.baseURL + 'api/CheckOut/UpdatePayment';
    var params = new HttpParams()
      .set("orderId", orderId)
      .set("paymentOption", paymentOption)
    return this.http.get<CheckoutData>(url, { params: params });
  }


}