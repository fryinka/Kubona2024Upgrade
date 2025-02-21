import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseURL: string = 'https://friday.kubona.ng/api/';

  constructor(private http: HttpClient) { }

  getProduct(deptId: number, lowerPrice: number, upperPrice: number, sortId: number, pageIndex: number, pageSize: number): Observable<any[]> {
    const URL = this.baseURL + 'Product/Products/' + deptId;
    const PARAMS = new HttpParams().set("lowerPrice", lowerPrice).set("upperPrice", upperPrice).set("sortId", sortId).set("pageIndex", pageIndex).set("pageSize", pageSize);
    return this.http.get<any[]>(URL, { params: PARAMS });
  }

  getProductImages(productId: number) {
    const URL = this.baseURL + 'ProductImages';
    const PARAMS = new HttpParams().set("Id", productId)
    return this.http.get(URL, { params: PARAMS })
  }
}
