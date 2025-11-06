import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { APP_CONSTANTS } from '../../constants'
import { environment } from "../../../environments/environment"
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,private _router: Router,private _configService: ConfigService) { }

  public listallOrder(usertoken: any, page: any, size: any, filters: any = {}) {
    // Build query params string
    let queryParams = `?page=${page}&size=${size}`;
  
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
        queryParams += `&${key}=${encodeURIComponent(filters[key])}`;
      }
    });
  
    // Build final URL
    const url = `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_ORDERS}${queryParams}`;
  
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }
  
  public listAllInvoices(usertoken: any, page: any, size: any, filters: any = {}) {
    // Build query params string
    let queryParams = `?page=${page}&size=${size}`;
  
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
        queryParams += `&${key}=${encodeURIComponent(filters[key])}`;
      }
    });
  
    // Build final URL
    const url = `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_INVOICES}${queryParams}`;
  
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }
  

  public getAllOrder(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_ORDERS}?page=${page}&size=${size}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getSpecificOrder(editId: string, usertoken: string) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.SPECIFIC_ORDER+ '/' + editId,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => response.data)
    );
  }

  public getAllInvoices(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_INVOICES}?page=${page}&size=${size}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public deleteOrder(deleteId,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.DELETE_ORDER+ '/' + deleteId,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public createOrder(payload,usertoken) {

    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      body: payload,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.CREATE_ORDER,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
 
  }

  public updateOrder(orderId,data,usertoken) {

    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.DELETE_ORDER+ '/' + orderId,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
 
  }


  public updatedeliveryStatus(payload,usertoken){


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      body: payload,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.UPDATE_DEIVERY_STATUS,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
 
  }

  public getAllPaymentMethod(usertoken: any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_PAYMENT_METHOD}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getAllCountry(usertoken: any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_COUNTRY}`,
      headerConfig: { token: usertoken }
    }).pipe(
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


