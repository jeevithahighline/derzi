import { Injectable } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { APP_CONSTANTS } from '../../constants';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

export interface CategoryResponse {
  data?: any;
  items: any[];
  status?: number;
  success?: string;
  result?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,private _router: Router,private _configService: ConfigService) { }


   public getAllCategory(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_CATEGORY}?page=${page}&size=${size}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getSpecificCategory(groupId: string, usertoken: string) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.SPECIFIC_CATEGORY+ groupId,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => response.data)
    );
  }

 

  public createCategory(payload: FormData,usertoken): Observable<CategoryResponse> {
    const url = this._configService.getApiUrl() + environment.SERVICE_APIS.ADD_CATEGORY;
  
    const bearerToken = localStorage.getItem('bearertoken') || '';
    const authToken = localStorage.getItem('usertoken') || '';
  
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('Auth-Token', authToken);
  
    return this.httpClient.post<CategoryResponse>(url, payload, { headers }).pipe(
      map(res => ({
        ...res
      }))
    );
  }  


  public updateCategory(editId: string, payload: FormData, usertoken: string): Observable<CategoryResponse> {
    const url = this._configService.getApiUrl() + environment.SERVICE_APIS.UPDATE_CATEGORY + '/' + editId;
  
    // Get tokens
    const bearerToken = localStorage.getItem('bearertoken') || '';
    const authToken = usertoken || localStorage.getItem('usertoken') || '';
  
    // Set headers
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${bearerToken}`)
      .set('Auth-Token', authToken);
  
    // PUT request with FormData
    return this.httpClient.put<CategoryResponse>(url, payload, { headers }).pipe(
      map(res => ({
        ...res
      }))
    );
  }

  public deleteCategory(deleteId,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.DELETE_CATEGORY + '/' + deleteId,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public deleteMultipleData(requestBody:{category_list:string[]},usertoken) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.BULK_CATEGORY_DELETE,
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


