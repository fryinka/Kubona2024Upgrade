import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversionsAPIService {

  public facebookData: any;
  public facebookUrl: string = "https://graph.facebook.com/v21.0/";
  public pixel_id: number = 453680828887319;
  public access_token = "EAAB8pdVoRgoBO7ZAWlGzHuBZB8ZC8RJKjTJCv9PiK4FPyJ8yFBAloBcN0GuJVy4rIb9zyJoJfYl6e5HkVj6UJnlZAajsjTNTXa1pAZAAE9rfP6A5xY0xK5IF7PAGEKxWfwfRBkvI913THUPjW3BelcIgqdVUWQ7X48W0bx8haPxjpcYGLxo6QaAZARDkUQRXIrOQZDZD";
  public testCode: string = "TEST21659";
  public fbResponse: any;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getEventData(eventName: string, eventTime: number, actionSource: string, eventId: string, eventSourceUrl: string, clientIp: string, clientUserAgent: string, fbc: string, fbp:string, em: string[], currency: string, value: string): any {

    const output =
      [
        {
          event_name: eventName,
          event_time: eventTime,
          action_source: actionSource,
          event_id: eventId,
          original_event_data: {
            event_name: eventName,
            event_time: eventTime
          },
          event_source_url: eventSourceUrl,
          user_data: {
            client_ip_address: clientIp.length > 0 ? clientIp : null,
            client_user_agent: clientUserAgent,
            fbc: fbc,
            fbp:fbp,
            em: em
          },
          custom_data: {
            currency: currency,
            value: value
          }
        }
      ];

    return output;
  }

  // sendToFB(facebookData:any):Observable<any> {
  //   if (facebookData!=null) {
  //     const header = new HttpHeaders()
  //     .set('Content-Type', 'multipart/form-data')
  //     .set('Cache-control', 'no-cache')
  //     .set('Accept', 'Application/json');
  //     const fields = {
  //       "access_token": this.access_token,
  //       "data":facebookData
  //     };
  //     const params={
  //       data:facebookData,
  //       // test_event_code:this.testCode,
  //       access_token:this.access_token
  //     }
  //     let requestBody = new FormData();
  //     requestBody.append('access_token', this.access_token);
  //     requestBody.append('content', facebookData);
      
  //     //HTTP
  //     return this.http.post(this.facebookUrl + this.pixel_id + '/events', fields, { headers: header, params: params });
  //   }
  // }
getIPAddress(){
  var url = this.baseUrl + 'api/CheckOut/IPAddress';
  return this.http.get(url, { responseType: 'text' });
}
}