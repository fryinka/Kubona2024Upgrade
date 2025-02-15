import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { SearchComponent } from "./search/search.component";
import { ProductsComponent } from "./products/products.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { CategoryComponent } from "./category/category.component";
import { AddToCartComponent } from "./add-to-cart/add-to-cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { FaqsComponent } from "./faqs/faqs.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { DeliveryInfoComponent } from "./delivery-info/delivery-info.component";
import { PaymentOptionsComponent } from "./payment-options/payment-options.component";
import { HowToCheckYourSizeComponent } from "./how-to-check-your-size/how-to-check-your-size.component";
import { HowToPlaceAnOrderComponent } from "./how-to-place-an-order/how-to-place-an-order.component";
import { ReturnExchangeComponent } from "./return-exchange/return-exchange.component";
import { VacanciesComponent } from "./vacancies/vacancies.component";
import { MenComponent } from "./men/men.component";
import { WomenComponent } from "./women/women.component";
import { AccessoriesComponent } from "./accessories/accessories.component";
import { SubCategoryComponent } from "./sub-category/sub-category.component";
import { MenNewArrivalComponent } from "./men-new-arrival/men-new-arrival.component";
import { WomenNewArrivalsComponent } from "./women-new-arrivals/women-new-arrivals.component";
import { WomenShoesComponent } from "./women-shoes/women-shoes.component";
import { WomenAccessoriesComponent } from "./women-accessories/women-accessories.component";
import { ReturnExchangeProcessComponent } from "./exchange-process/exchange-process.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: {
      title: "Home",
      description: "Welcome to our homepage with a wide selection of products.",
    },
  },
  {
    path: "search",
    component: SearchComponent,
    data: {
      title: "Search",
      description: "Search for your favorite products here.",
    },
  },
  {
    path: "products/:departmentId/:sizeId/:colorId/:styleId/:materialId",
    component: ProductsComponent,
    data: {
      title: "Products",
      description: "Explore our wide range of products tailored to your needs.",
    },
  },
  {
    path: "product-details/:id",
    component: ProductDetailsComponent,
    data: {
      title: "Product Details",
      description: "View detailed information about the selected product.",
    },
  },
  {
    path: "category",
    component: CategoryComponent,
    data: {
      title: "Categories",
      description: "Browse through our categories to find what you need.",
    },
  },
  {
    path: "sub-category/:categoryIdCategoryName",
    component: SubCategoryComponent,
    data: {
      title: "Subcategories",
      description: "Explore products within this subcategory.",
    },
  },
  {
    path: "men/new-arrivals",
    component: MenNewArrivalComponent,
    data: {
      title: "Men's New Arrivals",
      description: "Discover the latest arrivals for men.",
    },
  },
  {
    path: "women/new-arrivals",
    component: WomenNewArrivalsComponent,
    data: {
      title: "Women's New Arrivals",
      description: "Check out the latest trends and new arrivals for women.",
    },
  },
  {
    path: "men",
    component: MenComponent,
    data: {
      title: "Men's Collection",
      description: "Shop our exclusive men's collection.",
    },
  },
  {
    path: "men/category/:slug",
    component: MenComponent,
    data: {
      title: "Men's Collection",
      description: "Explore men's products based on your selection.",
    },
  },
  {
    path: "women",
    component: WomenComponent,
    data: {
      title: "Women's Collection",
      description: "Explore our stylish women's collection.",
    },
  },
  {
    path: "women/category/:slug",
    component: WomenComponent,
    data: {
      title: "Women's Collection",
      description: "Find the perfect items for women from our collection.",
    },
  },
  {
    path: "women/shoes",
    component: WomenShoesComponent,
    data: {
      title: "Women's Shoes",
      description: "Browse our stylish and comfortable women's shoes.",
    },
  },
  {
    path: "women/accessories",
    component: WomenAccessoriesComponent,
    data: {
      title: "Women's Accessories",
      description: "Find trendy accessories for women.",
    },
  },
  {
    path: "men/accessories",
    component: AccessoriesComponent,
    data: {
      title: "Men's Accessories",
      description: "Shop men's accessories to complete your look.",
    },
  },
  {
    path: "men/shoes",
    component: MenComponent,
    data: {
      title: "Men's Shoes",
      description: "Discover the latest styles in men's shoes.",
    },
  },
  {
    path: "cart",
    component: AddToCartComponent,
    data: {
      title: "Shopping Cart",
      description: "Review your selected items in the shopping cart.",
    },
  },
  {
    path: "whatsapp",
    component: CheckoutComponent,
    data: {
      title: "Checkout",
      description: "Proceed to checkout and complete your purchase.",
    },
  },  
  {
    path: "faqs",
    component: FaqsComponent,
    data: {
      title: "FAQs",
      description: "Find answers to frequently asked questions.",
    },
  },
  {
    path: "about-us",
    component: AboutUsComponent,
    data: {
      title: "About Us",
      description: "Learn more about our company and values.",
    },
  },
  {
    path: "terms-and-conditions",
    component: TermsAndConditionsComponent,
    data: {
      title: "Terms and Conditions",
      description: "Read our terms and conditions.",
    },
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent,
    data: {
      title: "Privacy Policy",
      description: "Learn how we protect your data and privacy.",
    },
  },
  {
    path: "contact-us",
    component: ContactUsComponent,
    data: {
      title: "Contact Us",
      description: "Get in touch with us for any queries or support.",
    },
  },
  {
    path: "vacancies",
    component: VacanciesComponent,
    data: {
      title: "Vacancies",
      description: "Explore job opportunities and join our team.",
    },
  },
  {
    path: "delivery-info",
    component: DeliveryInfoComponent,
    data: {
      title: "Delivery Information",
      description: "Learn about our delivery options and policies.",
    },
  },
  {
    path: "payment-options",
    component: PaymentOptionsComponent,
    data: {
      title: "Payment Options",
      description: "Discover the payment options we offer.",
    },
  },
  {
    path: "how-to-check-your-size",
    component: HowToCheckYourSizeComponent,
    data: {
      title: "How to Check Your Size",
      description: "A guide on checking your size for the perfect fit.",
    },
  },
  {
    path: "how-to-place-order",
    component: HowToPlaceAnOrderComponent,
    data: {
      title: "How to Place an Order",
      description: "Learn how to place an order with our easy guide.",
    },
  },
  {
    path: "returns-and-exchange",
    component: ReturnExchangeComponent,
    data: {
      title: "Returns and Exchange",
      description: "Learn about our return and exchange policies.",
    },
  },
  {
    path: "exchange-process",
    component: ReturnExchangeProcessComponent,
    data: {
      title: "Exchange Process",
      description: "A step-by-step guide to our exchange process.",
    },
  },
  {
    path: "**",
    redirectTo: "",
    data: {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    },
  },
];