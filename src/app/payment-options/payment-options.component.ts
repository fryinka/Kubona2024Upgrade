import { Component,AfterViewInit, OnInit, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
declare var $: any;
import * as AOS from 'aos';
import 'aos/dist/aos.css';
import { NavigationEnd, Router } from '@angular/router';
import { FlowbiteService } from '../flowbite.service';

@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [],
  templateUrl: './payment-options.component.html',
  styleUrl: './payment-options.component.css'
})
export class PaymentOptionsComponent implements OnInit ,AfterViewInit {
  dataLoaded = false;
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private flowbiteService: FlowbiteService) {}
  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
    
  }

  

  ngAfterViewInit(): void {

    AOS.init({
      duration: 1200, // Adjust animation duration if needed
      once: false, // Whether animation should happen only once - while scrolling down
      mirror: false, // Whether elements should animate out while scrolling past them
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        AOS.refresh();
      }
    });
    
    
  }

}