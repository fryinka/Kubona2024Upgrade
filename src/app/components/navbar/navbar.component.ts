import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../cart.service';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isMenuOpen = false;
  isMobileMenuOpen = false;
  isMenDropdownOpen = false;
  isWomenDropdownOpen = false;
  isMenDropdownOpenMobile = false;
  isWomenDropdownOpenMobile = false;

  subCategories: any = {
    men: {},
    women: {},
  };

  cartItemCount: number = 0;

  constructor(private categoryService: CategoryService, private router: Router, private cartService: CartService) { }

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
      this.router.navigate(["/men/category", destinationUrl]); // Navigate with 'id'
    } else {
      this.router.navigate(["/men"]); // Navigate without 'id'
    }
  }

  navigateToMenNewArrivals() {
    this.toggleDropdown("menDropdown");
    this.isMenuOpen = false; // Close the menu on selection
    this.navigateTo("/men/new-arrivals");
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

}
