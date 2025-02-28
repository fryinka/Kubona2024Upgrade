import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseURL: string = 'https://friday.kubona.ng/';

  constructor(private http: HttpClient) { }

  getProducts<Prodlist>(urlId: string, lowerPrice: number, upperPrice: number, sortId: number, pageIndex: number, pageSize: number): Observable<Prodlist[]> {
    var url = this.baseURL + 'api/Product/Products/' + urlId;
    var params = new HttpParams()
      .set("lowerPrice", lowerPrice.toString())
      .set("upperPrice", upperPrice.toString())
      .set("sortId", sortId.toString())
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
    return this.http.get<Prodlist[]>(url, { params });
  }

  getProduct(productId: string): Observable<any> {
    var url = this.baseURL + 'api/Product/' + productId;
    return this.http.get<any>(url);
  }

  getCategoryTitle(urlId: string): Observable<any> {
    var url = this.baseURL + 'api/CategoryTitle/' + urlId;
    return this.http.get<any>(url);
  }


  getProductImages(productId: number) {
    const URL = this.baseURL + 'api/ProductImages';
    const PARAMS = new HttpParams().set("Id", productId)
    return this.http.get(URL, { params: PARAMS })
  }

  getDepartmentGroupBy(urlId: string): Observable<any[]> {
    var url = this.baseURL + 'api/DepartmentGroupBy';
    var params = new HttpParams()
      .set("urlId", urlId)
    return this.http.get<any[]>(url,{params});
  }

  getSizingGroupBy(urlId: string): Observable<any[]> {
    var url = this.baseURL + 'api/SizingGroupBy/'+urlId;
    return this.http.get<any[]>(url);
  }
}
