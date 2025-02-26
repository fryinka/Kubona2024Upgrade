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
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Util } from "../util/util.component";
import { FlowbiteService } from "../services/flowbite.service";

@Component({
    selector: "app-category",
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./products.component.html",
    styleUrl: "./products.component.css"
})
export class ProductsComponent implements AfterViewInit {
  caller: string | null = null;
  page: number = 1;
  isLoadingMore = false;
  departmentId: string | null = null;
  sizeId: string | null = null;
  colorId: string | null = null;
  styleId: string | null = null;
  materialId: string | null = null;

  recommendedProducts: any[] = []; // Adjust type as needed

  products: any = [];
  searchQuery: any;
  categoryData: any = [];

  dataLoaded = false;

  isCategoryLoading: boolean = true;
  isSizeLoading: boolean = true;
  isLoading: boolean = false;
  isProductLoading: boolean = true;

  subCategoriesMenSize: any = [];
  subCategories: any = [];
  sizes: any = [];
  selectedSize: string | null = null;
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

  displayedProducts: any[] = [];
  productsPerPage = 12;
  currentPage = 1;
  hasMoreProducts = false;
  isProducts = false;
  allStyles: any = [];
  crouselData: any = [];

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private util: Util,
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.caller = params["caller"];
      console.log(this.caller); // This will log "style"
    });

    // this.subCategoryId = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe((params) => {
      this.departmentId = params.get("departmentId");
      this.styleId = params.get("styleId");
      this.colorId = params.get("colorId");
      this.sizeId = params.get("sizeId");
      this.materialId = params.get("materialId");
    });

    this.searchQuery =
      this.departmentId +
      "-" +
      this.sizeId +
      "-" +
      this.colorId +
      "-" +
      this.styleId +
      "-" +
      this.materialId;

    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });
    this.get_styles();
    this.getSubCategoriesMenSize();
    this.getProducts();
    this.getCategoryTitle();
    this.getSizing();
    this.getColor();
    this.getStyle();
    this.getMaterial();
    this.getCrouselData(this.caller);
    setTimeout(() => {
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
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

  selectedSizeClick(sizeCode: string) {
    console.log(sizeCode);
    this.selectedSize = sizeCode;
    this.getFilterproducts();
  }

  getCrouselData(caller: any = "featured") {
    console.log("Carousel Caller: " + caller);

    this.util.getProductPageCategories(caller, this.httpClient).subscribe({
      next: (res) => {
        console.log("Categories");
        console.log(res);

        if (caller === "style") {
          // Transform the API response to the desired structure
          this.crouselData = res.map(
            (item: {
              styleId: any;
              styleDesc: any;
              styleImageUrl: any;
              totalcount: any;
              destinationUrl: any;
            }) => ({
              id: item.styleId, // Change styleId to id
              title: item.styleDesc, // Change styleDesc to description
              imageUrl: item.styleImageUrl, // Change styleImageUrl to imageUrl
              count: item.totalcount, // Change totalcount to count
              url: item.destinationUrl, // Change destinationUrl to url
            })
          );
          console.log("style data after mapping: " + this.crouselData);
        } else if (caller === "sizemen" || caller === "sizewomen") {
          // Transform the API response to the desired structure
          this.crouselData = res.map(
            (item: {
              departmentId: any;
              description: any;
              imageUrl: any;
              totalCount: any;
              destinationUrl: any;
            }) => ({
              id: item.departmentId, // Change departmentId to id
              title: item.description, // Change description to title
              imageUrl: item.imageUrl || "", // Keep imageUrl as it is, default to empty string if null
              count: item.totalCount, // Change totalCount to count
              url: item.destinationUrl, // Change destinationUrl to url
            })
          );

          console.log("other data after mapping: " + this.crouselData);
        } else if (caller === "featured") {
          // Transform the API response to the desired structure
          this.crouselData = res.map(
            (item: {
              routeId: any;
              imageTitle: any;
              summary: any;
              imageurl: any;
              totalCount: any;
              routeUrl: any;
            }) => ({
              id: item.routeId, // Change departmentId to id
              title: item.imageTitle, // Change description to title
              summary: item.summary,
              imageUrl: item.imageurl || "", // Keep imageUrl as it is, default to empty string if null
              count: item.totalCount, // Change totalCount to count
              url: item.routeUrl, // Change destinationUrl to url
            })
          );
        }

        for (let i = this.crouselData.length - 1; i >= 0; i--) {
          if (!this.crouselData[i].imageUrl) {
            this.crouselData.splice(i, 1); // Remove the item if imageUrl is null or undefined
          }
        }

        console.log(res);

        setTimeout(() => this.initializeCarousel1(), 0);
      },
      error: (err) => {
        console.error("There was an error!", err);
      },
    });
  }

  getSizes(sizeDesc: string | null): string[] {
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

  getClickData(
    id: string = "",
    title: string = "",
    imageUrl: string = "",
    count: string = "",
    url: string = ""
  ) {
    if (this.caller === undefined) {
      this.caller = "featured";
    }

    switch (this.caller) {
      case "style":
        this.getSelectedProducts(url);
        // this.selectedCategoryMenClick(id,title)
        break;
      case "sizemen":
        // this.selectedCategoryMenClick(id,title)
        this.getSelectedProducts(url);
        break;
      case "sizewomen":
        //  this.selectedCategoryWomenClick(id, title)
        this.getSelectedProducts(url);
        break;
      case "featured":
        this.getSelectedProducts(id);
        break;
      default:
      // Example API for sizewomen
    }
  }

  get_styles() {
    this.httpClient
      .get("https://friday.kubona.ng/api/StylesGroupBy/" + this.departmentId)
      .subscribe({
        next: (res) => {
          console.log("All styles products");
          console.log(res);
          this.allStyles = res;

          for (let i = this.allStyles.length - 1; i >= 0; i--) {
            if (!this.allStyles[i].styleImageUrl) {
              this.allStyles.splice(i, 1); // Remove the item if imageUrl is null or undefined
            }
          }
          console.log(this.allStyles);

          setTimeout(() => this.initializeCarousel1(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  getSubCategories(): void {
    this.util
      .fetchDataFromApi(
        this.httpClient,
        "https://friday.kubona.ng/api/DepartmentGroupBy?urlId=" +
          this.departmentId
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.subCategories = res;
          this.isCategoryLoading = false;
          setTimeout(() => this.initializeCarousel(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
          this.isCategoryLoading = false;
        },
      });
  }

  getSubCategoriesMenSize() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/DepartmentGroupBy?urlId=" +
          this.departmentId
      )
      .subscribe({
        next: (res) => {
          //        console.log(res);
          this.subCategoriesMenSize = res;
          for (let i = this.subCategoriesMenSize.length - 1; i >= 0; i--) {
            if (!this.subCategoriesMenSize[i].imageUrl) {
              this.subCategoriesMenSize.splice(i, 1); // Remove the item if imageUrl is null or undefined
            }
          }

          console.log(this.subCategoriesMenSize);
          this.isCategoryLoading = false;
          setTimeout(() => this.initializeCarousel3(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  getSizing() {
    this.httpClient
      .get("https://friday.kubona.ng/api/SizingGroupBy/" + this.departmentId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.sizes = res;
          this.isSizeLoading = false;
        },
        error: (err) => {
          console.error("There was an error!", err);
          this.isSizeLoading = false;
        },
      });
  }
  getColor() {
    this.httpClient
      .get("https://friday.kubona.ng/api/ColorsGroupBy/" + this.departmentId)
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
      .get("https://friday.kubona.ng/api/StylesGroupBy/" + this.departmentId)
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

  filterProductsForSizes(sizeId: any) {
    if (sizeId == "All") {
      this.selectedSize = sizeId;
      this.getProducts();
    } else {
      this.getproductsBySizes(sizeId);
    }
  }

  getproductsBySizes(sizeId: any) {
    this.selectedSize = sizeId === "All" ? null : sizeId;
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
      .get("https://friday.kubona.ng/api/MaterialGroupBy/" + this.departmentId)
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

  getCategoryTitle() {
    this.httpClient
      .get("https://friday.kubona.ng/api/CategoryTitle/" + this.departmentId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.categoryData = res;
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  getCaller() {
    return this.caller;
  }

  getProducts() {
    this.httpClient
      .get<any[]>(
        "https://friday.kubona.ng/api/Product/Products/" +
          this.searchQuery +
          `?pageIndex=${this.page}`
      )
      .subscribe({
        next: (res) => {
          this.products = res;
          this.displayedProducts = res;
          if (this.products.length > 0) {
            this.isProducts = true;
            this.page++;
            this.hasMoreProducts = true;
          } else {
            this.hasMoreProducts = false;
          }

          this.isProductLoading = false;
        },
        error: (err) => {
          console.error("There was an error!", err);
          this.isProductLoading = false;
        },
      });
  }

  getSelectedProducts(destinationUrl: string) {
    this.httpClient
      .get<any[]>(
        "https://friday.kubona.ng/api/Product/Products/" + destinationUrl
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
      this.selectedCategory = this.departmentId;
    }

    this.searchQuery =
      this.selectedCategory?.split("-")[0] +
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
          this.products = res;
          this.displayedProducts = res;
          this.isProducts = this.products.length > 0;
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
      this.httpClient.get(API_URL).subscribe(
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

  initializeCarousel() {
    $(".owl-new-arrival-category").owlCarousel({
      loop: false,
      margin: 20,
      infinite: false,
      nav: false,
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

  initializeCarousel3() {
    $(".owl-sizemen").owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplaySpeed: 500,
      navText: [
        // '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        // '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">'
      ],
      responsive: {
        0: {
          items: 1.4,
          margin: 10,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 5,
          margin: 20,
        },
      },
    });
  }

  initializeCarousel1() {
    $(".owl-style").owlCarousel({
      loop: true,

      nav: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplaySpeed: 500,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      // responsive: {
      //   0: {
      //     items: 1.4,
      //     margin: 10,
      //   },
      //   600: {
      //     items: 2,
      //   },
      //   1000: {
      //     items: 5,
      //     margin: 20,
      //   },
      // },
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

  // selectedCategoryMenClick(categoryId: string, categoryName: string) {
  //   console.log(categoryId);
  //   this.selectedCategory = categoryId;
  //   this.getFilterproducts();
  //   // this.router.navigate(['/sub-category', categoryId, categoryName]);
  //   // this.router.navigate(['/sub-category', `${categoryId}-${categoryName}`]);
  // }

  viewShopByDepartments(routeId: number) {
    console.log(routeId);
    this.router.navigate(["/products", routeId, 0, 0, 0, 0]);
  }

  viewProduct(productId: number) {
    this.router.navigate(["/product-details", productId]);
  }

  ngAfterViewInit(): void {
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
