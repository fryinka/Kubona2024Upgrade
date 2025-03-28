import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes'; // Import your routes
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { Util } from './util/util.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { routing}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    ProductDetailsComponent,
    AddToCartComponent,
    Util,
    CheckoutComponent // Declare your new component
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes), // Apply your routes
    ServiceWorkerModule.register('ngsw-worker.js',{
      registrationStrategy:'registrationWhenStable:3000'
    })
  ],
  providers: [Util],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
 