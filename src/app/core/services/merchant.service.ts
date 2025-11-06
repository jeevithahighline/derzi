import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { APP_CONSTANTS } from '../../constants';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

export interface MerchantResponse {
  data?: any;
  items: any[];
  status?: number;
  success?: string;
  result?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,private _router: Router,private _configService: ConfigService) { }


  public getAllMerchant(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_MERCHANT}?page=${page}&size=${size}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getSpecificMerchant(userId: string, usertoken: string) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.SPECIFIC_MERCHANT+ '/' + userId,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => response.data)
    );
  }
  

  public createMerchant(payload: FormData,usertoken): Observable<MerchantResponse> {
    const url = this._configService.getApiUrl() + environment.SERVICE_APIS.ADD_MERCHANT;
  
    const bearerToken = localStorage.getItem('bearertoken') || '';
    const authToken = localStorage.getItem('usertoken') || '';
  
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('Auth-Token', authToken);
  
    return this.httpClient.post<MerchantResponse>(url, payload, { headers }).pipe(
      map(res => ({
        ...res
      }))
    );
  }  


  public updateMerchant(editId: string, payload: FormData, usertoken: string): Observable<MerchantResponse> {
    const url = this._configService.getApiUrl() + environment.SERVICE_APIS.UPDATE_MERCHANT + '/' + editId;
  
    // Get tokens
    const bearerToken = localStorage.getItem('bearertoken') || '';
    const authToken = usertoken || localStorage.getItem('usertoken') || '';
  
    // Set headers
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('Auth-Token', authToken);
  
    // PUT request with FormData
    return this.httpClient.put<MerchantResponse>(url, payload, { headers }).pipe(
      map(res => ({
        ...res
      }))
    );
  }
  

  public deleteMerchant(deleteId,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.DELETE_MERCHANT + '/' + deleteId,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public deleteCompleteMerchant(deleteId,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.COMPLETE_DELETE_MERCHANT + '/' + deleteId,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public deleteMultipleData(requestBody:{deleteIds:string[]}, usertoken) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl() + environment.SERVICE_APIS.BULK_MERCHANT_DELETE,
      body: requestBody,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getAllCategories(usertoken: any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_CATEGORY}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getAllServices(usertoken: any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_TAILORING_SERVICE}`,
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


