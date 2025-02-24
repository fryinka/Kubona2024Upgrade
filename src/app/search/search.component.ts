import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID, afterNextRender } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import * as AOS from "aos";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FlowbiteService } from "../flowbite.service";

@Component({
    selector: "app-search",
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit, AfterViewInit {
  advancedFilters = false;
  dataLoaded = false;
  searchResults: any[] = []; // Adjust type as needed
  searchQuery: string = "";
  urlId: any;
  displayedProducts: any[] = [];
  productsPerPage = 12;
  currentPage = 1;
  hasMoreProducts = false;
  isProducts = false;
  isLoading = false; // <-- Add loading state

  sizes: any = [];
  sizesWomen: any = [];
  selectedSize: string = "0";
  selectedCategory: string | null = null;
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

  toggleAdvancedFilters() {
    this.advancedFilters = !this.advancedFilters; // Toggles the state
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });
    this.getSizing();
    this.getSizingWomen();
    this.getColor();
    this.getStyle();
    this.getMaterial();
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
  }

  selectedSizeClick(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSize = selectElement.value;
    console.log("Selected Size:", this.selectedSize);
    this.getFilterproducts();
  }

  onSearchChange() {
    console.log(this.searchQuery);
    this.getFilterproducts();
  }

  viewProduct(productId: number) {
    this.router.navigate(["/product-details", productId]);
  }

  openAdvancedFilters() {
    this.advancedFilters = !this.advancedFilters;
  }
  getSizing() {
    this.http
      .get("https://friday.kubona.ng/api/SizingGroupBy/70610")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.sizes = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  getSizingWomen() {
    this.http
      .get("https://friday.kubona.ng/api/SizingGroupBy/70710")
      .subscribe({
        next: (res) => {
          console.log(res);
          this.sizesWomen = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  getColor() {
    this.http
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
    this.http
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
    this.http
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
    if (this.selectedSize == null || this.selectedSize == "") {
      this.selectedSize = "0";
    }

    if (this.selectedColors == null || this.selectedColors == "") {
      this.selectedColors = "0";
    }

    if (this.selectedStyles == null || this.selectedStyles == "") {
      this.selectedStyles = "0";
    }

    if (this.selectedMaterial == null || this.selectedMaterial == "") {
      this.selectedMaterial = "0";
    }

    this.urlId =
      "0" +
      "-" +
      this.selectedSize +
      "-" +
      this.selectedColors +
      "-" +
      this.selectedStyles +
      "-" +
      this.selectedMaterial;
    if (this.searchQuery == null || this.searchQuery == "") {
      alert("Please type to search");
    } else {
      this.isLoading = true; // <-- Start loading
      this.http
        .get<any[]>(
          "https://friday.kubona.ng/api/Product/Search?query=" +
            this.searchQuery +
            "&urlId=" +
            this.urlId
        )
        .subscribe({
          next: (res) => {
            console.log("Products", res);
            this.searchResults = res;
            this.loadProducts();
            this.isProducts = this.searchResults.length > 0;
          },
          error: (err) => {
            console.error("There was an error!", err);
          },
          complete: () => {
            this.isLoading = false; // <-- Stop loading
          },
        });
    }
  }

  loadProducts() {
    if (Array.isArray(this.searchResults)) {
      this.displayedProducts = this.searchResults.slice(
        0,
        this.currentPage * this.productsPerPage
      );
      this.hasMoreProducts =
        this.searchResults.length > this.displayedProducts.length;
    } else {
      console.error("Fetched data is not an array:", this.searchResults);
    }
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

  onScroll(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      if (
        (document?.getElementById("products")?.clientHeight ?? 0) +
          (document?.getElementById("products")?.scrollTop ?? 0) >=
          (document?.getElementById("products")?.scrollHeight ?? 0) &&
        this.hasMoreProducts
      ) {
        // 100px buffer before reaching the bottom
        this.loadMore();
      }
    }
  }

  loadMore() {
    this.currentPage++;
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    $(".owl-new-arrival-search").owlCarousel({
      loop: true,
      margin: 40,
      infinite: true,
      nav: false,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3.78,
        },
      },
    });

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
}
