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
export class TailoringService {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,private _router: Router,private _configService: ConfigService) { }

  public getAlltailoringservice(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_TAILORING_SERVICE}?page=${page}&size=${size}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getSpecifictailoringservice(editId: string, usertoken: string) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.SPECIFIC_TAILORING_SERVICE+ '/' + editId,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => response.data)
    );
  }

  public createtailoringservice(payload,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.ADD_TAILORING_SERVICE,
      body: payload,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public updatetailoringservice(editId,requestBody:any,usertoken:any) {

    //console.log("Api",requestBody);

    const url = this._configService.getApiUrl()+environment.SERVICE_APIS.UPDATE_TAILORING_SERVICE+ '/' + editId;
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.PUT,
      url:url, 
      body: requestBody,
      headerConfig: {token:usertoken}
    }).pipe(
        map(response => this._extractResponse(response))
    );
  }

  public deletetailoringservice(deleteId,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.DELETE_TAILORING_SERVICE+ '/' + deleteId,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public deleteMultipleData(requestBody:{tailoring_list:string[]},usertoken) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.BULK_TAILORING_SERVICE_DELETE,
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


