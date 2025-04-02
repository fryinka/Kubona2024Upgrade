import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID, afterNextRender } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { CartService } from "../services/cart.service";
import { ChangeDetectorRef } from "@angular/core";
import { FlowbiteService } from "../services/flowbite.service";
import { SeoService } from "../services/seo.service";
import { ProductService } from "../services/product.service";
import { Cartlist, Prodlist, ProductImages, RecentlyViewed, RelatedProducts, Sizelist } from "../models/models";
import { AnonymousUserService } from "../services/anonUser.service";
import { CookieService } from "ngx-cookie-service";
import { GoogleAnalyticsService } from "../services/google-analytics.service";
import { FacebookEventService } from "../services/facebook-events.service";

@Component({
  selector: "app-product-details",
  imports: [CommonModule,],
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"]
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  size: any;
  isSimilarId: any;
  productSizes: Sizelist[] = [];
  isMenuOpen = false;
  dataLoaded = false;
  productImages: ProductImages[]=[];
  productDetails!: Prodlist;
  recentlyViewed: any;
  selectedSizeId: any;
  productColors: any;
  isRecentlyViewed = false;
  recentlyViewedProducts: any;
  isAccessory: boolean = false;
  isSizeSelected: boolean = false;
  isColorSelected: boolean = false;
  productId: string | null = null;
  prodId: number = 0;
  availableSizesTagString: string = "";
  selectedColorId: string | null = null;
  recommendedProducts: RelatedProducts[] = [];
  departmentId: number = 0;
  loader: boolean = false;
  showWomen: boolean = true;
  showMen: boolean = false;
  userId:string | null="";
  internetPrice: number = 0;
  departmentName: string = "";

  // Products Data

  productTitle: string = "";
  productCategoryTitle: string | null = null;
  productCategoryName: string | null = null;
  productColor: string | null = null;
  selectedSizeQty: number | null = null;
  productPrice: number = 0;
  productSize: string | null = null;
  productImage: string | null = null;
  itemGroupId: string | null = null;
  trackingId: string | null = null;
  isSizeLoading: boolean = true;
  selectedSize: string | null = null;
  itemGroupSizeId: number = 0;
  pageSize: number = 8;


  showSizeGuideImage: boolean = false;
  gender: "men" | "women" | null = null; // Added gender property
  cartCount: number = 0;

  // Method to toggle the size guide image
  toggleSizeGuideImage(): void {
    this.showSizeGuideImage = !this.showSizeGuideImage;
  }

  navigateToCS() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/how-to-check-your-size"]);
  }

  // Example method to check if the size is selected

  // Example method to handle size selection
  selectSize(size: string, sizeCode: string, quantity: number, itemGroupSizeId: number): void {
    this.selectedSize = size;
    this.selectedSizeId = sizeCode;
    this.productSize = size;
    this.isSizeSelected = true;
    this.itemGroupSizeId = itemGroupSizeId;
    this.selectedSizeQty = quantity;
  }

  constructor(private router: Router, private route: ActivatedRoute, private cartService: CartService,
    private cdr: ChangeDetectorRef, private flowbiteService: FlowbiteService, private seoService: SeoService,
    private productService: ProductService, @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService, private googleService: GoogleAnalyticsService, private facebookService: FacebookEventService,
  ) {

  }


  ngOnInit() {
    // Other initialization code

    this.route.paramMap.subscribe((params) => {
      this.productId = params.get("id");
    });
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });
    this.getProductDetails();
    this.getproductImages();
    this.getproductSizes();
    this.selectedColorId = this.productDetails.colorDesc;

    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
  }



  getRecommendedProducts(): void {
    this.productService.getRelatedProducts(this.departmentId, this.prodId, this.pageSize).subscribe(response => {
      this.recommendedProducts = response;
      setTimeout(() => this.initializeCarouselRecommended(), 0);
    }, error => {
      console.error("Error fetching recommended products:", error);
    });
  }

  // Method to get and display the recently viewed products
  getRecentlyViewed() {
      this.productService.getRecentlyViewed(this.pageSize).subscribe({
        next: (response: RecentlyViewed[]) => {
          this.recentlyViewed = response;
          this.isRecentlyViewed = this.recentlyViewed.length > 0;
          if (this.isRecentlyViewed) {
            setTimeout(() => this.initializeCarouselRecentlyViewed(), 0);
          }
        }, error: (error) => {
          console.error("Error fetching recently viewed products", error);
        },
      });
  }


  selectColor(color: string) {
    this.selectedColorId = color;
    this.productDetails.colorDesc = color;
    // alert(this.productDetails.colorDesc+' color selected');
  }

  selectColors(color: string, urlId: string, productId: string) {
    alert(color);
    this.selectedColorId = color;
    this.isColorSelected = true;
    this.productDetails.colorDesc = color;

    this.getproductImagesByColor(urlId);

    this.getProductImageSize(productId);

    this.selectedSizeId == null;
    this.selectedSize == null;
  }

  getProductImageSize(productId: string) {
    this.productService.getProductSizes(productId).subscribe({
      next: (response: Sizelist[]) => {
        this.productSizes = response;
        if (Array.isArray(response)) {
          this.availableSizesTagString = response
            .filter((v) => v.quantity > 0)
            .map(
              (item) => `${item.sizeDesc.split(" ")[1]} (${item.trackingId})`
            )
            .join(", ");
        }
      },
      error: (err) => {
        console.error("There was an error!", err);
      },
    });
  }

  getproductImagesByColor(urlId: string) {
    this.destroyCarousel();
    this.productService.getProductImages(urlId).subscribe({
      next: (response: ProductImages[]) => {
        this.productImages = response;
        if (Array.isArray(response)) {
          this.productImage = response[0]?.image;
        }
        //Trigger change detection
        this.cdr.detectChanges();
        // Initialize carousel after a short delay to ensure DOM is updated
        setTimeout(() => {
          this.initializeCarousel3();
        }, 100); // Increase delay if necessary
      }, error: (err) => {
        console.error("There was an error!", err);
      },
    });
  }

  destroyCarousel() {
    const sync1 = $("#sync1");
    const sync2 = $("#sync2");

    // Destroy both carousels
    sync1
      .trigger("destroy.owl.carousel")
      .removeClass("owl-loaded owl-drag owl-hidden");
    sync2
      .trigger("destroy.owl.carousel")
      .removeClass("owl-loaded owl-drag owl-hidden");

    // Remove added elements and inline styles by Owl Carousel
    sync1.find(".owl-stage-outer").children().unwrap();
    sync2.find(".owl-stage-outer").children().unwrap();

    // Reset styles and reapply the owl-carousel class
    sync1.removeAttr("style").addClass("owl-carousel");
    sync2.removeAttr("style").addClass("owl-carousel");
  }

  initializeCarousel3() {
    const sync1 = $("#sync1");
    const sync2 = $("#sync2");

    setTimeout(() => {
      // Reinitialize main carousel
      sync1.owlCarousel({
        items: 1,
        slideSpeed: 2000,
        nav: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        dots: true,
        loop: true,
        responsiveRefreshRate: 200,
        navText: [
          '<img src="assets/images/ban-left.png" class="nav-prev" alt="Prev">',
          '<img src="assets/images/ban-right.png" class="nav-next" alt="Next">',
        ],
      });

      // Reinitialize thumbnail carousel
      sync2.owlCarousel({
        // margin: 15,
        items: 7,
        dots: false,
        nav: true,
        slideBy: 4,
        loop: false,
        responsiveRefreshRate: 100,
      });

      // Sync thumbnails with main carousel, checking if sync1 instance is ready
      sync2.on("click", ".owl-item", (e: any) => {
        e.preventDefault();
        const number = $(e.currentTarget).index();

        if (sync1.data("owl.carousel")) {
          sync1.data("owl.carousel").to(number, 300, true);
        } else {
          console.warn("sync1 is not ready");
        }
      });
    }, 100); // Delay to ensure DOM updates
  }


  addToCartOld(hasSize: boolean = true) {
    // this.facebookService.addToCart(this.internetPrice, this.prodId, this.departmentName, this.productTitle);
    // this.googleService.addToCartEventEmitter('add_to_cart', 'product_detail', this.prodId.toString(), this.internetPrice);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    this.selectedColorId = this.productDetails.colorDesc;
    if (this.productColors && this.selectedColorId === null) {
        alert("Please select color.");
        return;
    } else if (this.selectedColorId !== null) {
        this.productColor = this.selectedColorId;
    }

    if (hasSize) {
        if (this.productSize == null) {
            alert("Please select size.");
            return;
        }
    }

    const item = {
        productId: this.prodId,
        productTitle: this.productTitle,
        productCategoryTitle: this.productCategoryTitle,
        productCategoryName: this.productCategoryName,
        productColor: this.productColor,
        productPrice: this.productPrice,
        productSize: this.productSize,
        productImage: this.productImage,
        itemgroupId: this.itemGroupId,
        itemgroupSizeId: this.itemGroupSizeId,
        productQty: 1,
        sizeQty: this.selectedSizeQty
    }
    // Add new item to cart array
    cart.push(item);
    this.cartService.addToCart(item).subscribe({
        next: (orderId) => {
            console.log('Add to cart successful. Order ID:', orderId);
            // Update the orderId using the service
            this.cartService.setOrderId(orderId);
            // Update localStorage with the cart item
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            cart.push(item);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Item added to cart");
            this.router.navigate(["/cart"]);
        },
        error: (error) => {
            console.error('Add to cart failed:', error);
            alert("Add to cart failed.");
        }
    });

    // Optionally, provide feedback to user
    alert("Item added to cart");
    this.router.navigate(["/cart"]);
}

  getproductImages() {
    if (this.productId) {
      this.productService.getProductImages(this.productId).subscribe({
        next: (response: ProductImages[]) => {
          this.productImages = response;
          this.productImage = this.productImages[0].image;
          setTimeout(() => this.initializeCarousel2(), 0);
        }, error: (err) => {
          console.error("There was an error!", err);
        },
      });
    }
  }


  viewProduct(productId: string) {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/product", productId]).then(() => { });
    });
  }


  initializeCarousel2() {
    const sync1 = $("#sync1");
    const sync2 = $("#sync2");
    const slidesPerPage = 4; // globally define number of elements per page
    const syncedSecondary = true;

    sync1
      .owlCarousel({
        margin: 10,
        items: 1,
        slideSpeed: 2000,
        nav: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 600,
        dots: true,
        loop: true,
        responsiveRefreshRate: 200,
        navText: [
          '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
          '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
        ],
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 3.5,
          },
          1000: {
            items: 1,
          },
        },
      })
      .on("changed.owl.carousel", (event: any) => this.syncPosition(event));

    sync2
      .on("initialized.owl.carousel", () => {
        sync2.find(".owl-item").eq(0).addClass("current");
      })
      .owlCarousel({
        margin: 10,
        items: 7,
        dots: false,
        nav: true,
        center: false,
        smartSpeed: 200,
        slideSpeed: 500,
        slideBy: slidesPerPage,
        responsiveRefreshRate: 100,
      })
      .on("changed.owl.carousel", (event: any) => this.syncPosition2(event));

    sync2.on("click", ".owl-item", (e: any) => {
      e.preventDefault();
      const number = $(e.currentTarget).index();
      sync1.data("owl.carousel").to(number, 300, true);
    });
  }

  ngAfterViewInit() {
    AOS.init({
      duration: 1200, // Adjust animation duration if needed
      once: false, // Whether animation should happen only once - while scrolling down
      mirror: false, // Whether elements should animate out while scrolling past them
    });

    $("[data-fancybox]").fancybox({
      // Fancybox options
      loop: true,
      buttons: ["slideShow", "thumbs", "close"],
      protect: true,
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        AOS.refresh();
      }
    });
  }

  getProductDetails() {
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe((res: any) => {
        this.productDetails = res;
        this.prodId = this.productDetails.itemGroupId;
        let id:string = this.prodId + '-';
        this.productService.insertRecentlyViewed(id).subscribe(response=>{
          // console.log(response)
          this.getRecentlyViewed();
        });
        this.getRecommendedProducts();
        this.productCategoryTitle = this.productDetails.departmentName;
        this.trackingId = this.productDetails.trackingId;
        this.productTitle = this.productDetails.title;
        this.isSimilarId = this.productDetails.similarId;
        this.departmentId = this.productDetails.departmentId;
        this.departmentName = this.productDetails.departmentName;
        this.internetPrice = this.productDetails.internetPrice;
        if (this.isSimilarId !== null) {
          this.getProductColors(this.isSimilarId);
        }
        this.productPrice = this.productDetails.internetPrice;
        this.seoService.updateTitle("Shop " + this.productTitle);
        this.seoService.updateDescription(this.productDetails.title);
        this.googleService.viewContent(this.internetPrice, this.prodId, this.departmentName);
        this.facebookService.viewContent(this.internetPrice, this.prodId, this.departmentName, this.productTitle);
      });
    }
  }

  isSelected(sizeDesc: string | undefined): boolean {
    if (!this.selectedSize || !sizeDesc) {
      return false;
    }
    const selectedSizePart = this.selectedSize.split(' ')[1];
    const sizeDescPart = sizeDesc.split(' ')[1];
    return selectedSizePart == sizeDescPart;
  }


  getProductColors(similarId: string) {

    this.productService.getOtherColors(similarId, this.prodId).subscribe((res: any) => {
      this.productColors = res;
      if (this.productColors.length === 1) {
        this.selectColors(this.productColors[0].title, this.productColors[0].urlId, this.productColors[0].productId)
      }
    });
  }

  getproductSizes() {
    if (this.productId) {
      this.productService.getProductSizes(this.productId).subscribe((res: Sizelist[]) => {
        this.productSizes = res;
        if (Array.isArray(res)) {
          this.availableSizesTagString = res
            .filter((v) => v.quantity > 0)
            .map(
              (item) => `${item.sizeDesc.split(" ")[1]} (${item.trackingId})`
            )
            .join(", ");
        }
      });
    }
  }

  checkinStock() {
    if (this.productId) {
      this.productService.getProductSizes(this.productId).subscribe((res: Sizelist[]) => {
        this.productSizes = res;
        if (this.productSizes[0]["itemGroupSizeId"]) {
          this.itemGroupSizeId = this.productSizes[0]["itemGroupSizeId"];
        }
      });
    }
  }

  

  initializeCarouselRecentlyViewed() {
    $("#recentlyViewedCarousel").owlCarousel({
      loop: true,
      margin: 20,
      infinite: true,
      nav: false,
      autoplay: true, // Enables automatic sliding
      autoplayTimeout: 1500, // Delay between slides (in milliseconds, e.g., 3000ms = 3 seconds)
      autoplayHoverPause: true, // Pauses autoplay when the user hovers over the carousel
      responsive: {
        0: {
          items: 3, // Display 3 items on mobile screens
        },
        600: {
          items: 3, // Maintain 3 items for small screens
        },
        1000: {
          items: 5, // Display 5 items on larger screens
        },
      },
    });
  }

  initializeCarouselRecommended() {
    $("#recommendedCarousel").owlCarousel({
      loop: true,
      margin: 20,
      infinite: true,
      nav: false,
      autoplay: true, // Enables automatic sliding
      autoplayTimeout: 1500, // Delay between slides (in milliseconds, e.g., 3000ms = 3 seconds)
      autoplayHoverPause: true, // Pauses autoplay when the user hovers over the carousel
      responsive: {
        0: {
          items: 3, // Display 3 items on mobile screens
        },
        600: {
          items: 3, // Maintain 3 items for small screens
        },
        1000: {
          items: 5, // Display 5 items on larger screens
        },
      },
    });
  }

  syncPosition(event: any) {
    const count = event.item.count - 1;
    let current = Math.round(event.item.index - event.item.count / 2 - 0.5);

    if (current < 0) {
      current = count;
    }
    if (current > count) {
      current = 0;
    }

    const sync2 = $("#sync2");
    sync2
      .find(".owl-item")
      .removeClass("current")
      .eq(current)
      .addClass("current");

    const onscreen = sync2.find(".owl-item.active").length - 1;
    const start = sync2.find(".owl-item.active").first().index();
    const end = sync2.find(".owl-item.active").last().index();

    // Only attempt to navigate if the owl carousel instance is ready
    if (sync2.data("owl.carousel")) {
      if (current > end) {
        sync2.data("owl.carousel").to(current, 100, true);
      }
      if (current < start) {
        sync2.data("owl.carousel").to(current - onscreen, 100, true);
      }
    } else {
      console.warn("sync2 carousel instance is not ready.");
    }
  }

  syncPosition2(event: any) {
    const syncedSecondary = true;
    if (syncedSecondary) {
      const number = event.item.index;

      // Only attempt to navigate if the owl carousel instance is ready
      if ($("#sync1").data("owl.carousel")) {
        $("#sync1").data("owl.carousel").to(number, 100, true);
      } else {
        console.warn("sync1 carousel instance is not ready.");
      }
    }
  }
}
