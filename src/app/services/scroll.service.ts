import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor() { }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}