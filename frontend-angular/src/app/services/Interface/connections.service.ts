import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InterfaceApiBaseService } from '../Base/interface-api-base.service';
import { environment } from 'src/environments/environment.dev';
import { AbmApiBaseService } from '../Base/abm-api-base.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  constructor(private _apiService: InterfaceApiBaseService, private _apiAbmService: AbmApiBaseService) { }

  interfaceHeartBeat(): Observable<string> {
    return this._apiService.get<any>(`/connection/check`).pipe(map(res => { 
      return res as string
    }))
  }
  
  abmHeartBeat(): Observable<any> {
    let params = new HttpParams().set('responseType', 'text' as 'json');

    return this._apiAbmService.get<any>(`/ping`, params, true).pipe(map(res => { 
      return res as string
    }))
  }
}
