import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Branch } from 'src/app/models/simulation-setup/branch';
import { GithubApiBaseService } from '../Base/github-api-base.service';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  _baseService: GithubApiBaseService = inject(GithubApiBaseService);

  constructor() {}

  getAllBranches(repository: string): Observable<Branch[]> {
    return this._baseService.get<Branch[]>(`/AGRICORE-project/${repository}/branches`).pipe(
      map((res) => {
        return res;
      }),
    );
  }
}
