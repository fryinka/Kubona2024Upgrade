import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare let fbq: Function; // Declare fbq as a function

@Injectable()
export class FacebookEventService {
  private platformId: Object;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
  }

  public eventEmitter(eventAction: string, eventLabel: string = "", eventValue: number = 0) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof fbq === 'function') {
        fbq('track', eventAction, { value: (Math.round(eventValue * 100) / 100).toFixed(2), currency: 'NGN', orderId: eventLabel });
      } else {
        console.warn('fbq function not found.');
      }
    }
  }

  public viewContent(eventValue: number = 0, productId: number = 0, departmentName: string, title: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof fbq === 'function') {
        fbq('track', 'ViewContent', {
          content_ids: [productId], content_type: 'product', value: (Math.round(eventValue * 100) / 100).toFixed(2), content_name: title, content_category: departmentName, currency: 'NGN'
        });
      } else {
        console.warn('fbq function not found.');
      }
    }
  }

  public addToCart(eventValue: number = 0, productId: number = 0, departmentName: string, title: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof fbq === 'function') {
        fbq('track', 'AddToCart', {
          content_ids: [productId], content_type: 'product', value: (Math.round(eventValue * 100) / 100).toFixed(2), content_name: title, content_category: departmentName, currency: 'NGN'
        });
      } else {
        console.warn('fbq function not found.');
      }
    }
  }

  public initiateCheckout(eventValue: number = 0, orderId: number = 0) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', { value: (Math.round(eventValue * 100) / 100).toFixed(2), currency: 'NGN', orderId: orderId });
      } else {
        console.warn('fbq function not found.');
      }
    }
  }

  public initiatePurchase(eventValue: number = 0, orderId: number = 0) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof fbq === 'function') {
        fbq('track', 'Purchase', { value: (Math.round(eventValue * 100) / 100).toFixed(2), currency: 'NGN', orderId: orderId }, { eventID: orderId }); //to prevent duplication of events
      } else {
        console.warn('fbq function not found.');
      }
    }
  }

  public initiateLeadGen(eventValue: number = 0, orderId: number = 0) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof fbq === 'function') {
        fbq('trackCustom', 'LeadGen', { value: (Math.round(eventValue * 100) / 100).toFixed(2), currency: 'NGN', orderId: orderId });
      } else {
        console.warn('fbq function not found.');
      }
    }
  }
}