import { Injectable } from '@angular/core';

declare let fbq: Function; // Declare gtag as a function

@Injectable()
export class FacebookEventService {

  constructor() { }

  public eventEmitter(eventAction: string, eventLabel: string = "", eventValue: number = 0) {
    fbq('track', eventAction, { value: (Math.round(eventValue * 100) / 100).toFixed(2), currency: 'NGN', orderId: eventLabel });
  }

  public viewContent(eventValue: number = 0, productId: number = 0, departmentName: string, title: string) {
    fbq('track', 'ViewContent', {
      content_ids: [productId], content_type: 'product', value: (Math.round(eventValue * 100) / 100).toFixed(2), content_name: title, content_category: departmentName, currency: 'NGN'
    });
  }

  public addToCart(eventValue: number = 0, productId: number = 0, departmentName: string, title: string) {
    fbq('track', 'AddToCart', {
      content_ids: [productId], content_type: 'product', value: (Math.round(eventValue * 100) / 100).toFixed(2), content_name: title, content_category: departmentName, currency: 'NGN'
    });
  }

  public initiateCheckout(eventValue: number = 0, orderId: number = 0) {
    fbq('track', 'InitiateCheckout', { value: (Math.round(eventValue * 100) / 100).toFixed(2), currency: 'NGN', orderId: orderId });
  }

  public initiatePurchase(eventValue: number = 0, orderId: number = 0) {
    fbq('track', 'Purchase', { value: (Math.round(eventValue * 100) / 100).toFixed(2), currency: 'NGN', orderId: orderId }, { eventID: orderId }); //to prevent duplication of events
  }

  public initiateLeadGen(eventValue: number = 0, orderId: number = 0) {
    fbq('trackCustom', 'LeadGen', { value: (Math.round(eventValue * 100) / 100).toFixed(2), currency: 'NGN', orderId: orderId });
  }
}