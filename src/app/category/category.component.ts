import {
  Component,
  AfterViewInit,
  OnInit,
  Inject,
  PLATFORM_ID,
  afterNextRender,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { NavigationEnd, Router } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FlowbiteService } from "../flowbite.service";

@Component({
  selector: "app-category",
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Include ReactiveFormsModule
  templateUrl: "./category.component.html",
  styleUrl: "./category.component.css",
})
export class CategoryComponent implements OnInit, AfterViewInit {
  dataLoaded = false;
  allSubCategories: any = [];

  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });

    $(".owl-new-arrival-category").owlCarousel({
      loop: true,
      margin: 20,
      infinite: true,
      nav: false,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplaySpeed: 300,
      responsive: {
        0: {
          items: 1.2,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3.78,
        },
      },
    });

    $(".owl-style").owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 3.5,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 4,
        },
      },
    });
    $(".owl-types").owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      autoplay: true,
      autoplayTimeout: 2000,
      autoplaySpeed: 200,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 3.5,
        },
        600: {
          items: 5,
        },
        1000: {
          items: 6,
        },
      },
    });
    // Simulate data fetching
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
  }

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private flowbiteService: FlowbiteService
  ) {}

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1200, // Adjust animation duration if needed
      once: false, // Whether animation should happen only once - while scrolling down
      mirror: false, // Whether elements should animate out while scrolling past them
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        AOS.refresh();
      }
    });
  }

  get_sub_categories() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Product/Products/70610?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=10"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.allSubCategories = res; // Initialize filteredMenProducts with all men products
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
}
