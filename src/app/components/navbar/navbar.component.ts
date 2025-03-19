import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../to_be_deleted/category.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isMenuOpen = false;
  isMobileMenuOpen = false;
  isMenDropdownOpen = false;
  isWomenDropdownOpen = false;
  isMenDropdownOpenMobile = false;
  isWomenDropdownOpenMobile = false;

  mnCategories: any[] = [];
  wnCategories: any[] = [];
  asCategories: any[] = [];
  waCategories: any[] = [];
  bsCategories: any[] = [];
  haCategories: any[] = [];

  cartItemCount: number = 0;

  constructor(private categoryService: CategoryService, private router: Router, private cartService: CartService, private productService: ProductService) { }
  ngOnInit(): void {

    forkJoin({
      mnCategories: this.productService.getDepartmentGroupBy('70610'),
      wnCategories: this.productService.getDepartmentGroupBy('70710'),
      asCategories: this.productService.getDepartmentGroupBy('70340'),
      waCategories: this.productService.getDepartmentGroupBy('70510'),
      bsCategories: this.productService.getDepartmentGroupBy('70220'),
      haCategories: this.productService.getDepartmentGroupBy('70010'),
    }).subscribe({
      next: ({ mnCategories, wnCategories, asCategories, waCategories, bsCategories, haCategories }) => {
        this.mnCategories = mnCategories;
        this.wnCategories = wnCategories;
        this.asCategories = asCategories;
        this.waCategories = waCategories;
        this.bsCategories = bsCategories;
        this.haCategories = haCategories;
      },
      error: (err) => console.error("There was an error!", err),
    });
    this.getCartItemCount();
  }

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

  navigateToMen(id?: string, categoryName?: string, destinationUrl?: string) {
    this.toggleDropdown("menDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    if (id) {
      this.categoryService.setCategoryId(id);
      const slug = categoryName
        ? categoryName.toLowerCase().replace(/\s+/g, "-")
        : null;
      this.router.navigate(["category", destinationUrl]); // Navigate with 'id'
    } else {
      this.router.navigate(["/men"]); // Navigate without 'id'
    }
  }

  navigateToMenNewArrivals() {
    this.toggleDropdown("menDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/men/new-arrivals");
    this.router.navigate(['/category', '70610', '7'])
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

  navigateToWomen(id?: string, categoryName?: string, destinationUrl?: string) {
    this.toggleDropdown("womenDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    if (id) {
      this.categoryService.setCategoryId(id);
      const slug = categoryName
        ? categoryName.toLowerCase().replace(/\s+/g, "-")
        : null;
      this.router.navigate(["/category", destinationUrl]); // Navigate with 'id'
    } else {
      this.router.navigate(["/category", "70710-Women-Shoes"]); // Navigate without 'id'
    }
  }

  navigateToAccessories() {
    this.router.navigate(["/category", "70340-Accessories"]);
  }

  navigateToAcc() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/accessories"]);
  }

  navigateToCart() {
    this.isMenuOpen = false; // Close the menu on selection
    this.router.navigate(["/cart"]);
  }

  getCartItemCount(): void {
    this.cartService.getCartItems().subscribe({
      next: (cartItems: any[]) => {
        this.cartItemCount = cartItems.length;
      },
      error: (err) => {
        console.error("Error fetching cart items:", err); // Debugging
      },
    });
  }

}
