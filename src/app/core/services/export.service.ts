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
export class ExportService {

  constructor(private httpClient: HttpClient,private _httpReqService: HttpRequestService,private _router: Router,private _configService: ConfigService) { }


  public ExportDriverCsv(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_DRIVER_CSV}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public ExportDriverExcel(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_DRIVER_EXCEL}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public ExportMerchantCsv(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_MERCHANT_CSV}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public ExportMerchantExcel(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_MERCHANT_EXCEL}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public ExportUserCsv(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_USER_CSV}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public ExportUserExcel(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_USER_EXCEL}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public ExportOrderCsv(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_ORDER_CSV}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public ExportOrderExcel(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_ORDER_EXCEL}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public ExportProductCsv(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_PRODUCT_CSV}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
    }).pipe(
      map(response => this._extractResponse(response))
    );
  }

  public ExportProductExcel(usertoken: any, page:any, size:any) {
    return this._httpReqService.request({
      method: APP_CONSTANTS.API_METHODS.GET,
      url: `${this._configService.getApiUrl()}${environment.SERVICE_APIS.EXPORT_PRODUCT_EXCEL}`,
      headerConfig: { token: usertoken },
      responseType: 'blob'   // 👈 important for CSV/Excel
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


