import {
  Component,
  AfterViewInit,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
  afterNextRender,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Meta, Title } from "@angular/platform-browser";
import { filter } from "rxjs/operators";
import { CategoryService } from "../services/category.service";
import { FlowbiteService } from "../services/flowbite.service";

@Component({
    selector: "app-category",
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./women.component.html",
    styleUrl: "./women.component.css"
})
export class WomenComponent implements OnInit, AfterViewInit {
  dataLoaded = false;

  isCategoryLoading: boolean = true;
  isSizeLoading: boolean = true;
  isProductLoading: boolean = true;

  products: any[] = []; // Store the products
  hasMoreProducts: boolean = true; // Assume more products are available initially
  isLoading: boolean = false; // Prevent multiple API calls at once
  page: number = 1;
  subCategories: any = [];
  sizes: any = [];
  isLoadingMore = false;
  selectedSize: string | null = "All";
  selectedCategory: string | null = "70710";
  colors: any = [];
  selectedColors: string = "0";
  styles: any = [];
  heels: any = [];
  selectedHeels: string = "0";
  selectedStyles: string = "0";
  materials: any = [];
  selectedMaterial: string = "0";
  hasCategoryId: boolean = false;
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

  isFilterOpen: boolean = false;
  displayedProducts: any[] = [];
  productsPerPage = 12;
  currentPage = 1;
  isMobileView: boolean = false;

  isProducts = false;

  searchQuery: any;
  unavailableSizes: Set<number> = new Set();

  apiUrl = "https://friday.kubona.ng/api/SizingGroupBy/70710";
  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private httpClient: HttpClient,
    private http: HttpClient,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.titleService.setTitle("Mens Category");
    this.metaService.addTags([
      { name: "keywords", content: "Mens Category" },
      {
        name: "description",
        content: "Mens Category page description content",
      },
    ]);
  }

  onScroll(event: Event) {
    console.log("Scroll event triggered");
    if (isPlatformBrowser(this.platformId)) {
      const productsElement = document.getElementById("products");
      if (!productsElement) return;

      const { clientHeight, scrollTop, scrollHeight } = productsElement;

      // Adjust condition to include a buffer of 100px
      if (
        clientHeight + scrollTop >= scrollHeight - 100 &&
        this.hasMoreProducts
      ) {
        this.loadMore();
      }
    }
  }

  viewProduct(productId: number) {
    this.router.navigate([
      "/product-details",
      productId,
      {
        queryParams: { category: "women" },
      },
    ]);
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
  checkViewport(): void {
    this.isMobileView = window.innerWidth <= 768; // Adjust this value for mobile breakpoint
  }

  get isMobile(): boolean {
    return window.innerWidth < 768;
  }

  selectedCategoryClick(categoryId: string, categoryName: string) {
    this.selectedCategory = categoryId;
    this.getFilterproducts();
    // this.router.navigate(['/sub-category', categoryId, categoryName]);
    // this.router.navigate(['/sub-category', `${categoryId}-${categoryName}`]);
    // Navigate to sub-category with queryParams for caller
  }

  getproductsBySizes(sizeId: any) {
    this.isProductLoading = true;
    this.selectedSize = sizeId === "All" ? null : sizeId;
    this.getFilterproducts();
  }

  filterProductsForSizes(sizeId: any) {
    if (sizeId == "All") {
      this.selectedSize = sizeId;
      this.getproducts();
    } else {
      this.getproductsBySizes(sizeId);
    }
  }

  getSubCategories() {
    this.httpClient
      .get("https://friday.kubona.ng/api/DepartmentGroupBy?urlId=70710")
      .subscribe({
        next: (res) => {
          //        console.log(res);
          this.subCategories = res;
          for (let i = this.subCategories.length - 1; i >= 0; i--) {
            if (!this.subCategories[i].imageUrl) {
              this.subCategories.splice(i, 1); // Remove the item if imageUrl is null or undefined
            }
          }

          console.log(this.subCategories);
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
      .get("https://friday.kubona.ng/api/SizingGroupBy/70710")
      .subscribe({
        next: (res) => {
          //console.log(res);
          this.sizes = res;
          // Filter the response to include only sizes between 39 and 47
          // this.sizes = [
          //   { sizeCode: 35, sizeDesc: "Size 35" },
          //   { sizeCode: 36, sizeDesc: "Size 36" },
          //   { sizeCode: 37, sizeDesc: "Size 37" },
          //   { sizeCode: 38, sizeDesc: "Size 38" },
          //   { sizeCode: 39, sizeDesc: "Size 39" },
          //   { sizeCode: 40, sizeDesc: "Size 40" },
          //   { sizeCode: 41, sizeDesc: "Size 41" },
          //   { sizeCode: 42, sizeDesc: "Size 42" },
          //   { sizeCode: 43, sizeDesc: "Size 43" },
          // ];
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
          // console.log(res);
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
          //        console.log(res);
          this.styles = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  getHeels() {
    this.httpClient
      .get("https://friday.kubona.ng/api/HeelHeightGroupBy/70710")
      .subscribe({
        next: (res) => {
          //        console.log(res);
          this.heels = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  navigateToWomen(id?: string, destinationUrl?: string) {
    if (id) {
      this.categoryService.setCategoryId(id);
      this.router.navigate(["/women/category", destinationUrl]); // Navigate with 'id'
    } else {
      this.router.navigate(["/women"]); // Navigate without 'id'
    }
  }

  onHeelChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    // const parts = selectElement.value.split('-');
    // this.selectedHeels = parts.slice(5).join('-');
    this.selectedHeels = selectElement.value;
    console.log("Selected Style:", this.selectedHeels);
    this.getFilterproducts();
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
          //        console.log(res);
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
    this.isProductLoading = true;
    this.isProducts = false;
    const searchQuery = this.constructQuery();

    const API_URL = `https://friday.kubona.ng/api/Product/Products/${searchQuery}?pageIndex=${this.page}`;

    this.httpClient.get<any[]>(API_URL).subscribe({
      next: (res) => {
        this.products = res;
        this.displayedProducts = res;
        this.isProductLoading = false;
        this.isProducts = true;
        if (this.products.length > 0) {
          this.page++; // Increment the page number
          this.isProducts = true;
        }
      },
      error: (err) => {
        console.error("There was an error!", err);
        this.isProductLoading = false;
        this.isProducts = true;
      },
    });
  }

  getFilterproducts() {
    console.log("this.selectedHeels", this.selectedHeels);

    this.isProductLoading = true;
    this.isProducts = false;

    if (
      this.selectedSize == null ||
      this.selectedSize == "" ||
      this.selectedSize == undefined
    ) {
      this.selectedSize = "0";
    }

    if (
      this.selectedColors == null ||
      this.selectedColors == "" ||
      this.selectedColors == undefined
    ) {
      this.selectedColors = "0";
    }

    if (
      this.selectedStyles == null ||
      this.selectedStyles == "" ||
      this.selectedStyles == undefined
    ) {
      this.selectedStyles = "0";
    }

    if (
      this.selectedMaterial == null ||
      this.selectedMaterial == "" ||
      this.selectedMaterial == undefined
    ) {
      this.selectedMaterial = "0";
    }

    if (
      this.selectedHeels == null ||
      this.selectedHeels == "" ||
      this.selectedHeels == undefined
    ) {
      this.selectedHeels = "0";
    }

    if (
      this.selectedCategory == null ||
      this.selectedCategory == "" ||
      this.selectedCategory == undefined
    ) {
      this.selectedCategory = "70710";
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
      this.selectedMaterial +
      "-" +
      this.selectedHeels;
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
          this.isProductLoading = false;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  loadMore() {
    this.isLoadingMore = true;
    if (this.displayedProducts && !this.isLoading) {
      this.isLoading = true;

      const searchQuery = this.constructQuery();

      const API_URL = `https://friday.kubona.ng/api/Product/Products/${searchQuery}?pageIndex=${this.page}`;

      // Make the API request
      this.http.get(API_URL).subscribe(
        (data: any) => {
          const newProducts = data; // Adjust based on actual API structure

          // If no products are returned, stop loading more
          if (newProducts.length === 0) {
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

  constructQuery(): string {
    const queryParts = [
      this.selectedCategory,
      this.selectedSize === "All" ? null : this.selectedSize,
      this.selectedColors,
      this.selectedStyles,
      this.selectedMaterial,
      this.selectedHeels,
    ];

    // Filter out null or undefined values and join the remaining parts
    const query = queryParts
      .filter((part) => part !== null && part !== undefined)
      .join("-");

    return `${query}&sortId=${this.selectedSort}`;
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
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });
    this.checkViewport();
    this.getSubCategories();
    this.getSizing();
    this.getColor();
    this.getStyle();
    this.getHeels();
    this.getMaterial();
    this.isMobileView = window.innerWidth < 768; // Adjust the breakpoint as needed
    window.addEventListener("resize", () => {
      this.isMobileView = window.innerWidth < 768;
    });
    this.route.paramMap.subscribe((params) => {
      const slug = params.get("slug");
      const id = this.categoryService.getCategoryId();
      if (slug && id) {
        this.hasCategoryId = true;
        this.selectedCategoryClick(id, ""); // Call your filtering function with the 'id'
      } else {
        this.hasCategoryId = false;
        this.getproducts();
      }
    });
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
