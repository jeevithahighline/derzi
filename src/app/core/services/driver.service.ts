import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { APP_CONSTANTS } from '../../constants';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

export interface DriverResponse {
  data?: any;
  items: any[];
  status?: number;
  success?: string;
  result?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,private _router: Router,private _configService: ConfigService) { }


  public getAllDriver(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_DRIVER}?page=${page}&size=${size}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getSpecificDriver(userId: string, usertoken: string) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.SPECIFIC_DRIVER+ '/' + userId,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => response.data)
    );
  }
  

  public createDriver(payload: FormData,usertoken): Observable<DriverResponse> {
    const url = this._configService.getApiUrl() + environment.SERVICE_APIS.ADD_DRIVER;
  
    const bearerToken = localStorage.getItem('bearertoken') || '';
    const authToken = localStorage.getItem('usertoken') || '';
  
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('Auth-Token', authToken);
  
    return this.httpClient.post<DriverResponse>(url, payload, { headers }).pipe(
      map(res => ({
        ...res
      }))
    );
  }  


  public updateDriver(editId: string, payload: FormData, usertoken: string): Observable<DriverResponse> {
    const url = this._configService.getApiUrl() + environment.SERVICE_APIS.UPDATE_DRIVER + '/' + editId;
  
    // Get tokens
    const bearerToken = localStorage.getItem('bearertoken') || '';
    const authToken = usertoken || localStorage.getItem('usertoken') || '';
  
    // Set headers
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('Auth-Token', authToken);
  
    // PUT request with FormData
    return this.httpClient.put<DriverResponse>(url, payload, { headers }).pipe(
      map(res => ({
        ...res
      }))
    );
  }
  

  public deleteDriver(deleteId,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.DELETE_DRIVER + '/' + deleteId,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public deleteMultipleData(requestBody:{User_list:string[]},usertoken) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.BULK_DRIVER_DELETE,
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


