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

  private _extractResponse = (response: { data: any, success:any,status: number }) => {

    //console.log('respInExtractResp',response); 
    if (response.status === APP_CONSTANTS.SUCCESS_RESPONSE_CODES) {
      return response.data;
    } else {
      return false;
    }
   } 




}


