import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private apiUrl = 'https://friday.kubona.ng/api/SizingGroupBy/70710';

  constructor(private http: HttpClient) { }

  getSizes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
