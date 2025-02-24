import { Component,AfterViewInit, OnInit, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
declare var $: any;
import * as AOS from 'aos';
import 'aos/dist/aos.css';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { FlowbiteService } from '../flowbite.service';

@Component({
    selector: 'app-category',
    imports: [CommonModule, HttpClientModule],
    templateUrl: './sub-category.component.html',
    styleUrl: './sub-category.component.css'
})
export class SubCategoryComponent implements OnInit ,AfterViewInit {
  dataLoaded = false;
  // subCategoryId:any;
  products:any = [];
  categoryData:any = [];
  // subCategoryName:any;
  subCategoryId: string | null = null;
  subCategoryName: string | null = null;
  isCategoryLoading: boolean = true;
  selectedCategory: string | null = null;
  subCategories:any = [];

  constructor(private router: Router, private flowbiteService: FlowbiteService, private httpClient: HttpClient,private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object) {}

  selectedCategoryClick(categoryId: string,categoryName: string) {
    console.log(categoryId);
    this.selectedCategory = categoryId;
    // this.getFilterproducts();
    // this.router.navigate(['/sub-category', categoryId, categoryName]);
    this.router.navigate(['/sub-category', `${categoryId}-${categoryName}`]);
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product-details', productId]);
  }
  getproducts(){
    this.httpClient.get('https://friday.kubona.ng/api/Product/Products/' + this.subCategoryId).subscribe({
      next: (res) => {
        console.log(res);
        this.products = res;
        setTimeout(() => this.initializeCarousel(), 0);
      },
      error: (err) => {
        console.error('There was an error!', err);
      }
    });
  }
  getCategoryTitle(){
    this.httpClient.get('https://friday.kubona.ng/api/CategoryTitle/' + this.subCategoryId).subscribe({
      next: (res) => {
        console.log(res);
        this.categoryData = res;
      },
      error: (err) => {
        console.error('There was an error!', err);
      }
    });
  }
  initializeCarousel(){
    $('.owl-new-arrival-category').owlCarousel({
      loop: true,
      margin: 50,
      infinite: true,
      nav: false,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplaySpeed: 300,
      responsive: {
        0: {
          items: 1.2
        },
        600: {
          items: 2
        },
        1000: {
          items: 3.78
          // items: 1.2
        }
      }
    });
  }
  initializeStyleCarousel(){
    $('.owl-style').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      navText: [
        '<img src="assets/images/to-left.png" class="max-w-[35px]" alt="Prev">',
        '<img src="assets/images/to-right.png" class="max-w-[35px]" alt="Next">'
      ],
      responsive: {
        0: {
          items: 3.5
        },
        600: {
          items: 2
        },
        1000: {
          items: 4
        }
      }
    });
  }

  getSubCategories(){
    this.httpClient.get('https://friday.kubona.ng/api/DepartmentGroupBy?urlId=70610').subscribe({
      next: (res) => {
//        console.log(res);
        this.subCategories = res;
        this.isCategoryLoading = false;
        setTimeout(() => this.initializeCarousel(), 0);
      },
      error: (err) => {
        console.error('There was an error!', err);
      }
    });
  }
  ngOnInit() {
    // this.subCategoryId = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe(params => {
      this.subCategoryId = params.get('id');
      this.subCategoryName = params.get('categoryname');
    });
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });
    this.getproducts();
    this.getCategoryTitle();

    
    
    
    
    
    
    // Simulate data fetching
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
    
  }

  

  ngAfterViewInit(): void {

    AOS.init({
      duration: 1200, // Adjust animation duration if needed
      once: false, // Whether animation should happen only once - while scrolling down
      mirror: false, // Whether elements should animate out while scrolling past them
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        AOS.refresh();
      }
    });
    
    
  }
 }
