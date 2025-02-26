import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID, afterNextRender } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CartService } from "../services/cart.service";
import { ChangeDetectorRef } from "@angular/core";
import { FlowbiteService } from "../services/flowbite.service";
import { SeoServiceService } from "../services/seo-service.service";

@Component({
  selector: "app-product-details",
  imports: [CommonModule, HttpClientModule],
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"]
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  size: any;
  isSimilarId: any;
  productSizes: any;
  isMenuOpen = false;
  dataLoaded = false;
  productImages: any;
  productDetails: any;
  recentlyViewed: any;
  selectedSizeId: any;
  productColors: any;
  isRecentlyViewed = false;
  recentlyViewedProducts: any;
  isAccessory: boolean = false;
  accessoryDepartmentId = "70340";
  isSizeSelected: boolean = false;
  isColorSelected: boolean = false;
  productId: string | null = null;
  availableSizesTagString: string = "";
  selectedColorId: string | null = null;
  recommendedProducts: any[] = []; // Adjust type as needed

  randomId: any;
  loader: boolean = false;
  showWomen: boolean = true;
  showMen: boolean = false;

  // Products Data

  productTitle: string | null = null;
  productCategoryTitle: string | null = null;
  productCategoryName: string | null = null;
  productColor: string | null = null;
  selectedSizeQty: number | null = null;
  productPrice: string | null = null;
  productSize: string | null = null;
  productImage: string | null = null;
  itemGroupId: string | null = null;
  trackingId: string | null = null;
  isSizeLoading: boolean = true;
  selectedSize: string | null = null;
  itemGroupSizeId: string | null = null;

  SizesMen = [
    { sizeCode: 39, sizeDesc: "39" },
    { sizeCode: 40, sizeDesc: "40" },
    { sizeCode: 41, sizeDesc: "41" },
    { sizeCode: 42, sizeDesc: "42" },
    { sizeCode: 43, sizeDesc: "43" },
    { sizeCode: 44, sizeDesc: "44" },
    { sizeCode: 45, sizeDesc: "45" },
    { sizeCode: 46, sizeDesc: "46" },
    { sizeCode: 47, sizeDesc: "47" },
  ];

  SizesWomen = [
    { sizeCode: 36, sizeDesc: "36" },
    { sizeCode: 37, sizeDesc: "37" },
    { sizeCode: 38, sizeDesc: "38" },
    { sizeCode: 39, sizeDesc: "39", boolean: false },
    { sizeCode: 40, sizeDesc: "40", boolean: true },
    { sizeCode: 41, sizeDesc: "41" },
    { sizeCode: 42, sizeDesc: "42" },
    { sizeCode: 43, sizeDesc: "43", boolean: true },
  ];

  availableSizes = [36, 38];

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
  selectSize(size: string, sizeCode: string, quantity: number, itemGroupSizeId?: string): void {
    this.selectedSize = size;
    this.selectedSizeId = sizeCode;
    this.productSize = size;
    this.isSizeSelected = true;
    this.itemGroupSizeId = itemGroupSizeId || null;
    this.selectedSizeQty = quantity;
    // this.checkinStock();
    // alert(this.productSize?.split(' ')[1] +' size is selected')
  }

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private flowbiteService: FlowbiteService,
    private seoService: SeoServiceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.randomId = this.generateRandomId();
    localStorage.setItem("GUID", this.randomId);
  }

  generateRandomId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
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
    this.recentlyViewedPost();
    this.getRecommendedProducts();
    // this.getProduct();

    this.seoService.updateTitle("Shop" + this.productTitle);
    // this.seoService.updateDescription();

    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
  }

  getRecommendedProducts(): void {
    this.httpClient
      .get<any[]>(
        "https://friday.kubona.ng/api/RelatedProducts?departmentId=0&itemGroupId=0&pageSize=8"
      )
      .subscribe(
        (data) => {
          // Assign data to recommendedProducts
          this.recommendedProducts = data;

          setTimeout(() => this.initializeCarouselRecommended(), 0);
        },
        (error) => {
          console.error("Error fetching recommended products:", error);
        }
      );
  }

  addItemToCart(item: any) {
    this.cartService.addToCart(item);
    this.updateCartCount();
  }

  // Update the cart count after adding items
  updateCartCount() {
    this.cartCount = this.cartService.getCartCount();
  }

  recentlyViewedPost() {
    // Retrieve userId from local storage or create a new one if not present
    let userId = localStorage.getItem("userId");

    // If userId does not exist, create a new one based on current date/time
    if (!userId) {
      const currentDate = new Date();
      userId = currentDate.toISOString();
      localStorage.setItem("userId", userId);
    }

    // Prepare the data to be sent

    const formBody2 = {
      userId: userId,
      itemId: Number(this.productId?.split("-")[0]),
      viewDate: new Date().toISOString(),
      numOfViews: "0",
    };

    // Send data to the API
    this.httpClient
      .post("https://friday.kubona.ng/api/RecentlyViewed", formBody2)
      .subscribe(
        (response) => {
          this.getRecentlyViewed(); // Fetch recently viewed products after submission
        },
        (error) => {
          console.error("Error submitting form", error);
        }
      );
  }

  // Method to get and display the recently viewed products
  getRecentlyViewed() {
    // Retrieve userId from local storage
    const userId = localStorage.getItem("userId");
    if (userId) {
      this.httpClient
        .get(
          `https://friday.kubona.ng/api/RecentlyViewed?userId=${userId}&pageSize=5`
        )
        .subscribe({
          next: (response: any) => {
            // Assuming response contains the list of products
            this.recentlyViewed = response; // Assign the response to the property
            console.log(JSON.stringify(this.recentlyViewed));
            this.isRecentlyViewed = this.recentlyViewed.length > 0; // Update the flag based on data presence
            console.log("recentlyViewed", this.recentlyViewed);
            if (this.isRecentlyViewed) {
              setTimeout(() => this.initializeCarouselRecentlyViewed(), 0); // Initialize carousel if there are recently viewed items
            }
          },
          error: (error) => {
            console.error("Error fetching recently viewed products", error);
          },
        });
    } else {
    }
  }

  getProduct(): void {
    this.http.get<any>("https://friday.kubona.ng/api/Product/70710").subscribe(
      (data) => {
        this.productTitle = data.name; // Adjust the property name as per your API response
      },
      (error) => {
        console.error("Error fetching product:", error);
      }
    );
  }

  selectColor(color: string) {
    this.selectedColorId = color;
    this.productDetails.colorDesc = color;
    // alert(this.productDetails.colorDesc+' color selected');
  }

  selectColors(color: string, urlId: string, productId: string) {
    this.selectedColorId = color;
    this.isColorSelected = true;
    this.productDetails.colorDesc = color;

    this.getproductImagesByColor(urlId);

    this.getProductImageSize(productId);

    this.selectedSizeId == null;
    this.selectedSize == null;
  }

  getProductImageSize(productId: string) {
    this.httpClient
      .get("https://friday.kubona.ng/api/Product/Sizes/" + productId)
      .subscribe({
        next: (res) => {
          this.productSizes = res;

          if (Array.isArray(res)) {
            this.availableSizesTagString = res
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

    this.httpClient
      .get("https://friday.kubona.ng/api/ProductImages?Id=" + urlId)
      .subscribe({
        next: (res) => {
          // Update product images
          this.productImages = res;
          if (Array.isArray(res)) {
            this.productImage = res[0]?.image;
          }

          // Trigger change detection
          this.cdr.detectChanges();

          // Initialize carousel after a short delay to ensure DOM is updated
          setTimeout(() => {
            this.initializeCarousel3();
          }, 100); // Increase delay if necessary
        },
        error: (err) => {
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

  addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (this.productSize == null) {
      alert("Please select size.");
      return;
    }

    if (this.productColor !== null) {
      if (this.selectedColorId !== null) {
        this.productColor = this.selectedColorId;
      } else {
        //alert("Please select color.");
        return;
      }
    }

    const item = {
      productId: this.productId,
      itemGroupId: this.itemGroupId,
      trackingId: this.trackingId,
      itemgroupSizeId: this.itemGroupSizeId,
      productTitle: this.productTitle,
      productCategoryTitle: this.productCategoryTitle,
      productCategoryName: this.productCategoryName,
      productColor: this.productColor,
      productPrice: this.productPrice,
      productSize: this.productSize,
      productImage: this.productImage,
      productQty: 1,
    };

    cart.push(item);
    this.cartService.addToCart(item);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  addToCartOld(hasSize: Boolean = true) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    console.log("this.selectedColorId", this.productColors);

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

    // alert(this.itemGroupId);

    const item = {
      productId: Number(this.productId?.split("-")[0]),
      productTitle: this.productTitle,
      productCategoryTitle: this.productCategoryTitle,
      productCategoryName: this.productCategoryName,
      productColor: this.productColor,
      productPrice: this.productPrice,
      productSize: this.productSize,
      productImage: this.productImage,
      itemgroupId: this.itemGroupId,
      itemgroupSizeId: this.itemGroupSizeId,
      trackingId: this.trackingId,
      productQty: 1,
      sizeQty: this.selectedSizeQty
    };
    // Add new item to cart array
    cart.push(item);
    this.cartService.addToCart(item);

    // Store updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Optionally, provide feedback to user
    alert("Item added to cart");
    this.router.navigate(["/cart"]);
  }

  getproductImages() {
    this.httpClient
      .get("https://friday.kubona.ng/api/ProductImages?Id=" + this.productId)
      .subscribe({
        next: (res) => {
          this.productImages = res;

          this.productImage = this.productImages[0]?.image;
          setTimeout(() => this.initializeCarousel2(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  getAccessoryByDepartment(departmentId: any) {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/DepartmentGroupBy?urlId=" +
        this.accessoryDepartmentId
      )
      .subscribe({
        next: (res) => {
          let isAccessory = false;

          if (Array.isArray(res)) {
            isAccessory = res.some((v) => v.departmentId === departmentId);
          }

          this.isAccessory = isAccessory;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  loadRecentlyViewed() {
    // Load recently viewed products from local storage or an API
    const recentlyViewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );
    this.recentlyViewed = recentlyViewed;
    this.isRecentlyViewed = this.recentlyViewed.length > 0;
  }

  viewProduct(productId: string) {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/product-details", productId]).then(() => { });
    });
  }

  // Helper method to format product title for the URL
  formatProductTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
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
    this.httpClient
      .get(`https://friday.kubona.ng/api/Product/${this.productId}`)
      .subscribe({
        next: (res: any) => {
          this.productDetails = res;

          console.log(JSON.stringify(res));

          if (this.productDetails) {
            this.productTitle = this.productDetails.title
            // this.productDetails["title"] || "No Title Available";
            this.productCategoryTitle =
              this.productDetails["departmentName"] || "No Department Name";
            this.productCategoryName =
              this.productDetails["departmentId"] || "No Department ID";
            this.productPrice = this.productDetails["internetPrice"] || 0;

            this.itemGroupId = this.productDetails["itemGroupId"];
            this.trackingId = this.productDetails["trackingId"];
            // this.productSize = this.productDetails['sizeDesc'] || 'Out Of Stock';
            // this.productColor = this.productDetails['colorDesc'] || 'No Color Available';
            this.gender = this.productDetails["gender"]; // Set the gender property

            this.getAccessoryByDepartment(this.productDetails["departmentId"]);

            this.isSimilarId = this.productDetails["similarId"];
            if (this.isSimilarId) {
              this.getProductColors();
            }
          }
        },
        error: (err) => {
          console.error(
            "There was an error fetching the product details!",
            err
          );
        },
      });
  }

  isSelected(sizeDesc: string | undefined): boolean {
    if (!this.selectedSize || !sizeDesc) {
      return false;
    }
    const selectedSizePart = this.selectedSize.split(' ')[1];
    const sizeDescPart = sizeDesc.split(' ')[1];
    return selectedSizePart == sizeDescPart;
  }

  getProductColors() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/OtherColors/ProdColors?similarId=" +
        this.isSimilarId
      )
      .subscribe({
        next: (res) => {
          this.productColors = res;

          if (this.productColors.length === 1) {
            this.selectColors(this.productColors[0]?.title, this.productColors[0]?.urlId, this.productColors[0]?.productId)
          }
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  getproductSizes() {
    this.httpClient
      .get("https://friday.kubona.ng/api/Product/Sizes/" + this.productId)
      .subscribe({
        next: (res) => {
          this.productSizes = res || "Out Of Stock";

          if (Array.isArray(res)) {
            this.availableSizesTagString = res
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

  checkinStock() {
    this.httpClient
      .get("https://friday.kubona.ng/api/Product/Sizes/" + this.itemGroupId)
      .subscribe({
        next: (res) => {
          this.productSizes = res;
          if (this.productSizes[0]["itemGroupSizeId"]) {
            this.itemGroupSizeId = this.productSizes[0]["itemGroupSizeId"];
          }
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
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
