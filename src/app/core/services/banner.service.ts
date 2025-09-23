import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { APP_CONSTANTS } from '../../constants';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

export interface BannerResponse {
  data?: any;
  items: any[];
  status?: number;
  success?: string;
  result?: any;
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,private _router: Router,private _configService: ConfigService) { }


  public getBannerList(usertoken:any) {

    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.GET_ALL_BANNER,
      headerConfig: {token:usertoken}
    }).pipe(
        map(response => this._extractResponse(response))
    );
  }

  public getPageList(usertoken:any) {

    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.GET_ALL_PAGE,
      headerConfig: {token:usertoken}
    }).pipe(
        map(response => this._extractResponse(response))
    );
  }

  public getMerchantList(usertoken:any) {

    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.GET_ALL_MERCHANT,
      headerConfig: {token:usertoken}
    }).pipe(
        map(response => this._extractResponse(response))
    );
  }

  public getCategoryList(usertoken:any) {

    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.GET_ALL_CATEGORY,
      headerConfig: {token:usertoken}
    }).pipe(
        map(response => this._extractResponse(response))
    );
  }

  public getProductList(usertoken:any) {

    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.GET_ALL_PRODUCT,
      headerConfig: {token:usertoken}
    }).pipe(
        map(response => this._extractResponse(response))
    );
  }

  public getAllBanner(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_BANNER}?page=${page}&size=${size}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getSpecificBanner(bannerId: string, usertoken: string) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.SPECIFIC_BANNER+ '/' + bannerId,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => response.data)
    );
  }
  

  public createBanner(payload: FormData,usertoken): Observable<BannerResponse> {
    const url = this._configService.getApiUrl() + environment.SERVICE_APIS.ADD_BANNER;
  
    const bearerToken = localStorage.getItem('bearertoken') || '';
    const authToken = localStorage.getItem('usertoken') || '';
  
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('Auth-Token', authToken);
  
    return this.httpClient.post<BannerResponse>(url, payload, { headers }).pipe(
      map(res => ({
        ...res
      }))
    );
  }  


  public updateBanner(editId: string, payload: FormData, usertoken: string): Observable<BannerResponse> {
    const url = this._configService.getApiUrl() + environment.SERVICE_APIS.UPDATE_BANNER + '/' + editId;
  
    // Get tokens
    const bearerToken = localStorage.getItem('bearertoken') || '';
    const authToken = usertoken || localStorage.getItem('usertoken') || '';
  
    // Set headers
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('Auth-Token', authToken);
  
    // PUT request with FormData
    return this.httpClient.put<BannerResponse>(url, payload, { headers }).pipe(
      map(res => ({
        ...res
      }))
    );
  }
  

  public deleteBanner(deleteId,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.DELETE_BANNER + '/' + deleteId,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public deleteMultipleData(requestBody:{banner_list:string[]},usertoken) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.BULK_BANNER_DELETE,
      body: requestBody,
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


