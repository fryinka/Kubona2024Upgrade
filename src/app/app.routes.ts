import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { SearchComponent } from "./search/search.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
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
import { ReturnExchangeProcessComponent } from "./exchange-process/exchange-process.component";
import { ProdListComponent } from "./components/prod-list/prod-list.component";

export const routes: Routes = [
  {
    path: "", component: HomeComponent, data: {
      title: "Home", description: "Welcome to our homepage with a wide selection of products.",
    }, pathMatch: "full"
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
    path: "product/:id",
    component: ProductDetailsComponent,
    data: {
      title: "Product Details",
      description: "View detailed information about the selected product.",
    },
  },
  {
    path: "category/:categoryId",
    component: ProdListComponent,
    data: {
      title: "Categories",
      description: "Browse through our categories to find what you need.",
    },
  },
  {
    path: "category/:categoryId/:sortId",
    component: ProdListComponent,
    data: {
      title: "Categories",
      description: "Browse through our categories to find what you need.",
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
    path: "faq",
    component: FaqsComponent,
    data: {
      title: "FAQs",
      description: "Find answers to frequently asked questions.",
    },
  },
  {
    path: "about",
    component: AboutUsComponent,
    data: {
      title: "About Us",
      description: "Learn more about our company and values.",
    },
  },
  {
    path: "terms",
    component: TermsAndConditionsComponent,
    data: {
      title: "Terms and Conditions",
      description: "Read our terms and conditions.",
    },
  },
  {
    path: "privacy",
    component: PrivacyPolicyComponent,
    data: {
      title: "Privacy Policy",
      description: "Learn how we protect your data and privacy.",
    },
  },
  {
    path: "contact",
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
    path: "delivery",
    component: DeliveryInfoComponent,
    data: {
      title: "Delivery Information",
      description: "Learn about our delivery options and policies.",
    },
  },
  {
    path: "paymentoptions",
    component: PaymentOptionsComponent,
    data: {
      title: "Payment Options",
      description: "Discover the payment options we offer.",
    },
  },
  {
    path: "sizehowto",
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