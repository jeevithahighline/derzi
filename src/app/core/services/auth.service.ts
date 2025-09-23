import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { APP_CONSTANTS } from '../../constants'
import { environment } from "../../../environments/environment"
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

// Derzi Users
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,public _router: Router,private _configService: ConfigService) { }

  get isAuthenticated() {
    const token = localStorage.getItem('usertoken'); // ✅ match your login storage
    return !!token;
  }
  

  public postLoginInfo(requestBody: { email, password}) {
   //console.log(this._configService.getApiUrl());
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.LOGIN_USER,
      body: requestBody
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public refreshToken() {

    //console.log("refreshh");
    const payload = {
      "refresh": localStorage.getItem('refreshtoken')
    }

    //console.log(this._configService.getApiUrl());
     return this._httpReqService.request({
       method: APP_CONSTANTS.API_METHODS.POST,
       url: this._configService.getApiUrl()+environment.SERVICE_APIS.REFRESH_TOKEN,
       body: payload
     })
       .pipe(
         map(response => this._extractResponse(response))
       );
   }

   public logout() {
    //console.log("logout here");
  
    const payload = {
      "refresh": localStorage.getItem('usertoken')
    };
  
    this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl() + environment.SERVICE_APIS.LOGOUT_API,
      body: payload
    })
    .pipe(map(response => this._extractResponse(response)))
    .subscribe({
      next: (res) => {
        //console.log('Logged out successfully');
        localStorage.clear();
      },
      error: (err) => {
        console.warn('Logout API failed, clearing anyway');
        localStorage.clear();
      }
    });
  }

  // Example: check if token exists
  check(): Observable<boolean> {
    const token = localStorage.getItem('usertoken');
    return of(!!token); // true if token exists, false otherwise
  }

   // 🔑 Getter for token (from localStorage)
   get accessToken(): string | null {
    return localStorage.getItem('usertoken');
  }

  // Example: store token after login
  set usertoken(token: string | null) {
    if (token) {
      localStorage.setItem('usertoken', token);
    } else {
      localStorage.removeItem('usertoken');
    }
  }  
  
  public signOut(){
    localStorage.removeItem('usertoken');
  }

  public getAllderziusers(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_DERZI_USERS_API}?page=${page}&size=${size}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getSpecificUser(userId: string, usertoken: string) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.SPECIFIC_DERZI_USERS_API+ '/' + userId,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => response.data)
    );
  }

  public deleteUser(deleteId,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.DELETE_DERZI_USERS_APP + '/' + deleteId,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  private _extractResponse = (response: { data: any, success:any,status: number }) => {

  //console.log('respInExtractResp',response); 
    if (response.status === APP_CONSTANTS.SUCCESS_RESPONSE_CODES) {
      return response.data;
    } else {
      return false;
    }
   } 

}


