import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newly-arrived',
  imports: [CommonModule],
  templateUrl: './newly-arrived.component.html',
  styleUrl: './newly-arrived.component.css'
})
export class NewlyArrivedComponent implements OnInit {
  menRelatedProducts: any = [];
  womenRelatedProducts: any = [];
  allSizes: any = [];
  allSizesWomen: any = [];
  selectedSize: string | null = null;
  selectedCategory: string = "";
  selectedColors: string = "";
  selectedStyles: string = "";
  selectedMaterial: string = "";
  searchQuery: string = "";
  selectedSort: string = "";

  constructor(private router: Router, private httpClient: HttpClient) { }
  ngOnInit(): void {
    this.get_men_related_products();
    this.get_women_related_products();
  }

  viewProduct(productId: number, productTitle: string) {
    this.router.navigate(["/product-details", productTitle]);
  }

  selectedSizeClick(sizeCode: string) {
    console.log(sizeCode);
    this.selectedSize = sizeCode;
    this.getFilterproducts();
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
  }
  extractSizeNumber(sizeDesc: string): string {
    const match = sizeDesc.match(/\d+/); // Match only the numbers
    return match ? match[0] : sizeDesc; // Return the matched number or original if none
  }

  get_men_related_products() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Product/Products/70610?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=8"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.menRelatedProducts = res; //.slice(0, 3);
          setTimeout(() => this.initializeCarousel5(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }
  get_women_related_products() {
    this.httpClient
      .get(
        "https://friday.kubona.ng/api/Product/Products/70710?lowerPrice=0&upperPrice=0&sortId=7&pageIndex=0&pageSize=8"
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.womenRelatedProducts = res;
          setTimeout(() => this.initializeCarousel6(), 0);
        },
        error: (err) => {
          console.error("There was an error!", err);
        },
      });
  }

  initializeCarousel5() {
    $(".owl-new-arrival").owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplaySpeed: 500,
      nav: true,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 2,
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
  initializeCarousel6() {
    $(".owl-new-arrival2").owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplaySpeed: 500,
      nav: true,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">',
      ],
      responsive: {
        0: {
          items: 2,
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

}