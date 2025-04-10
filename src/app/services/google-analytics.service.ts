import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare let gtag: Function; // Declare gtag as a function

@Injectable()
export class GoogleAnalyticsService {
  private platformId: Object;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
  }


  //create our event emitter to send our data to Google Analytics
  public eventEmitter(eventAction: string, eventCategory: string, eventLabel: string = "", eventValue: number = 0) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'event_category': eventCategory, 'event_label': eventLabel, 'value': eventValue });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }
  //GA4 event emitter ---
  public ga4eventEmitter(eventAction: string, order_id: string = "", eventValue: number = 0) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'order_id': order_id, 'value': eventValue });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }

  public addToCartEventEmitter(eventAction: string, page_name: string, productId: string, productValue: number) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'product_id': productId, 'page_name': page_name, 'value': productValue });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }
  public prodReviewEventEmitter(eventAction: string, page_name: string, product_name: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'product_name': product_name, 'page_name': page_name });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }

  public recentlyViewedEventEmitter(eventAction: string, productTitle: string, page_name: string, product_value: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'product_title': productTitle, 'page_name': page_name, 'value': product_value });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }

  public homepageEventEmitter(eventAction: string, link_location: string, link_clicked: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'link_location': link_location, 'link_clicked': link_clicked });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }
  // this method is for the general
  public ga4GenEventEmitter(eventAction: string, page_name: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'page_name': page_name });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }

  public prodlistEventEmitter(eventAction: string, page_name: string, product_url: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'page_name': page_name, 'product_url': product_url });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }

  public searchListEventEmitter(eventAction: string, page_name: string, filter_btn: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'page_name': page_name, 'filter': filter_btn });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }

  public menubarEventEmitter(eventAction: string, page_name: string, menu_link: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'page_name': page_name, 'menu_link': menu_link });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }
  public checkoutRadioEventEmitter(eventAction: string, order_id: string, pytOption: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', eventAction, { 'order_id': order_id, 'checkoutOption': pytOption });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }

  public viewContent(eventValue: number = 0, productId: number, departmentName: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', 'view_item', {
          'send_to': 'AW-1062104035',
          'value': eventValue,
          'items': [{
            'id': productId,
            'google_business_vertical': 'retail'
          }],
          'ecomm_pagetype': departmentName
        });
        gtag('event', 'view_content', { 'page_name': 'product_detail', 'productId': productId, 'value': eventValue });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }

  public reportConversion(url: string, eventValue: number = 0) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-1062104035/XWlgCPa70doBEOPXufoD', 'value': eventValue, 'currency': 'NGN', 'callback': url
        });
      } else {
        console.warn('gtag function not found.');
      }
    }
  }
}