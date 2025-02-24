import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  Inject,
  PLATFORM_ID,
  afterNextRender,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms"; // Import ReactiveFormsModule
import { Router } from "@angular/router";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CategoryService } from "../services/category.service";
import { FlowbiteService } from "../flowbite.service";

@Component({
    selector: "app-women-new-arrivals",
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./women-new-arrivals.component.html",
    styleUrl: "./women-new-arrivals.component.css"
})
export class WomenNewArrivalsComponent {
  womenRelatedProducts: any = [];
  products: any;
  isFilterOpen: boolean = false;
  sizes: any;
  isCategoryLoading: boolean = true;
  isProductLoading: boolean = true;
  isLoadingMore: boolean = false;
  isLoading: boolean = false;
  isSizeLoading: boolean = true;
  page: number = 1;
  subCategories: any = [];
  selectedSize: string | null = "All";
  selectedColors: string = "0";
  selectedStyles: string = "0";
  selectedMaterial: string = "0";
  selectedCategory: string | null = "70710";
  searchQuery: any;
  selectedSort: string = "0";
  hasMoreProducts: boolean = true; // Assume more products are available initially
  displayedProducts: any[] = [];
  productsPerPage = 12;
  currentPage = 1;
  slideShowImages: any = [];
  isLoadingSlider = false;
  isSlider = false;
  allCategories: any = [];
  materials: any = [];
  colors: any = [];
  styles: any = [];
  isMobileView: boolean = false;
  sorts: any = [
    {
      sortId: "1",
      sortName: "HIGH PRICE",
    },
    {
      sortId: "2",
      sortName: "LOW PRICE",
    },
    {
      sortId: "3",
      sortName: "TITLE",
    },
    {
      sortId: "4",
      sortName: "POPULAR",
    },
    {
      sortId: "5",
      sortName: "NEWEST",
    },
    {
      sortId: "6",
      sortName: "RANDOMLY",
    },
  ];

  isProducts = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private categoryService: CategoryService,
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  selectedCategoryClick(categoryId: string) {
    console.log(categoryId);
    this.selectedCategory = categoryId;
    this.getFilterproducts();
  }

  getSubCategories() {
    this.httpClient
      .get("https://friday.kubona.ng/api/DepartmentGroupBy?urlId=70710")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.subCategories = Array.isArray(res)
            ? res.filter((v) => v.imageUrl)
            : [];
          this.isCategoryLoading = false;
          setTimeout(() => this.initializeCarousel(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  extractSizeNumber(sizeDesc: string | null): string[] {
    if (!sizeDesc) {
      return [];
    }

    // Split the sizes by comma and trim whitespace
    const sizeParts = sizeDesc.split(",");

    // Extract only the numeric parts
    return sizeParts
      .map((part) => part.trim().match(/\d+/)) // Match only the numeric values
      .filter((match) => match) // Remove null matches
      .map((match: any) => match[0]); // Extract the matched number as a string
  }

  get isMobile(): boolean {
    return window.innerWidth < 768;
  }

  getSizing() {
    this.httpClient
      .get("https://friday.kubona.ng/api/SizingGroupBy/70710")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.sizes = res;
          this.isSizeLoading = false;
          setTimeout(() => this.initializeCarousel2(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  getColor() {
    this.httpClient
      .get("https://friday.kubona.ng/api/ColorsGroupBy/70710")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.colors = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  onColorChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedColors = selectElement.value;
    console.log("Selected Color:", this.selectedColors);
    this.getFilterproducts();
  }
  getStyle() {
    this.httpClient
      .get("https://friday.kubona.ng/api/StylesGroupBy/70710")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.styles = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  onStyleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStyles = selectElement.value;
    console.log("Selected Style:", this.selectedStyles);
    this.getFilterproducts();
  }
  getMaterial() {
    this.httpClient
      .get("https://friday.kubona.ng/api/MaterialGroupBy/70710")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.materials = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  onMaterialChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMaterial = selectElement.value;
    console.log("Selected Material:", this.selectedMaterial);
    this.getFilterproducts();
  }
  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSort = selectElement.value;
    console.log("Selected Sort:", this.selectedSort);
    this.getFilterproducts();
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
          this.womenRelatedProducts = res;
          this.isProducts = this.products.length > 0;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  getproductsBySizes(sizeId: any) {
    this.isProductLoading = true;
    this.selectedSize = sizeId === "All" ? null : sizeId;
    this.getFilterproducts();
  }

  filterProductsForSizes(sizeId: any) {
    if (sizeId == "All") {
      this.selectedCategory = sizeId;
      this.get_women_related_products();
    } else {
      this.getproductsBySizes(sizeId);
    }
  }

  get_categories() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Image/ImageRotators?rotatorId=2&pageSize=12"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.allCategories = res;
          setTimeout(() => this.initializeCarousel3(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  onScroll(event: Event) {
    console.log("Scroll event triggered");
    if (isPlatformBrowser(this.platformId)) {
      const productsElement = document.getElementById("products");
      if (!productsElement) return;

      const { clientHeight, scrollTop, scrollHeight } = productsElement;

      console.log(
        "first",
        clientHeight,
        scrollTop,
        scrollHeight,
        this.hasMoreProducts,
        clientHeight + scrollTop >= scrollHeight - 100
      );

      // Adjust condition to include a buffer of 100px
      if (
        clientHeight + scrollTop >= scrollHeight - 100 &&
        this.hasMoreProducts
      ) {
        this.loadMore();
      }
    }
  }
  loadMore() {
    this.isLoadingMore = true;
    console.log("isLoading", this.isLoading);
    if (!this.isLoading) {
      this.isLoading = true;

      const searchQuery = this.constructQuery(this.page);

      const API_URL = `https://friday.kubona.ng/api/Product/Products/${searchQuery}`;

      // Make the API request
      this.httpClient.get(API_URL).subscribe(
        (data: any) => {
          const newProducts = data; // Adjust based on actual API structure

          // If no products are returned, stop loading more
          if (newProducts.length === 0) {
            this.hasMoreProducts = false;
          } else {
            this.womenRelatedProducts.push(...newProducts); // Append the new products
            this.page++; // Increment the page number
            this.hasMoreProducts = true;
          }
          this.isLoading = false; // Allow more API calls after this completes
          this.isLoadingMore = false; // Allow more API calls after this completes
        },
        (error: any) => {
          console.error("Error loading products", error);
          this.isLoading = false; // Allow more API calls after this completes
          this.isLoadingMore = false; // Allow more API calls after this completes
        }
      );
    }
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
  viewShopByDepartments(routeId: number) {
    console.log(routeId);
    this.router.navigate(["/products", routeId, 0, 0, 0, 0]);
  }

  navigateToWomen(id?: string, destinationUrl?: string) {
    if (id) {
      this.categoryService.setCategoryId(id);
      this.router.navigate(["/category", destinationUrl]); // Navigate with 'id'
    } else {
      this.router.navigate(["/women"]); // Navigate without 'id'
    }
  }

  initializeCarousel() {
    $(".owl-style").owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplaySpeed: 300,
      dots: false,
      navText: [
        // '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        // '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">'
      ],
      responsive: {
        0: {
          items: 3.5,
        },
        600: {
          items: 3.5,
        },
        1000: {
          items: 5.5,
        },
      },
    });
  }
  initializeCarousel2() {
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
          items: 8,
        },
      },
    });
  }

  initializeCarousel3() {
    $(".owl-new-arrival-category").owlCarousel("destroy"); // Destroy the previous instance
    $(".owl-new-arrival-category").owlCarousel({
      loop: false,
      margin: 50,
      nav: false,
      items: 1,
      autoplay: false,
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
  }
  goToCategoryMen() {
    this.router.navigate(["/men"]);
  }
  goToCategoryWomen() {
    this.router.navigate(["/women"]);
  }

  selectedSizeClick(sizeCode: string) {
    console.log(sizeCode);
    this.selectedSize = sizeCode;
    this.getFilterproducts();
  }

  viewProduct(productId: number) {
    this.router.navigate(["/product-details", productId], {
      queryParams: { category: "women" },
    });
  }

  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });
    this.get_sliders();
    this.get_categories();
    this.getSubCategories();
    this.getSizing();
    this.getColor();
    this.getStyle();
    this.getMaterial();
    this.get_women_related_products();

    AOS.init({ duration: 1000 });
  }

  get_women_related_products() {
    const searchQuery = this.constructQuery(this.page);

    const API_URL = `https://friday.kubona.ng/api/Product/Products/${searchQuery}`;

    this.httpClient.get(API_URL).subscribe({
      next: (res) => {
        console.log(res);
        this.womenRelatedProducts = res;
        this.isProductLoading = false;
        setTimeout(() => this.initializeCarousel6(), 0);
      },
      error: (err) => {
        this.isProductLoading = false;
        console.error("There was an error!", err);
      },
    });
  }

  constructQuery(page: number): string {
    const queryParts = [
      this.selectedCategory,
      this.selectedSize === "All" ? null : this.selectedSize,
      this.selectedColors,
      this.selectedStyles,
      this.selectedMaterial,
    ];

    // Filter out null or undefined values and join the remaining parts
    const query = queryParts
      .filter((part) => part !== null && part !== undefined)
      .join("-");

    return `${query}&lowerPrice=0&upperPrice=0&sortId=${this.selectedSort}&pageIndex=${page}`;
  }

  initializeCarousel6() {
    $(".owl-new-arrival2").owlCarousel({
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
}
