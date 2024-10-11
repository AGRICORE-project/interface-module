import { Injectable } from '@angular/core';
import { InterfaceApiBaseService } from '../Base/interface-api-base.service';
import { map, Observable } from 'rxjs';
import { Policy } from '../../models/simulation-setup/policy';

@Injectable({
  providedIn: 'root',
})
export class PoliciesService {
  constructor(private _apiService: InterfaceApiBaseService) {}

  loadAllPolicies(): Observable<Policy[]> {
    return this._apiService.get<any>('/policy').pipe(
      map((res) => {
        const policies: Policy[] = res;
        return policies;
      }),
    );
  }

  getPolicyById(id: number): Observable<Policy> {
    return this._apiService.get<any>(`/policy/${id}`).pipe(
      map((res) => {
        const policy: Policy = res;
        return policy;
      }),
    );
  }

  createPolicy(policy: Policy): Observable<Policy> {
    return this._apiService.post<any>('/policy', policy).pipe(map((res) => res));
  }

  updatePolicy(id: number, policy: Policy): Observable<Policy> {
    return this._apiService.put<any>(`/policy/${id}`, policy).pipe(
      map((res) => {
        const policy: Policy = res;
        return policy;
      }),
    );
  }

  deletePolicy(id: number): Observable<any> {
    return this._apiService.delete<any>(`/policy/${id}`);
  }
}
