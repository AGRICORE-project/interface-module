import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { PersonalPolicyComponent } from 'src/app/dialogs/personal-policy/personal-policy.component';
import { Policy } from 'src/app/models/simulation-setup/policy';
import { PoliciesService } from 'src/app/services/Interface/policies.service';
import { AlertService } from '../../../services/Interface/alert-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';


@Component({
    selector: 'app-my-catalogue',
    templateUrl: './my-catalogue.component.html',
    styleUrls: ['./my-catalogue.component.scss'],
    standalone: true,
    imports: [MatCardModule, FlexModule, MatButtonModule, MatIconModule, MatFormFieldModule, NgIf, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe]
})
export class MyCatalogueComponent implements OnInit , AfterViewInit, OnDestroy  {

  displayedColumns: string[] = ['createdAt','title', 'type', 'startDate', 'derogationDate', 'options'];
  
  policiesList: BehaviorSubject<Policy[]> = new BehaviorSubject<Policy[]>(null)
  policyTable: MatTableDataSource<Policy> = new MatTableDataSource();

  createDialog: MatDialogRef<PersonalPolicyComponent>;
  updateDialog: MatDialogRef<PersonalPolicyComponent>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngAfterViewInit() {
    this.policyTable.paginator = this.paginator;
    this.policyTable.sort = this.sort;
  }
  
  constructor(private dialog: MatDialog, private _policiesService: PoliciesService, private _alertService: AlertService) {}
  
  ngOnInit(): void {
    //Subscribe to policies list and when has new value update table
    this.policiesList.subscribe( res => this.policyTable.data = res)
    this.loadPolicies();
  }
  
  loadPolicies(): void{
    this._policiesService.loadAllPolicies().subscribe({
      next: (res) => this.policiesList.next(res),
      error: (err) => this._alertService.alertError(err.error.message)
    })
  }

  openCreatePolicy(): void{
    this.createDialog = this.dialog.open(PersonalPolicyComponent, { data: {id: null} });
    this.createDialog.afterClosed().subscribe( newPolicy => {
      if (newPolicy) this.policiesList.next([newPolicy, ...this.policiesList.value])
    })
  }

  openEditPolicy(id: number): void {
    this.updateDialog = this.dialog.open(PersonalPolicyComponent, { data: {id: id} });
    this.updateDialog.afterClosed().subscribe( ( res: Policy ) => {
      
      // Replaces the current policy for the updated one and refreshes table
      const updatedTable = this.policiesList.value.map( policy => policy.id === res.id ? res : policy )
      if (res) this.policiesList.next(updatedTable)
    })
  }

  deletePolicy(id: number): void {
    this._policiesService.deletePolicy(id).subscribe({
      next: res => {
        this._alertService.alertSuccess('Policy successfully deleted')
        this.policiesList.next( this.policiesList.value.filter( policy => policy.id !== id) )
      },
      error: err => this._alertService.alertError(err.error.message)
    })
  }

  ngOnDestroy(): void {
    this.policiesList.unsubscribe();
  }

}
