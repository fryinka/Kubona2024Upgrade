import {
  Component,
  AfterViewInit,
  OnInit,
  Inject,
  PLATFORM_ID,
  afterNextRender,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { NavigationEnd, Router } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FlowbiteService } from "../flowbite.service";
@Component({
  selector: "app-women-accessories",
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./women-accessories.component.html",
  styleUrl: "./women-accessories.component.css",
})
export class WomenAccessoriesComponent {
  dataLoaded = false;
  isFilterOpen: boolean = false;
  isCategoryLoading: boolean = true;
  isLoading: boolean = false;
  isSizeLoading: boolean = true;
  isProductLoading: boolean = true;
  subCategories: any = [];
  sizes: any = [];
  isLoadingMore = false;
  page = 1;
  selectedSize: string | null = null;
  selectedCategory: string | null = "70340";
  colors: any = [];
  selectedColors: string = "0";
  styles: any = [];
  selectedStyles: string = "0";
  materials: any = [];
  selectedMaterial: string = "0";
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
  selectedSort: string = "0";

  products: any[] = [];
  displayedProducts: any[] = [];
  productsPerPage = 12;
  currentPage = 1;
  hasMoreProducts = false;
  isProducts = false;

  searchQuery: any;
  womenRelatedProducts: any;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  viewProduct(productId: number) {
    this.router.navigate(["/product-details", productId], {
      queryParams: { category: "accessories" },
    });
  }

  selectedSizeClick(sizeCode: string) {
    console.log(sizeCode);
    this.selectedSize = sizeCode;
    this.getFilterproducts();
  }

  selectedCategoryClick(categoryId: string) {
    console.log(categoryId);
    this.selectedCategory = categoryId;
    this.getFilterproducts();
  }
  get isMobile(): boolean {
    return window.innerWidth < 768;
  }

  getSubCategories() {
    this.httpClient
      .get("https://friday.kubona.ng/api/DepartmentGroupBy?urlId=70340")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.subCategories = res;
          this.isCategoryLoading = false;
          setTimeout(() => this.initializeCarousel(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  getSizing() {
    this.httpClient
      .get("https://friday.kubona.ng/api/SizingGroupBy/70340")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.sizes = res;
          this.isSizeLoading = false;
          setTimeout(() => this.initializeCarousel2(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
          this.isSizeLoading = false;
        },
      });
  }
  getColor() {
    this.httpClient
      .get("https://friday.kubona.ng/api/ColorsGroupBy/70340")
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
      .get("https://friday.kubona.ng/api/StylesGroupBy/70340")
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
      .get("https://friday.kubona.ng/api/MaterialGroupBy/70340")
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
  getproducts() {
    const searchQuery = this.constructQuery();
    const API_URL = `https://friday.kubona.ng/api/Product/Products/${searchQuery}?pageIndex=${this.page}`;

    this.httpClient.get<any[]>(API_URL).subscribe({
      next: (res) => {
        console.log("Products", res);
        this.products = res;
        this.isProductLoading = false;
        this.displayedProducts = res;
        if (this.products.length > 0) {
          this.page++; // Increment the page number
          this.isProducts = true;
        }
      },
      error: (err) => {
        console.error("There was an error!", err);
      },
    });
  }
  extractSizeNumber(sizeDesc: string): string {
    const match = sizeDesc.match(/\d+/); // Match only the numbers
    return match ? match[0] : sizeDesc; // Return the matched number or original if none
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
          this.displayedProducts = res;
          this.isProducts = this.products.length > 0;
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
    if (this.displayedProducts && !this.isLoading) {
      this.isLoading = true;

      const searchQuery = this.constructQuery();

      const API_URL = `https://friday.kubona.ng/api/Product/Products/${searchQuery}?pageIndex=${this.page}`;

      // Make the API request
      this.httpClient.get(API_URL).subscribe(
        (data: any) => {
          const newProducts = data; // Adjust based on actual API structure

          // If no products are returned, stop loading more
          if (this.displayedProducts.length === 0) {
            this.hasMoreProducts = false;
          } else {
            this.displayedProducts.push(...newProducts); // Append the new products
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
  initializeCarousel() {
    $(".owl-style").owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      dots: false,
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
  constructQuery(): string {
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

    return `${query}&sortId=${this.selectedSort}`;
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
  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });
    this.getSubCategories();
    this.getSizing();
    this.getColor();
    this.getStyle();
    this.getMaterial();
    this.getproducts();
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
  }
  ngAfterViewInit(): void {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: false,
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        AOS.refresh();
      }
    });
  }
}
