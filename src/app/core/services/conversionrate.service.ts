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
export class ConversionRateService {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,private _router: Router,private _configService: ConfigService) { }


  public getAllConversionRate(usertoken: any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_CONVERSION_RATE}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getSpecificConversionRate(editId: string, usertoken: string) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.SPECIFIC_CONVERSION_RATE+ '/' + editId,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => response.data)
    );
  }

  public createConversionRate(payload,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.ADD_CONVERSION_RATE,
      body: payload,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  public updateConversionRate(editId,requestBody:any,usertoken:any) {

    //console.log("Api",requestBody);

    const url = this._configService.getApiUrl()+environment.SERVICE_APIS.UPDATE_CONVERSION_RATE+ '/' + editId;
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.PUT,
      url:url, 
      body: requestBody,
      headerConfig: {token:usertoken}
    }).pipe(
        map(response => this._extractResponse(response))
    );
  }

  public saveOrUpdateCurrencies(payload: any[], token: string) {

    const url = this._configService.getApiUrl()+environment.SERVICE_APIS.SAVE_UPDATE_CONVERSION_RATE;
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url:url, 
      body: payload,
      headerConfig: {token:token}
    }).pipe(
        map(response => this._extractResponse(response))
    );
  }
  

  public deleteConversionRate(deleteId,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.DELETE,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.DELETE_CONVERSION_RATE + '/' + deleteId,
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


