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
export class Reviewservice {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,private _router: Router,private _configService: ConfigService) { }


  public getAllReviews(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.GET_ALL_REVIEWS}?page=${page}&size=${size}`,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public getSpecificReview(editId: string, usertoken: string) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.SPECIFIC_FAQ+ '/' + editId,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => response.data)
    );
  }

  public createReview(payload,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.ADD_FAQ,
      body: payload,
      headerConfig: {token:usertoken}
    })
      .pipe(
        map(response => this._extractResponse(response))
      );
  }

  // ✅ Approve review
  public approveReview(payload, usertoken: any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST, // or POST — depending on backend
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.APPROVE_REVIEW}`,
      body: payload,
      headerConfig: { token: usertoken }
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  // ❌ Reject review
  public rejectReview(payload, usertoken: any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST, // or POST — depending on backend
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.REJECT_REVIEW}`,
      headerConfig: { token: usertoken },
      body: payload,
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }


  

  public deleteReview(payload,usertoken) {


    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.POST,
      url: this._configService.getApiUrl()+environment.SERVICE_APIS.COMPLETE_DELETE_REVIEW,
      body: payload,
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


