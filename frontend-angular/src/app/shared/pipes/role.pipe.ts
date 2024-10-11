import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Role',
    standalone: true
})
export class RolePipe implements PipeTransform {

    transform(value: string[]): string {
        return value.includes('ADMIN') ? 'Admin' : 'User'
    }

}