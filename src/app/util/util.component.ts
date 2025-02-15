import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// util.ts
@Injectable({
  providedIn: "root", // This ensures the service is available throughout your app
})
export class Util {
  //constructor(public httpClient: HttpClient) {}

  fetchDataFromApi(httpClient: HttpClient, apiUrl: string): Observable<any> {
    return httpClient.get(apiUrl);
  }

  getProductPageCategories(caller: string, httpClient: HttpClient): Observable<any> {
    let apiUrl = "";

    // Switch based on the caller to assign different URLs
    switch (caller) {
      case "style":
        apiUrl = "https://friday.kubona.ng/api/StylesGroupBy/70610";
        break;
      case "sizemen":
        apiUrl = "https://friday.kubona.ng/api/DepartmentGroupBy?urlId=70660"; // Example API for sizemen
        break;
      case "sizewomen":
        apiUrl = "https://friday.kubona.ng/api/DepartmentGroupBy?urlId=70750"; // Example API for sizewomen
        break;
      case "featured":
        apiUrl =
          "https://friday.kubona.ng/api/Image/ImageRotators?rotatorId=2&pageSize=12";
        break;
      default:
      // Example API for sizewomen
    }
    return httpClient.get(apiUrl);
  }

  getProductPageSubCategories(httpClient: HttpClient, caller:string = 'featured', params: any[] = []): Observable<any> {
    let apiUrl = "";

    switch (caller) {
        case "style":
          apiUrl = "https://friday.kubona.ng/api/StylesGroupBy/70610";
          break;
        case "sizemen":
          apiUrl = "https://friday.kubona.ng/api/DepartmentGroupBy?urlId=70660"; // Example API for sizemen
          break;
        case "sizewomen":
          apiUrl = "https://friday.kubona.ng/api/DepartmentGroupBy?urlId=70750"; // Example API for sizewomen
          break;
        case "featured":
          apiUrl =
            "https://friday.kubona.ng/api/Image/ImageRotators?rotatorId=2&pageSize=12";
          break;
        default:
        // Example API for sizewomen
      }



    return httpClient.get(apiUrl);
  }
}
