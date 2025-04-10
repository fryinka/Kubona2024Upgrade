import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID, } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import * as AOS from "aos";
import { NavigationEnd, Router } from "@angular/router";
import { FlowbiteService } from "../services/flowbite.service";
import { SeoService } from "../services/seo.service";
import { ColorsGroup, MaterialGroup, Prodlist, SizeGroup, StylesGroup } from "../models/models";
import { debounceTime, distinctUntilChanged, forkJoin, Subject } from "rxjs";
import { ProductService } from "../services/product.service";

@Component({
  selector: "app-search",
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit, AfterViewInit {
  advancedFilters = false;
  dataLoaded = false;
  searchResults: Prodlist[] = []; // Adjust type as needed
  searchQuery: string = "";
  urlId: string = "";
  displayedProducts: Prodlist[] = [];
  productsPerPage = 12;
  currentPage = 1;
  hasMoreProducts = false;
  isProducts = false;
  isLoading = false; // <-- Add loading state
  searchSubject = new Subject<string>();

  sizes: SizeGroup[] = [];
  selectedSize: string = "0";
  selectedCategory: string | null = null;
  colors: ColorsGroup[] = [];
  selectedColors: string = "0";
  styles: StylesGroup[] = [];
  selectedStyles: string = "0";
  materials: MaterialGroup[] = [];
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

  constructor(private router: Router, private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: Object, private seoService: SeoService, private productService: ProductService,) { }

  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      // console.log("Flowbite loaded", flowbite);
    });
    this.getSizing();
    this.getColor();
    this.getStyle();
    this.getMaterial();
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary

    this.seoService.updateDescription('Product Search');
    this.seoService.updateTitle('Product Search - Kubona - Premium Italian Leather Shoes.');
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.getFilterProducts();
    });
  }

  selectedSizeClick(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSize = selectElement.value;
    // console.log("Selected Size:", this.selectedSize);
    this.getFilterProducts();
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

  viewProduct(productId: string) {
    this.router.navigate(["/product", productId]);
  }

  openAdvancedFilters() {
    this.advancedFilters = !this.advancedFilters;
  }
  getSizing() {
    forkJoin({
      men: this.productService.getSizingGroupBy("70610"),
      women: this.productService.getSizingGroupBy("70710"),
    }).subscribe({
      next: ({ men, women }) => {
        this.sizes = [...women, ...men].sort((a, b) => a.sizeCode - b.sizeCode);
      },
      error: (err) => console.error("There was an error!", err),
    });
  }

  getColor() {
    this.productService.getColorGroupBy("70000").subscribe({
      next: (res) => {
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
    this.getFilterProducts();
  }
  getStyle() {
    this.productService.getStyleGroupBy("70000").subscribe({
      next: (res) => {
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
    this.getFilterProducts();
  }
  getMaterial() {
    this.productService.geMaterialGroupBy("70000").subscribe({
      next: (res) => {
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
    this.getFilterProducts();
  }
  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSort = selectElement.value;
    this.getFilterProducts();
  }

  getFilterProducts() {
    this.urlId = `0-${this.selectedSize}-${this.selectedColors}-${this.selectedStyles}-${this.selectedMaterial}`;

    if (!this.searchQuery.trim()) {
      alert('Please type to search');
      return;
    }

    this.isLoading = true;

    this.productService.searchProduct(this.urlId, this.searchQuery).subscribe({
      next: (res) => {
        this.searchResults = res;
        this.loadProducts();
        this.isProducts = this.searchResults.length > 0;
      },
      error: (err) => console.error('There was an error!', err),
      complete: () => (this.isLoading = false),
    });
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
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
    if (isPlatformBrowser(this.platformId)) {
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
}
