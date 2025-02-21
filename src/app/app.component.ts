import { Component, OnInit } from "@angular/core";
import { NavigationEnd, RouterOutlet } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, } from "@angular/forms"; // Import ReactiveFormsModule
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ScrollService } from "./scroll.service";
import { RouterModule } from "@angular/router";
import { CartService } from "./cart.service";
import { CategoryService } from "./services/category.service";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule, FooterComponent, NavbarComponent], // Include ReactiveFormsModule
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
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
    // this.isMenDropdownOpen = false;
    // this.isWomenDropdownOpen = false;
    this.isMenuOpen = false; // Close the menu on selection
    // Your navigation logic
    this.router.navigate([url]);
    //this.isMenuOpen = false; // Close the menu after navigation
    console.log("Navigating to", url);
  }

  menNewArrivals: any[] = [];
  menAccessories: any[] = [];
  womenNewArrivals: any[] = [];
  womenAccessories: any[] = [];
  menShoes: any[] = []; // Define menShoes
  womenShoes: any[] = []; // Define womenShoes

  loadMenNewArrivals(): void {
    //const apiUrl = 'https://friday.kubona.ng/api/Product/Products/70610?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=30';
    //this.http.get<any>(apiUrl).subscribe(
    // data => {
    //  console.log(data); // Inspect the data structure
    //  this.menNewArrivals = data.products;
    // },
    //error => {
    // console.error('Error loading men new arrivals:', error);
    //}
    //);

    this.http
      .get<any[]>(
        `https://friday.kubona.ng/api/Product/Products/70610?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=5`
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

  loadProducts() {
    if (Array.isArray(this.products)) {
      this.menNewArrivals = this.products.slice(
        0,
        this.currentPage * this.productsPerPage
      );
      this.hasMoreProducts = this.products.length > this.menNewArrivals.length;
    } else {
      console.error("Fetched data is not an array:", this.products);
    }
  }

  getSubCategories(urlId: number, category: string): void {
    const url = `https://friday.kubona.ng/api/DepartmentGroupBy?urlId=${urlId}`;

    this.http.get(url).subscribe({
      next: (res) => {
        // Assign the response to the respective category in subCategories
        this.subCategories[category] = res;

        // Filter out items without imageUrl
        this.subCategories[category] = this.subCategories[category].filter(
          (item: any) => item.imageUrl
        );
        // Optionally, initialize carousel here
      },
      error: (err) => {
        console.error("There was an error!", err);
      },
    });
  }

  loadMenAccessories(): void {
    const apiUrl = "https://friday.kubona.ng/api/Product/Products/70610";
    const params = {
      lowerPrice: "0",
      upperPrice: "0",
      sortId: "7",
      pageIndex: "0",
      pageSize: "10",
    };

    this.http.get<any>(apiUrl, { params }).subscribe((data) => {
      this.menAccessories = data.products; // Adjust this if the structure is different
    });
  }

  loadWomenNewArrivals(): void {
    const apiUrl = "https://friday.kubona.ng/api/Product/Products/70610";
    const params = {
      lowerPrice: "0",
      upperPrice: "0",
      sortId: "7",
      pageIndex: "0",
      pageSize: "10",
    };

    this.http.get<any>(apiUrl, { params }).subscribe((data) => {
      this.womenNewArrivals = data.products; // Adjust this if the structure is different
    });
  }

  loadWomenAccessories(): void {
    const apiUrl = "https://friday.kubona.ng/api/Product/Products/70610";
    const params = {
      lowerPrice: "0",
      upperPrice: "0",
      sortId: "7",
      pageIndex: "0",
      pageSize: "10",
    };

    this.http.get<any>(apiUrl, { params }).subscribe((data) => {
      this.womenAccessories = data.products; // Adjust this if the structure is different
    });
  }

  loadMenShoes(): void {
    const apiUrl = "https://friday.kubona.ng/api/Product/Products/70610";
    const params = {
      lowerPrice: "0",
      upperPrice: "0",
      sortId: "7",
      pageIndex: "0",
      pageSize: "10",
    };

    this.http.get<any>(apiUrl, { params }).subscribe((data) => {
      this.menShoes = data.products; // Adjust this if the structure is different
    });
  }

  loadWomenShoes(): void {
    const apiUrl =
      "https://friday.kubona.ng/api/Product/Products/70610?lowerPrice=0&upperPrice=0&sortId=0&pageIndex=0&pageSize=30";
    const params = {
      lowerPrice: "0",
      upperPrice: "0",
      sortId: "7",
      pageIndex: "0",
      pageSize: "10",
    };

    this.http.get<any>(apiUrl, { params }).subscribe((data) => {
      this.womenShoes = data.products; // Adjust this if the structure is different
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
    private http: HttpClient,
    private cartService: CartService,
    private categoryService: CategoryService
  ) {
    this.newsletterForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.loadMenNewArrivals();
    this.loadMenAccessories();
    this.loadWomenNewArrivals();
    this.loadWomenAccessories();
    this.loadMenShoes(); // Add this call
    this.loadWomenShoes(); // Add this call
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollService.scrollToTop();
        this.isMenuOpen = false;
        this.womenOpen = false; // Close dropdown when navigating
        this.menOpen = false; // Optional: Close dropdown for Men
        this.getCartItemCount();
      }
    });
    this.getSubCategories(70660, "men"); // Men category
    this.getSubCategories(70750, "women"); // Women category
  }

  getCartItemCount(): void {
    this.cartService.getCartItems().subscribe({
      next: (cartItems: any[]) => {
        this.cartItemCount = cartItems.length;
        console.log("Cart item count:", this.cartItemCount); // Debugging
      },
      error: (err) => {
        console.error("Error fetching cart items:", err); // Debugging
      },
    });
  }

  onSubscribe() {
    if (this.newsletterForm.valid) {
      const email = this.newsletterForm.get("email")?.value;
      const formBody = { email: email };

      this.http
        .post("https://friday.kubona.ng/api/Contact/Subscribe/", formBody)
        .subscribe(
          (response) => {
            console.log(JSON.stringify(response));
            this.newsletterSuccess = true;
          },
          (error) => {
            console.error("Error submitting form", error);
            this.newsletterSuccess = false;
          }
        );
    } else {
      console.log("Form is not valid");
    }
  }

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
}
