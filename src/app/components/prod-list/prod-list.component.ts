import { Component, AfterViewInit, OnInit, HostListener, Inject, PLATFORM_ID, afterNextRender, } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { ActivatedRoute, NavigationEnd, ParamMap, Router, RouterModule } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Meta, Title } from "@angular/platform-browser";
import { filter, switchMap } from "rxjs/operators";
import { CategoryService } from "../../services/category.service";
import { FlowbiteService } from "../../services/flowbite.service";
import { ProductService } from "../../services/product.service";
import { ColorsGroup, HeelHeightGroup, MaterialGroup, Prodlist, SizeGroup, StylesGroup } from "../../models/models";

@Component({
  selector: 'app-prod-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule,],
  templateUrl: './prod-list.component.html',
  styleUrl: './prod-list.component.css'
})
export class ProdListComponent implements OnInit, AfterViewInit {
  dataLoaded = false;

  isCategoryLoading: boolean = true;
  isSizeLoading: boolean = true;
  isProductLoading: boolean = true;

  products: any[] = []; // Store the products
  hasMoreProducts: boolean = true; // Assume more products are available initially
  isLoading: boolean = false; // Prevent multiple API calls at once
  page: number = 1;
  isLoadingMore = false;
  subCategories: any[] = [];
  sizes: SizeGroup[] = [];
  selectedSize: string | null = "All";
  selectedCategory: string | null = "";
  colors: ColorsGroup[] = [];
  selectedColors: string = "0";
  styles: StylesGroup[] = [];
  selectedStyles: string = "0";
  materials: MaterialGroup[] = [];
  heels:HeelHeightGroup[]=[];
  selectedMaterial: string = "0";
  hasCategoryId: boolean = false;
  sorts: any = [
    {
      sortId: "2",
      sortName: "HIGH PRICE",
    },
    {
      sortId: "3",
      sortName: "LOW PRICE",
    },
    {
      sortId: "5",
      sortName: "TITLE",
    },
    {
      sortId: "0",
      sortName: "POPULAR",
    },
    {
      sortId: "7",
      sortName: "NEWEST",
    },
    {
      sortId: "4",
      sortName: "RANDOMLY",
    },
  ];
  selectedSort: string = "0";

  isFilterOpen: boolean = false;
  displayedProducts: Prodlist[] = [];
  prodlistsArr: Prodlist[] = [];
  productsPerPage = 12;
  currentPage = 1;
  isMobileView: boolean = false;

  isProducts = false;

  searchQuery: any;
  unavailableSizes: Set<number> = new Set();

  //productList
  deptId: number = 0;
  lowerPrice: number = 0;
  upperPrice: number = 0;
  sortId: number = 0;
  pageIndex: number = 1;
  pageSize: number = 30;
  grandSize: number = 2000;
  arrayLength: number = 0;
  urlId: string = '';



  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private http: HttpClient,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private categoryService: CategoryService,
    private flowbiteService: FlowbiteService,
    private productService: ProductService,
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

  viewProduct(productId: string) {
    this.router.navigate(["/product", productId]);
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

  selectedSizeClick(sizeCode: string) {
    if (sizeCode !== "All") {
      this.selectedSize = sizeCode;
      this.getFilterproducts();
    } else {
      this.getproducts();
    }
  }
  checkViewport(): void {
    this.isMobileView = window.innerWidth <= 768; // Adjust this value for mobile breakpoint
  }

  get isMobile(): boolean {
    return window.innerWidth < 768;
  }


  getSizing() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const catId = params.get("categoryId") ?? "";
        return this.productService.getSizingGroupBy(catId);
      })
    ).subscribe(response => {
      this.sizes = response;
      this.isSizeLoading = false;
      setTimeout(() => this.initializeCarousel2(), 0);
    });
  }

  getColor() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const catId = params.get("categoryId") ?? "";
        return this.productService.getColorGroupBy(catId);
      })
    ).subscribe(response => {
      this.colors = response;;
    });
  }
  onChange(event: Event) {
    let x =event.target as HTMLSelectElement;
    let destinationUrl = x.value;
      this.router.navigate(["/category", destinationUrl]).then(() => { });
    
  }

  getStyle() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const catId = params.get("categoryId") ?? "";
        return this.productService.getStyleGroupBy(catId);
      })
    ).subscribe(response => {
      this.styles = response;;
    });
  }
  getMaterial() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const catId = params.get("categoryId") ?? "";
        return this.productService.geMaterialGroupBy(catId);
      })
    ).subscribe(response => {
      this.materials = response;;
    });
  }
  
  getHeelHeight(){
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const catId = params.get("categoryId") ?? "";
        return this.productService.getHeelGroupBy(catId);
      })
    ).subscribe(response => {
      this.heels = response;
    });
  }

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSort = selectElement.value;
    this.router.navigate(['/category', this.urlId, this.selectedSort]);
  }

  getProductList() {
    this.isProductLoading = true;
    this.isProducts = false;
    this.route.paramMap.pipe(switchMap((params: ParamMap) =>
      this.productService.getProducts(params.get("categoryId") || "70000", 0, 0, Number(params.get("sortId")), 0, this.grandSize)
    )).subscribe((response) => {
      if (response.length > 0) {
        this.prodlistsArr = response;
            this.arrayLength = this.prodlistsArr.length > this.pageSize ? this.pageSize : this.prodlistsArr.length;
            this.isLoadingMore = this.prodlistsArr.length > this.pageSize ? true : false;
            this.pageIndex = 0;
            this.displayedProducts = this.prodlistsArr.splice(this.pageIndex, this.arrayLength);
            this.isProductLoading = false;
            this.isProducts = this.displayedProducts.length > 0;
      }
    });
  }

  getproducts() {
    this.isProductLoading = true;
    this.isProducts = false;

    const searchQuery = this.constructQuery();

    const API_URL = `https://friday.kubona.ng/api/Product/Products/${searchQuery}?pageIndex=${this.page}`;

    this.httpClient.get<any[]>(API_URL).subscribe({
      next: (res) => {
        console.log("Products", res);
        this.products = res;
        this.displayedProducts = res;
        this.isProducts = this.products.length > 0;
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
      },
    });
  }

  getproductsBySizes(sizeId: any) {
    this.isProductLoading = true;
    this.selectedSize = sizeId === "All" ? null : sizeId;
    this.getFilterproducts();
  }

  filterProductsForSizes(destinationUrl: string) {
    if (destinationUrl == "All") {
      this.selectedSize = destinationUrl;
      this.getproducts();
    } else {
      this.router.navigate(['category', destinationUrl]);
    }
  }

  getFilterproducts() {
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
      this.selectedCategory == null ||
      this.selectedCategory == "" ||
      this.selectedCategory == undefined
    ) {
      this.selectedCategory = "70610";
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
    console.log("query" + this.searchQuery);

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
          this.isProductLoading = false;
        },
        error: (err) => {
          console.error("There was an error!", err);
          this.isProductLoading = false;
        },
      });
  }

  loadMore() {
if(this.displayedProducts&&!this.isLoading){
  this.isLoading = true;
  let big = this.prodlistsArr.splice(0, this.pageSize);
    if (big.length > 0) {
      let Arr = this.displayedProducts.concat(big);
      this.displayedProducts = Arr;
    }
    this.isLoading = false;
    this.isLoadingMore = false;
}

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

  navigateToCategory(destinationUrl?: string) {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/category", destinationUrl]);
      this.getSubCategoryList();
      $('.owl-style').trigger('refresh.owl.carousel');    });
    
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
    this.getSubCategoryList();
    this.getProductList();
    this.getSizing();
    this.getColor();
    this.getStyle();
    this.getMaterial();
    this.getHeelHeight();
    this.isMobileView = window.innerWidth < 768; // Adjust the breakpoint as needed
    window.addEventListener("resize", () => {
      this.isMobileView = window.innerWidth < 768;
    });


    this.route.paramMap.subscribe((params) => {
      const slug = params.get("slug");
      const id = this.categoryService.getCategoryId();
      if (slug && id) {
        this.hasCategoryId = true;
        const formattedTitle = `Men's Collection - ${this.formatSlug(slug)}`;
        this.titleService.setTitle(formattedTitle);
        this.metaService.updateTag({
          name: "description",
          content: `Explore men's collection for ${this.formatSlug(
            slug
          )} and find the perfect items.`,
        });
      } else {
        this.hasCategoryId = false; // If no 'id' is found, set 'hasId' to false
        // this.getproducts();
        this.getProductList();
        const formattedTitle = `Men's Collection`;
        this.titleService.setTitle(formattedTitle);
        this.metaService.updateTag({
          name: "description",
          content: `Explore men's collection and find the perfect items.`,
        });
      }
    });
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
  }

  formatSlug(slug: string): string {
    // Convert slug to a user-friendly format (e.g., replace hyphens with spaces and capitalize)
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  getSubCategoryList() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const catId = params.get("categoryId") ?? "";
        this.urlId = catId;
        return this.productService.getDepartmentGroupBy(catId);
      })
    ).subscribe(response => {
      this.subCategories = response.filter(x => x.imageUrl);
      console.log("subCategories", this.subCategories);
      this.isCategoryLoading = false;
      setTimeout(() => this.initializeCarousel(), 0);
    });
  }

}

