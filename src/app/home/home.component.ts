import {  Component,ViewChild, ElementRef,AfterViewInit,OnInit,} from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormBuilder,FormGroup,Validators,ReactiveFormsModule,} from "@angular/forms"; // Import ReactiveFormsModule
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Meta, Title } from "@angular/platform-browser";
import { filter } from "rxjs/operators";
import { NewlyArrivedComponent } from "../components/newly-arrived/newly-arrived.component";
import { SeoService } from "../services/seo.service";
import { ProductService } from "../services/product.service";
import { forkJoin } from "rxjs";
import { ImageRotators, Prodlist, SlideShowImages } from "../models/models";
@Component({
    selector: "app-home",
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule, NewlyArrivedComponent], // Include ReactiveFormsModule
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

  constructor(private router: Router, private httpClient: HttpClient, private fb: FormBuilder,
    private titleService: Title, private metaService: Meta, private route: ActivatedRoute, private seoService:SeoService, private productService: ProductService) {
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
    // this.getFilterproducts();
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
  menRelatedProducts: Prodlist[] = [];
  womenRelatedProducts: Prodlist[] = [];
  accRelatedProducts: any = [];
  slideShowImages: SlideShowImages[] = [];
  allReviews: any = [];
  allCategories: ImageRotators[] = [];
  allStyles: any = [];
  allStylesWomen: any = [];
  allSizes: any = [];
  allSizesWomen: any = [];

  isLoadingSlider = false;
  isSlider = false;
  pageSize: number = 15;
  rotatorId: number = 2;

  ngOnInit() {
    // Simulate data fetching
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary

    this.get_men_related_products();
    // this.get_acc_related_products();
    this.get_sliders();
    this.get_reviews();
    this.get_categories();
    this.get_styles();
    this.get_sizes();
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
    this.router.navigate(["/product", productTitle]);
  }

  get_men_related_products() {
    forkJoin({
      men: this.productService.getProducts("70610",0,0,7,0,8),
      women: this.productService.getProducts("70710",0,0,7,0,8)
    }).subscribe({
      next: ({ men, women }) => {
        this.menRelatedProducts=men;
        this.womenRelatedProducts=women;
        setTimeout(() => this.initializeCarousel5(), 0);
        setTimeout(() => this.initializeCarousel6(), 0);
            },
      error: (err) => console.error("There was an error!", err),
    });

  }
  
  get_sliders() {
    this.isLoadingSlider = true;
    this.productService.getSlideShowImages().subscribe({
      next: (res: SlideShowImages[]) => {
        console.log(res);
        this.slideShowImages = res;
        this.isSlider = this.slideShowImages.length > 0;
        setTimeout(() => this.initializeCarousel2(), 0);
      },
      error: (err: any) => {
        console.error("There was an error!", err);
      },
      complete: () => {
        this.isLoadingSlider = false;
      }
    });
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
    forkJoin({
      men: this.productService.getSizingGroupBy("70610"),
      women: this.productService.getSizingGroupBy("70710")
    }).subscribe({
      next: ({ men, women }) => {
        this.allSizes=men;
        this.allSizesWomen=women;
      },
      error: (err) => console.error("There was an error!", err),
    });
  }

  get_categories() {
    this.productService.getImageRotators(this.rotatorId, this.pageSize).subscribe({
      next: (res: ImageRotators[]) => {
        console.log(res);
        this.allCategories = res;
        setTimeout(() => this.initializeCarousel4(), 0);
      },
      error: (err: any) => {
        console.error("There was an error!", err);
      },
    });
  }

  get_styles() {
    forkJoin({
      men: this.productService.getStyleGroupBy("70610"),
      women: this.productService.getStyleGroupBy("70710")
    }).subscribe({
      next: ({ men, women }) => {
        this.allStyles = men.concat(women);
        setTimeout(() => this.initializeCarousel(), 0);
      },
      error: (err) => console.error("There was an error!", err),
    });
  }
   

  viewShopByStyle(destUrl: string) {
    this.router.navigate(["/category", destUrl]);
  }

  viewShopBySizeMen(destUrl: string, sizeCode: number) {
    let deptId = destUrl.split('-')[0];
    this.router.navigate(["/category", `${deptId}-${sizeCode}-0-0-0-0`]);
  }

  viewShopBySizeWomen(destUrl: string, sizeCode: number) {
    let deptId = destUrl.split('-')[0];
    this.router.navigate(["/category", `${deptId}-${sizeCode}-0-0-0-0`]);
  }

  viewShopByDepartments(routeId: string) {
    this.router.navigate(["/category", routeId]);
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
    this.router.navigate(["/product"]);
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
