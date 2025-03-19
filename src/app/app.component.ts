import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, RouterOutlet } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, } from "@angular/forms"; // Import ReactiveFormsModule
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ScrollService } from "./services/scroll.service";
import { RouterModule } from "@angular/router";
import { CartService } from "./services/cart.service";
import { CategoryService } from "./to_be_deleted/category.service";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SwUpdate, VersionEvent, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs/operators";
import { Prodlist } from "./models/models";
import { ProductService } from "./services/product.service";
import { forkJoin } from "rxjs";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, FormsModule, CommonModule, RouterModule, ReactiveFormsModule, FooterComponent, NavbarComponent,], // Include ReactiveFormsModule
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "kubona-app";
  newsletterForm: FormGroup;
  newsletterSuccess: any;
  isMenuOpen = false;
  subCategories: any = {
    men: {},
    women: {},
  };
  products: any;
  hasMoreProducts = false;
  productsPerPage = 12;
  currentPage = 1;
  isProducts = false;

  isMobileMenuOpen = false;
  isMenDropdownOpen = false;
  isWomenDropdownOpen = false;
  isMenDropdownOpenMobile = false;
  isWomenDropdownOpenMobile = false;
  private platformId = inject(PLATFORM_ID);
  private updates = inject(SwUpdate);

  menNewArrivals: Prodlist[] = [];
  menAccessories: Prodlist[] = [];
  womenNewArrivals: Prodlist[] = [];
  womenAccessories: Prodlist[] = [];
  menShoes: Prodlist[] = []; // Define menShoes
  womenShoes: Prodlist[] = []; // Define womenShoes

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  closeDropdown() {
    this.isMenDropdownOpen = false;
    this.isWomenDropdownOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isMenDropdownOpen = false;
      this.isWomenDropdownOpen = false;
    }
  }

  toggleDropdown(menu: string) {
    if (menu === "menDropdown") {
      this.isMenDropdownOpen = !this.isMenDropdownOpen;
      if (this.isMenDropdownOpen) {
        this.isWomenDropdownOpen = false;
      }
    } else if (menu === "womenDropdown") {
      this.isWomenDropdownOpen = !this.isWomenDropdownOpen;
      if (this.isWomenDropdownOpen) {
        this.isMenDropdownOpen = false;
      }
    }
  }

  collapseMenu(menu: string): void {
    if (menu === "menDropdown") {
      this.isMenDropdownOpen = false;
    } else if (menu === "womenDropdown") {
      this.isWomenDropdownOpen = false;
    }
  }

  navigateTo(url: string): void {
    this.isMenuOpen = false; // Close the menu on selection
    // Your navigation logic
    this.router.navigate([url]);
  }

 

  loadNewArrivals(): void {

    forkJoin({
      men: this.productService.getProducts("70610",0,0,7,0,8),
      women: this.productService.getProducts("70710",0,0,7,0,8),
      // accessories: this.productService.getProducts("70460",0,0,7,0,8),
    }).subscribe({
      next: ({ men, women }) => {
        this.menNewArrivals=men;
        this.womenNewArrivals=women;  
            },
      error: (err) => console.error("There was an error!", err),
    });
  
  }

  

  menOpen = false;
  womenOpen = false;

  isSubMenuOpen: string | null = null;

  toggleSubMenu(menu: string) {
    this.isSubMenuOpen = this.isSubMenuOpen === menu ? null : menu;
  }

  toggleWomenMenu() {
    this.womenOpen = !this.womenOpen;
  }

  isDropdownOpen: { [key: string]: boolean } = { men: false, women: false };

  toggleMenus() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  showDropdown(department: string) {
    this.isDropdownOpen[department] = true;
  }

  hideDropdown(department: string) {
    this.isDropdownOpen[department] = false;
  }

  cartItemCount: number = 0;

  navLinks = [
    { label: "Men", url: "/men" },
    { label: "Women", url: "/women" },
    { label: "Accessories", url: "/accessories" },
    { label: "About Us", url: "/about-us" },
    { label: "Contact Us", url: "/contact-us" },
    { label: "FAQs", url: "/faqs" },
    { label: "New Arrivals", url: "/new-arrivals" },
    { label: "Clothing", url: "/clothing" },
    { label: "Shoes", url: "/shoes" },
  ];

  constructor(
    private router: Router,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private cartService: CartService,
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {
    this.newsletterForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
    if (isPlatformBrowser(this.platformId)) {
      this.checkForUpdates();
    }
  }

  ngOnInit() {
    this.loadNewArrivals();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollService.scrollToTop();
        this.isMenuOpen = false;
        this.womenOpen = false; // Close dropdown when navigating
        this.menOpen = false; // Optional: Close dropdown for Men
        this.getCartItemCount();
      }
    });
  }

  getCartItemCount(): void {
    this.cartService.getCartItems().subscribe({
      next: (cartItems: any[]) => {
        this.cartItemCount = cartItems.length;
        // console.log("Cart item count:", this.cartItemCount); // Debugging
      },
      error: (err) => {
        console.error("Error fetching cart items:", err); // Debugging
      },
    });
  }

  // onSubscribe() {
  //   if (this.newsletterForm.valid) {
  //     const email = this.newsletterForm.get("email")?.value;
  //     const formBody = { email: email };

  //     this.http
  //       .post("https://friday.kubona.ng/api/Contact/Subscribe/", formBody)
  //       .subscribe(
  //         (response) => {
  //           console.log(JSON.stringify(response));
  //           this.newsletterSuccess = true;
  //         },
  //         (error) => {
  //           console.error("Error submitting form", error);
  //           this.newsletterSuccess = false;
  //         }
  //       );
  //   } else {
  //     console.log("Form is not valid");
  //   }
  // }

  goToHome() {
    // this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/"]);
  }

  navigateToSearch() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/search"]);
  }

  navigateToMen(id?: string, categoryName?: string, destinationUrl?: string) {
    this.toggleDropdown("menDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    if (id) {
      this.categoryService.setCategoryId(id);
      const slug = categoryName
        ? categoryName.toLowerCase().replace(/\s+/g, "-")
        : null;
      this.router.navigate(["/men/category", destinationUrl]); // Navigate with 'id'
    } else {
      this.router.navigate(["/men"]); // Navigate without 'id'
    }
  }

  navigateToWomen(id?: string, categoryName?: string, destinationUrl?: string) {
    this.toggleDropdown("womenDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    if (id) {
      this.categoryService.setCategoryId(id);
      const slug = categoryName
        ? categoryName.toLowerCase().replace(/\s+/g, "-")
        : null;
      this.router.navigate(["/women/category", destinationUrl]); // Navigate with 'id'
    } else {
      this.router.navigate(["/women"]); // Navigate without 'id'
    }
  }

  navigateToAccessories() {
    this.router.navigate(["/products/70460-women-necklaces/0/0/0/0"]);
  }

  navigateToAcc() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/accessories"]);
  }

  navigateToCart() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/cart"]);
  }

  navigateToProducts() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/products"]);
  }

  navigateToCategory() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/category"]);
  }

  navigateToPrivacyPolicy() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/privacy-policy"]);
  }

  navigateToTermsAndConditions() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/terms-and-conditions"]);
  }

  navigateToRE() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/returns-and-exchange"]);
  }

  navigateToPOptions() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/payment-options"]);
  }

  navigateToDI() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/delivery-info"]);
  }

  navigateToPO() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/how-to-place-order"]);
  }

  navigateToCS() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/how-to-check-your-size"]);
  }

  navigateToVac() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/vacancies"]);
  }

  navigateToMenNewArrivals() {
    this.toggleDropdown("menDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/men/new-arrivals");
  }

  navigateToMenShoes() {
    this.toggleDropdown("menDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/men/shoes");
  }

  navigateToMenAccessories() {
    this.toggleDropdown("menDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/men/accessories");
  }

  navigateToWomenNewArrivals() {
    this.toggleDropdown("womenDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/women/new-arrivals");
  }

  navigateToWomenShoes() {
    this.toggleDropdown("womenDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/women/shoes");
  }

  navigateToWomenAccessories() {
    this.toggleDropdown("womenDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/women/accessories");
  }

  navigateToAboutUs() {
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/about-us");
  }

  navigateToContactUs() {
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/contact-us");
  }

  navigateToFaqs() {
    // this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/faqs");
  }

  private checkForUpdates() {
    this.updates.versionUpdates
      .pipe(filter((event: VersionEvent): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        if (confirm('New version available. Load new version?')) {
          window.location.reload();
        }
      });
  }
}
