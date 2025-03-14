import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryTitle, ColorsGroup, ContactUs, HeelHeightGroup, ImageRotators, MaterialGroup, OtherColors, Prodlist, ProductImages, RecentlyViewed, RelatedProducts, Reviews, SizeGroup, Sizelist, SlideShowImages, StylesGroup } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseURL: string = 'https://friday.kubona.ng/';

  constructor(private http: HttpClient) { }

  getProducts(urlId: string, lowerPrice: number, upperPrice: number, sortId: number, pageIndex: number, pageSize: number): Observable<Prodlist[]> {
    var url = this.baseURL + 'api/Product/Products/' + urlId;
    var params = new HttpParams()
      .set("lowerPrice", lowerPrice.toString())
      .set("upperPrice", upperPrice.toString())
      .set("sortId", sortId.toString())
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
    return this.http.get<Prodlist[]>(url, { params });
  }

  getProduct(productId: string): Observable<Prodlist> {
    var url = this.baseURL + 'api/Product/' + productId;
    return this.http.get<Prodlist>(url);
  }

  getCategoryTitle(urlId: string): Observable<CategoryTitle> {
    var url = this.baseURL + 'api/CategoryTitle/' + urlId;
    return this.http.get<CategoryTitle>(url);
  }


  getProductImages(productId: string): Observable<ProductImages[]> {
    const URL = this.baseURL + 'api/ProductImages';
    const PARAMS = new HttpParams().set("Id", productId)
    return this.http.get<ProductImages[]>(URL, { params: PARAMS })
  }

  getDepartmentGroupBy(urlId: string): Observable<any[]> {
    var url = this.baseURL + 'api/DepartmentGroupBy';
    var params = new HttpParams()
      .set("urlId", urlId)
    return this.http.get<any[]>(url, { params });
  }

  getSizingGroupBy(urlId: string): Observable<SizeGroup[]> {
    var url = this.baseURL + 'api/SizingGroupBy/' + urlId;
    return this.http.get<SizeGroup[]>(url);
  }

  getColorGroupBy(urlId: string): Observable<ColorsGroup[]> {
    var url = this.baseURL + 'api/ColorsGroupBy/' + urlId;
    return this.http.get<ColorsGroup[]>(url);
  }

  getHeelGroupBy(urlId: string): Observable<HeelHeightGroup[]> {
    var url = this.baseURL + 'api/HeelHeightGroupBy/' + urlId;
    return this.http.get<HeelHeightGroup[]>(url);
  }
  geMaterialGroupBy(urlId: string): Observable<MaterialGroup[]> {
    var url = this.baseURL + 'api/MaterialGroupBy/' + urlId;
    return this.http.get<MaterialGroup[]>(url);
  }

  getStyleGroupBy(urlId: string): Observable<StylesGroup[]> {
    var url = this.baseURL + 'api/StylesGroupBy/' + urlId;
    return this.http.get<StylesGroup[]>(url);
  }

  getSlideShowImages(): Observable<SlideShowImages[]> {
    var url = this.baseURL + 'api/Image/GetSlideShowImages';
    return this.http.get<SlideShowImages[]>(url);
  }

  getImageRotators(rotatorId: number, pageSize: number): Observable<ImageRotators[]> {
    var url = this.baseURL + 'api/Image/ImageRotators';
    var params = new HttpParams()
      .set("rotatorId", rotatorId.toString())
      .set("pageSize", pageSize.toString());
    return this.http.get<ImageRotators[]>(url, { params });
  }

  getOtherColors(similarId: string, productId: number): Observable<OtherColors[]> {
    var url = this.baseURL + 'api/OtherColors';
    var params = new HttpParams()
      .set("similarId", similarId)
      .set("productId", productId.toString());
    return this.http.get<OtherColors[]>(url, { params });
  }

  getProductSizes(productId: string): Observable<Sizelist[]> {
    var url = this.baseURL + 'api/Product/Sizes/' + productId;
    return this.http.get<Sizelist[]>(url);
  }

  getRelatedProducts(departmentId: number, itemGroupId: number, pageSize: number): Observable<RelatedProducts[]> {
    var url = this.baseURL + 'api/RelatedProducts';
    var params = new HttpParams()
      .set("departmentId", departmentId.toString())
      .set("itemGroupId", itemGroupId.toString())
      .set("pageSize", pageSize.toString())
    return this.http.get<RelatedProducts[]>(url, { params });
  }

  getRecentlyViewed(userId: string, pageSize: number): Observable<RecentlyViewed[]> {
    var url = this.baseURL + 'api/RecentlyViewed';
    var params = new HttpParams()
      .set("userId", userId)
      .set("pageSize", pageSize.toString())
    return this.http.get<RecentlyViewed[]>(url, { params });

  }

  postRecentlyViewed(formBody: any) {
    var url = this.baseURL + 'api/RecentlyViewed';
    return this.http.post(url, formBody);
  }

  submitContactUs(formBody: ContactUs) {
    var url = this.baseURL + 'api/Contact/Add';
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(url, formBody, { headers });
  }

  getReviews(): Observable<Reviews[]> {
    var url = this.baseURL + 'api/Reviews/GetAll';
    return this.http.get<Reviews[]>(url)
  }

  searchProduct(urlId: string, query: string): Observable<Prodlist[]> {
    var url = this.baseURL + 'api/Product/Search'
    const params = new HttpParams()
      .set("query", query)
      .set("urlId", urlId)
    return this.http.get<Prodlist[]>(url, { params });
  }
}
