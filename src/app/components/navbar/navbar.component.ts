import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { forkJoin } from 'rxjs';
import { DepartmentGroup } from '../../models/models';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isMenuOpen = false;
  activeDropdown: string | null = null;

  mnCategories: DepartmentGroup[] = [];
  wnCategories: DepartmentGroup[] = [];
  asCategories: DepartmentGroup[] = [];
  waCategories: DepartmentGroup[] = [];
  bsCategories: DepartmentGroup[] = [];
  haCategories: DepartmentGroup[] = [];

  cartItemCount: number = 0;

  constructor(private router: Router, private cartService: CartService, private productService: ProductService,
    private googleService: GoogleAnalyticsService
  ) { }
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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isMenuOpen = false;
        this.activeDropdown = null;
      }
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.closeDropdowns();
    }
  }

  toggleDropdown(menu: string) {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  closeDropdowns() {
    this.activeDropdown = null;
    this.isMenuOpen = false;
  }

  navigateToMen(destinationUrl: string, description: string) {
    this.router.navigate(["category", destinationUrl]).then(() => this.closeMenu());
    this.googleService.menubarEventEmitter("menu_bar", "menu_links", description);
  }

  navigateToMenNewArrivals(destinationUrl: string, description: string) {
    this.router.navigate(['/category', destinationUrl, '7']).then(() => this.closeMenu());
    this.googleService.menubarEventEmitter("menu_bar", "menu_links", description);
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.activeDropdown = null;
  }

  navigateToCart() {
    this.router.navigate(["/cart"]).then(() => this.closeMenu());;
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
