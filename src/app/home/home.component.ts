import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms"; // Import ReactiveFormsModule
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Meta, Title } from "@angular/platform-browser";
import { filter } from "rxjs/operators";
import { NewlyArrivedComponent } from "../components/newly-arrived/newly-arrived.component";

@Component({
    selector: "app-home",
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, NewlyArrivedComponent], // Include ReactiveFormsModule
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  showMen: boolean = true;
  showWomen: boolean = false;
  loader: boolean = false;

  viewMen: boolean = false;
  viewWomen: boolean = false;
  loaders: boolean = false;
  selectedSize: string | null = null;
  menProducts: any;
  womenProducts: any;

  // Remove sizes as they are not required now
  filteredMenProducts: any;
  filteredWomenProducts: any;
  sizes: any;
  selectedColors: string = "";
  selectedStyles: string = "";
  selectedMaterial: string = "";
  selectedCategory: string = "";
  searchQuery: string = "";
  selectedSort: string = "";
  products: any;
  isProducts: boolean = false;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private route: ActivatedRoute
  ) {
    this.newsletterForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
    this.titleService.setTitle("Homepage");
    this.metaService.addTags([
      { name: "keywords", content: "Homepage" },
      { name: "description", content: "Home page description content" },
    ]);
  }

  selectedSizeClick(sizeCode: string) {
    console.log(sizeCode);
    this.selectedSize = sizeCode;
    this.getFilterproducts();
  }

  seeShopBySize(sizeCode: number) {
    console.log(`Selected size code: ${sizeCode}`);
    // Implement any additional size selection logic here
  }
  extractSizeNumber(sizeDesc: string): string {
    const match = sizeDesc.match(/\d+/); // Match only the numbers
    return match ? match[0] : sizeDesc; // Return the matched number or original if none
  }

  showMenSizes() {
    this.showMen = true;
    this.showWomen = false;
  }

  showWomenSizes() {
    this.showMen = false;
    this.showWomen = true;
  }
  switchToMen() {
    this.loader = true;
    setTimeout(() => {
      this.showMen = true;
      this.showWomen = false;
      this.loader = false;
    }, 1000); // Simulating an API call with a timeout
  }

  switchToWomen() {
    this.loader = true;
    setTimeout(() => {
      this.showMen = false;
      this.showWomen = true;
      this.loader = false;
    }, 1000); // Simulating an API call with a timeout
  }

  @ViewChild("videoPlayer") videoPlayer!: ElementRef<HTMLVideoElement>;

  dataLoaded = false;
  isPlaying = false;
  newsletterForm: FormGroup;
  newsletterSuccess: any;
  menRelatedProducts: any = [];
  womenRelatedProducts: any = [];
  accRelatedProducts: any = [];
  slideShowImages: any = [];
  allReviews: any = [];
  allCategories: any = [];
  allStyles: any = [];
  allStylesWomen: any = [];
  allSizes: any = [];
  allSizesWomen: any = [];

  isLoadingSlider = false;
  isSlider = false;

  ngOnInit() {
    // Simulate data fetching
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary

    this.get_men_related_products();
    this.get_women_related_products();
    this.get_acc_related_products();
    this.get_sliders();
    this.get_reviews();
    this.get_categories();
    this.get_styles();
    this.get_styles_women();
    this.get_sizes();
    this.get_sizes_women();
  }

  showMenItems() {
    this.viewMen = true;
    this.viewWomen = false;
    this.loader = false;
    this.filteredMenProducts = this.menProducts; // Show filtered men products
  }

  showWomenItems() {
    this.viewMen = false;
    this.viewWomen = true;
    this.loader = false;
    this.filteredWomenProducts = this.womenProducts; // Show filtered women products
  }

  showAllItems() {
    this.viewMen = false;
    this.viewWomen = false;
    this.loader = false;
    this.filteredMenProducts = this.menProducts; // Show all men products
    this.filteredWomenProducts = this.womenProducts; // Show all women products
  }

  viewProduct(productId: number, productTitle: string) {
    this.router.navigate(["/product-details", productTitle]);
  }

  viewnewProduct(itemGroupId: number) {
    this.router.navigate(["/product-details", itemGroupId]);
  }

  get_men_products() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Product/Products/70610?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=10"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.menProducts = res;
          this.filteredMenProducts = res; // Initialize filteredMenProducts with all men products
          // setTimeout(() => this.initializeCarousel5(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  get_women_products() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Product/Products/70710?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=10"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.womenProducts = res;
          this.filteredWomenProducts = res; // Initialize filteredWomenProducts with all women products
          setTimeout(() => this.initializeCarousel6(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  get_men_related_products() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Product/Products/70610?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=8"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.menRelatedProducts = res; //.slice(0, 3);
          setTimeout(() => this.initializeCarousel5(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  get_women_related_products() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Product/Products/70710?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=8"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.womenRelatedProducts = res;
          setTimeout(() => this.initializeCarousel6(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  get_acc_related_products() {
    this.httpClient
      .get("https://friday.kubona.ng/api/Product/Products/70340")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.accRelatedProducts = res;
          setTimeout(() => this.initializeCarousel7(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  get_sliders() {
    this.isLoadingSlider = true;
    this.httpClient
      .get("https://friday.kubona.ng/api/Image/GetSlideShowImages")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.slideShowImages = res;
          this.isSlider = this.slideShowImages.length > 0;
          setTimeout(() => this.initializeCarousel2(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
        complete: () => {
          this.isLoadingSlider = false;
        },
      });
  }

  getFilterproducts() {
    if (this.selectedSize == null) {
      this.selectedSize = "0";
    }

    if (this.selectedColors == null) {
      this.selectedColors = "0";
    }

    if (this.selectedStyles == null) {
      this.selectedStyles = "0";
    }

    if (this.selectedMaterial == null) {
      this.selectedMaterial = "0";
    }

    if (this.selectedCategory == null) {
      this.selectedCategory = "0";
    }

    this.searchQuery =
      this.selectedCategory +
      "-" +
      this.selectedSize +
      "-" +
      this.selectedColors +
      "-" +
      this.selectedStyles +
      "-" +
      this.selectedMaterial;
    this.httpClient
      .get<any[]>(
        "https://friday.kubona.ng/api/Product/Products/" +
          this.searchQuery +
          "&sortId=" +
          this.selectedSort
      )
      .subscribe({
        next: (res) => {
          console.log("Products", res);
          this.products = res;
          this.loadProducts();
          this.isProducts = this.products.length > 0;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  loadProducts() {
    throw new Error("Method not implemented.");
  }

  get_reviews() {
    this.httpClient
      .get("https://friday.kubona.ng/api/Reviews/GetAll")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.allReviews = res;
          setTimeout(() => this.initializeCarousel3(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  get_sizes() {
    this.httpClient
      .get("https://friday.kubona.ng/api/SizingGroupBy/70610")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.allSizes = res;      
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  get_sizes_women() {
    this.httpClient
      .get("https://friday.kubona.ng/api/SizingGroupBy/70710")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.allSizesWomen = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  get_categories() {
    this.httpClient.get("https://friday.kubona.ng/api/Image/ImageRotators?rotatorId=2&pageSize=12").subscribe({
      next: (res) => {
        console.log(res);
        this.allCategories = res;
        setTimeout(() => this.initializeCarousel4(), 0);
      },
      error: (err) => {
        console.error("There was an error!", err);
      },
    });
  }

  get_styles() {
    this.httpClient.get("https://friday.kubona.ng/api/StylesGroupBy/70610").subscribe({
      next: (res) => {
        console.log("All styles");
        console.log(res);
        this.allStyles = res;
        setTimeout(() => this.initializeCarousel(), 0);
      },
      error: (err) => {
        console.error("There was an error!", err);
      },
    });
  }
  get_styles_women() {
    this.httpClient.get("https://friday.kubona.ng/api/StylesGroupBy/70710").subscribe({
      next: (res) => {
        console.log("All styles");
        console.log(res);
        this.allStyles = res;
        // setTimeout(() => this.initializeCarousel(), 0);
      },
      error: (err) => {
        console.error("There was an error!", err);
      },
    });
  }

  viewShopByStyle(styleDesc: string, caller: string = "style") {
    console.log(styleDesc);
    // const formattedStyleDesc = styleDesc.replace(/\s+/g, '-');
    // this.router.navigate(["/products", "70610", 0, 0, styleId, 0]);
    this.router.navigate(["/products", "70610", 0, 0 , styleDesc, 0 ], {
      queryParams: { caller: caller },
    });

  }

  viewShopBySizeMen(sizeCode: string, caller: string) {
    console.log(sizeCode);
    this.router.navigate(["/products", "70610", sizeCode, 0, 0, 0],{
      queryParams: { caller: caller }
    });
  }

  viewShopBySizeWomen(sizeCode: number, caller: string) {
    console.log(sizeCode);
    this.router.navigate(["/products", "70710", sizeCode, 0, 0, 0],{
      queryParams: { caller: caller }
    });
  }

  viewShopByDepartments(routeId: number) {
    console.log(routeId);
    this.router.navigate(["/products", routeId, 0, 0, 0, 0]);
  }

  initializeCarousel() {
    $(".owl-style").owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplaySpeed: 300,
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
  }

  onSubscribe() {
    if (this.newsletterForm.valid) {
      const email = this.newsletterForm.get("email")?.value;
      const formBody2 = {
        email: email,
      };
      this.httpClient.post("https://friday.kubona.ng/api/Contact/Subscribe/", formBody2).subscribe(
        (response) => {
          console.log(JSON.stringify(response));
          this.newsletterSuccess = true;
        },
        (error) => {
          console.error("Error submitting form", error);
          this.newsletterSuccess = true;
        }
      );
    } else {
      console.log("Form is not valid");
    }
  }

  initializeCarousel2() {
    $(".owl-home-banner").owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 8000,
      autoplaySpeed: 800,
      navText: [
        '<img src="assets/images/ban-left.png" class="md:max-w-[45px] max-w-[35px] absolute left-0 top-[50%] translate-y-[-50%]" alt="Prev">',
        '<img src="assets/images/ban-right.png" class="md:max-w-[45px] max-w-[35px] absolute right-0 top-[50%] translate-y-[-50%]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        1000: {
          items: 1,
        },
      },
    });
  }
  initializeCarousel3() {
    $(".owl-testimonials").owlCarousel({
      loop: true,
      margin: 50,
      nav: false,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        1000: {
          items: 1,
        },
      },
    });
  }
  initializeCarousel4() {
    $(".owl-featured").owlCarousel({
      loop: true,
      margin: 50,
      nav: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplaySpeed: 500,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 2.2,
          margin: 10,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
          margin: 20,
        },
      },
    });
  }

  initializeCarousel5() {
    $(".owl-new-arrival").owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplaySpeed: 500,
      nav: true,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 2,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 4,
        },
      },
    });
  }
  initializeCarousel6() {
    $(".owl-new-arrival2").owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplaySpeed: 500,
      nav: true,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 2,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 4,
        },
      },
    });
  }
  initializeCarousel7() {
    $(".owl-new-arrival3").owlCarousel({
      loop: true,
      margin: 20,
      nav: true,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 2,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
        },
      },
    });
  }

  playPause() {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video
        .play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch((error) => {
          console.error("Error attempting to play video:", error);
        });
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }
  goToProductDetails() {
    this.router.navigate(["/product-details"]);
  }
  goToCategoryMen() {
    this.router.navigate(["/men"]);
  }
  goToCategoryWomen() {
    this.router.navigate(["/women"]);
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1200, // Adjust animation duration if needed
      once: false, // Whether animation should happen only once - while scrolling down
      mirror: false, // Whether elements should animate out while scrolling past them
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        AOS.refresh();
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        AOS.refresh();
      }
    });

    const video = this.videoPlayer.nativeElement;

    // Check if IntersectionObserver is supported
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video
                .play()
                .then(() => {
                  this.isPlaying = true;
                })
                .catch((error) => {
                  console.error("Error attempting to play video:", error);
                });
            } else {
              video.pause();
              this.isPlaying = false;
            }
          });
        },
        { threshold: 0.5 }
      ); // Adjust threshold as needed

      observer.observe(video);
    } else {
      // Fallback for browsers that do not support IntersectionObserver
      console.warn("IntersectionObserver is not supported in this browser.");
      // Optionally handle the fallback here
    }

    // Initialize Owl Carousel after view initialization

    // this.initializeCarousel5();

    // this.initializeCarousel6()

    this.onSubscribe();
  }
}
