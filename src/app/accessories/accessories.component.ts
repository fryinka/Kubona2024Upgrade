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
    selector: "app-category",
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./accessories.component.html",
    styleUrl: "./accessories.component.css"
})
export class AccessoriesComponent implements OnInit, AfterViewInit {
  dataLoaded = false;
  isProductLoading: boolean = true;
  isFilterOpen: boolean = false;
  isCategoryLoading: boolean = true;
  isSizeLoading: boolean = true;

  subCategories: any = [];
  sizes: any = [];
  selectedSize: string | null = null;
  selectedCategory: string | null = null;
  colors: any = [];
  selectedColors: string = "";
  styles: any = [];
  selectedStyles: string = "";
  materials: any = [];
  selectedMaterial: string = "";
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
  selectedSort: string = "";

  products: any[] = [];
  displayedProducts: any[] = [];
  productsPerPage = 12;
  currentPage = 1;
  hasMoreProducts = false;
  isProducts = false;

  searchQuery: any;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private flowbiteService: FlowbiteService
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

  get isMobile(): boolean {
    return window.innerWidth < 768;
  }

  selectedCategoryClick(categoryId: string) {
    console.log(categoryId);
    this.selectedCategory = categoryId;
    this.getFilterproducts();
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
  extractSizeNumber(sizeDesc: string): string {
    const match = sizeDesc.match(/\d+/); // Match only the numbers
    return match ? match[0] : sizeDesc; // Return the matched number or original if none
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
    this.httpClient
      .get<any[]>("https://friday.kubona.ng/api/Product/Products/70340")
      .subscribe({
        next: (res) => {
          console.log("Products", res);
          this.products = res;
          this.isProductLoading = false;
          this.loadProducts();
          this.isProducts = this.products.length > 0;
        },
        error: (err) => {
          console.error("There was an error!", err);
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

  onScroll(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      const productsElement = document.getElementById("products");
      if (
        productsElement &&
        productsElement.clientHeight + productsElement.scrollTop >=
          productsElement.scrollHeight &&
        this.hasMoreProducts
      ) {
        this.loadMore();
      }
    }
  }
  loadProducts() {
    if (Array.isArray(this.products)) {
      this.displayedProducts = this.products.slice(
        0,
        this.currentPage * this.productsPerPage
      );
      this.hasMoreProducts =
        this.products.length > this.displayedProducts.length;
    } else {
      console.error("Fetched data is not an array:", this.products);
    }
  }

  loadMore() {
    this.currentPage++;
    this.loadProducts();
  }
  initializeCarousel() {
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
