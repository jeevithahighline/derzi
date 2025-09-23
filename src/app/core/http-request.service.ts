import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { APP_CONSTANTS } from '../constants';
import { Router } from '@angular/router';

interface HeaderConfig{
  contentType?: string
  token?: string
}

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  public loginInfo: any;
  constructor(private _httpClient: HttpClient, private _router: Router) { }
  
  private _getHttpHeaders(headerConfig: HeaderConfig) {
    let headers = new HttpHeaders({
      'Content-Type': headerConfig?.contentType || 'application/json'
    }); 
   

    // ✅ Bearer token from localStorage
    const bearerToken = '969F1505-A0F3-4D21-9C8E-671FD45B5D54';
    if (bearerToken) {
      headers = headers.set('Authorization', `Bearer ${bearerToken}`);
    }

    // ✅ Auth-Token from localStorage
    const authToken = localStorage.getItem('usertoken');
    if (authToken) {
      headers = headers.set('Auth-Token', authToken);
    }
  
    return headers;
  }
  

  public request<T = any>(requestOption:{
    method: string;
     url: string;
     headerConfig?: HeaderConfig;
     params?: HttpParams | {
      [param: string]: string | number | boolean | readonly (string | number | boolean)[];
    }
    body?:any;
    responseType?: 'json' | 'arraybuffer' | 'blob' | 'text'
  

  }) : Observable<{
    data: T;
    status: number;
    headers: HttpHeaders;
    success:string,
    result: T
    items: T
}>{
    //console.log(requestOption);
    return this._httpClient.request<T>(
      requestOption.method,
      requestOption.url,
      {
        headers: this._getHttpHeaders(requestOption.headerConfig),
        params: requestOption.params,
        body: requestOption.body,
        observe: 'response',
        responseType: (requestOption.responseType ? requestOption.responseType : 'json' as any)
      })
      .pipe(
        map(data => this._extractData<T>(data)),
        catchError(data => this._handleError(data))
      );
  }

  private _extractData = <T>(response: HttpResponse<T>) => {
    const data = { data: response.body, status: response.status, headers: response.headers, } 
    return data;
  }

  private _handleError = (error): Observable<any> => {
    if(error.status === (APP_CONSTANTS.LOGOUT_ERROR_CODES[0] || APP_CONSTANTS.LOGOUT_ERROR_CODES[1])) {
      this._router.navigate(['/login']);
    }
    return throwError(error);

  }

}
