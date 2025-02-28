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
import { CategoryService } from "../../services/category.service";
import { FlowbiteService } from "../../services/flowbite.service";

@Component({
    selector: "app-men-new-arrival",
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule], // Include ReactiveFormsModule
    templateUrl: "./men-new-arrival.component.html",
    styleUrl: "./men-new-arrival.component.css"
})
export class MenNewArrivalComponent implements OnInit {
  menRelatedProducts: any = [];
  isFilterOpen: boolean = false;
  isCategoryLoading: boolean = true;
  isLoading: boolean = false;
  isLoadingMore: boolean = false;
  page = 1;
  isSizeLoading: boolean = true;
  isProductLoading: boolean = true;
  products: any;
  sizes: any = [];
  selectedSize: string | null = "All";
  selectedCategory: string | null = "70610";
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
  searchQuery: any;
  hasMoreProducts: boolean = true; // Assume more products are available initially
  displayedProducts: any[] = [];
  productsPerPage = 12;
  currentPage = 1;
  slideShowImages: any = [];
  isLoadingSlider = false;
  isSlider = false;
  allCategories: any = [];
  subCategories: any = [];

  isProducts = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private categoryService: CategoryService,
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}
  getFilterproducts() {
    this.isProductLoading = true;

    if (this.selectedSize == null) {
      this.selectedSize = "0";
    }

    if (this.selectedColors == null) {
      this.selectedCategory = "0";
    }

    if (this.selectedStyles == null) {
      this.selectedCategory = "0";
    }

    if (this.selectedMaterial == null) {
      this.selectedCategory = "0";
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
          this.menRelatedProducts = res;
          this.isProducts = this.products.length > 0;
          this.isProductLoading = false;
        },
        error: (err) => {
          console.error("There was an error!", err);
          this.isProductLoading = false;
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

  selectedCategoryClick(categoryId: string) {
    console.log(categoryId);
    this.selectedCategory = categoryId;
    this.getFilterproducts();
  }
  getSizing() {
    this.httpClient
      .get("https://friday.kubona.ng/api/SizingGroupBy/70610")
      .subscribe({
        next: (res) => {
          //        console.log(res);
          this.sizes = res;
          // Filter the response to include only sizes between 39 and 47
          // this.sizes = [
          //   { sizeCode: 39, sizeDesc: "Size 39" },
          //   { sizeCode: 40, sizeDesc: "Size 40" },
          //   { sizeCode: 41, sizeDesc: "Size 41" },
          //   { sizeCode: 42, sizeDesc: "Size 42" },
          //   { sizeCode: 43, sizeDesc: "Size 43" },
          //   { sizeCode: 44, sizeDesc: "Size 44" },
          //   { sizeCode: 45, sizeDesc: "Size 45" },
          //   { sizeCode: 46, sizeDesc: "Size 46" },
          //   { sizeCode: 47, sizeDesc: "Size 47" },
          // ];
          this.isSizeLoading = false;
          setTimeout(() => this.initializeCarousel2(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  getSubCategories() {
    this.httpClient
      .get<any[]>("https://friday.kubona.ng/api/DepartmentGroupBy?urlId=70610")
      .subscribe({
        next: (res) => {
          // Filter out items with imageUrl as null
          this.subCategories = res.filter((item) => item.imageUrl !== null);

          this.isCategoryLoading = false;
          setTimeout(() => this.initializeCarousel(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
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
          setTimeout(() => this.initializeCarousel4(), 0);
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
  getColor() {
    this.httpClient
      .get("https://friday.kubona.ng/api/ColorsGroupBy/70610")
      .subscribe({
        next: (res) => {
          //        console.log(res);
          this.colors = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  getproductsBySizes(sizeId: any) {
    this.isProductLoading = true;
    this.isProducts = false;

    this.httpClient
      .get<any[]>(
        `https://friday.kubona.ng/api/Product/Products/70610-${sizeId}?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=10`
      )
      .subscribe({
        next: (res) => {
          console.log("Products", res);
          this.products = res;
          this.menRelatedProducts = res;
          this.isProducts = this.products.length > 0;
          this.isProductLoading = false;
          this.isProducts = true;
        },
        error: (err) => {
          console.error("There was an error!", err);
          this.isProductLoading = false;
        },
      });
  }

  filterProductsForSizes(sizeId: any) {
    if (sizeId == "All") {
      this.selectedSize = sizeId;
      this.get_men_related_products();
    } else {
      this.getproductsBySizes(sizeId);
    }
  }

  onColorChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedColors = selectElement.value;
    console.log("Selected Color:", this.selectedColors);
    this.getFilterproducts();
  }
  getStyle() {
    this.httpClient
      .get("https://friday.kubona.ng/api/StylesGroupBy/70610")
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
  onStyleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStyles = selectElement.value;
    console.log("Selected Style:", this.selectedStyles);
    this.getFilterproducts();
  }
  getMaterial() {
    this.httpClient
      .get("https://friday.kubona.ng/api/MaterialGroupBy/70610")
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
  viewShopByDepartments(routeId: number) {
    console.log(routeId);
    this.router.navigate(["/products", routeId, 0, 0, 0, 0]);
  }
  initializeCarousel() {
    $(".owl-style").owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      autoplay: false,
      dots: false,
      autoplayTimeout: 3000,
      autoplaySpeed: 300,
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
  initializeCarousel4() {
    $(".owl-featured").owlCarousel({
      loop: true,

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
    this.router.navigate(["/product-details", productId]);
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
    this.get_men_related_products();
    AOS.init({ duration: 1000 });
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

  get_men_related_products() {
    const searchQuery = this.constructQuery(this.page);

    const API_URL = `https://friday.kubona.ng/api/Product/Products/${searchQuery}?pageIndex=${this.page}`;

    this.httpClient.get(API_URL).subscribe({
      next: (res) => {
        console.log(res);
        this.menRelatedProducts = res;
        this.isProductLoading = false;
        this.isProducts = this.menRelatedProducts.length > 0;
        setTimeout(() => this.initializeCarousel5(), 0);
      },
      error: (err) => {
        this.isProductLoading = false;
        console.error("There was an error!", err);
      },
    });
  }

  loadMore() {
    this.isLoadingMore = true;
    if (!this.isLoading) {
      this.isLoading = true;

      const searchQuery = this.constructQuery(this.page);

      const API_URL = `https://friday.kubona.ng/api/Product/Products/${searchQuery}?pageIndex=${this.page}`;

      // Make the API request
      this.httpClient.get(API_URL).subscribe(
        (data: any) => {
          const newProducts = data; // Adjust based on actual API structure

          // If no products are returned, stop loading more
          if (newProducts.length === 0) {
            this.hasMoreProducts = false;
          } else {
            this.menRelatedProducts.push(...newProducts); // Append the new products
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

    return `${query}&lowerPrice=0&upperPrice=0&sortId=${this.selectedSort}&page=${page}`;
  }

  navigateToMen(id?: string, destinationUrl?: string) {
    if (id) {
      this.categoryService.setCategoryId(id);
      this.router.navigate(["/men/category", destinationUrl]); // Navigate with 'id'
    } else {
      this.router.navigate(["/men"]); // Navigate without 'id'
    }
  }

  initializeCarousel5() {
    $(".owl-new-arrival").owlCarousel({
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
