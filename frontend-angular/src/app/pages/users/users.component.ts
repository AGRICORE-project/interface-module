import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogActions } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { EditUserComponent } from 'src/app/dialogs/user/edit-user/edit-user.component';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { UserService } from 'src/app/services/Interface/user.service';
import { RolePipe } from '../../shared/pipes/role.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    standalone: true,
    imports: [MatCardModule, FlexModule, NgIf, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatDialogTitle, MatDialogActions, RolePipe]
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('deleteUser') deleteUserDialog = {} as TemplateRef<any>;

  displayedColumns: string[] = ['email','name', 'role', 'status', 'options'];

  userList: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null)
  userTable: MatTableDataSource<User> = new MatTableDataSource();

  userRegisteredList: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null)
  userRegisteredTable: MatTableDataSource<User> = new MatTableDataSource();

  editDialog: MatDialogRef<EditUserComponent>;
  deleteUser: MatDialogRef<any>;

  loaded: boolean = false;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor(private dialog: MatDialog, private _userService: UserService, private _alertService: AlertService) { }
  
  ngOnInit(): void {
    this.userList.subscribe( res => this.userTable.data = res )
    this.userRegisteredList.subscribe( res => this.userRegisteredTable.data = res )
    this.getAllUsers()

    // Set new users badge to 0
    this._userService.newUsers.next(0);
  }

  ngAfterViewInit(): void {
    this.userTable.paginator = this.paginator;
    this.userTable.sort = this.sort;
  }

  getAllUsers(): void {
    this._userService.getAllUsers().subscribe({
      next: (res) => {
        this.userList.next( res.filter(user => user.verified === true ) )
        this.userRegisteredList.next( res.filter(user => user.verified === false))
      },
      error: (err) => this._alertService.alertError('Could not load users: ' + err),
    }).add(() => this.loaded = true)
  }

  ngOnDestroy(): void {
    this.userList.unsubscribe();
    this.userRegisteredList.unsubscribe();
  }

  verifyUser(id: number): void { 
    this._userService.verifyUser(id).subscribe({
      next: (res) => {
        // Update tables
        const user: User = this.userRegisteredList.value.find( user => user.id === id)
        this.userRegisteredList.next( this.userRegisteredList.value.filter( user => user.id !== id ) )
        this.userList.next([user, ...this.userList.value])
        this._alertService.alertSuccess(res)
      },
      error: (err) => this._alertService.alertError(err)
    })
   }

  openDeleteUser(email: string): void {
    this.deleteUser = this.dialog.open(this.deleteUserDialog);
    this.deleteUser.afterClosed().subscribe(
     res => 
     // Delete user if return true on choice
     res && this._userService.deleteUser(email).subscribe({
      next: (res) => {
        // Update tables
        this.userList.next( this.userList.value.filter( user => user.email !== email) )
        this.userRegisteredList.next( this.userRegisteredList.value.filter( user => user.email !== email) )
        this._alertService.alertSuccess('Selected user deleted')
      },
      error: (err) => this._alertService.alertError(`Could not delete the selected user: ${err}`)
    })
    )
  }

  deleteUserChoice( choice: boolean ): void {
    this.deleteUser.close(choice)
  }

  openEditUser(email: string): void {
    this.editDialog = this.dialog.open(EditUserComponent, { data: {email: email} });
    this.editDialog.afterClosed().subscribe({
       next: (res) => {
          if (res) {
          // Update table with new value
          const updatedTable: User[] = this.userList.value.map( user => user.email === email ? res : user )
          this.userList.next( updatedTable )
          this._alertService.alertSuccess('User updated succesfully')
          }
       }
    })
  }

}
