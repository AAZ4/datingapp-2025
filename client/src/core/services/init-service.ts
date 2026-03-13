import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);

  Init() {
    const userString = localStorage.getItem('user');
    if (!userString) return of(null);
    const User = JSON.parse(userString);
    this.accountService.currentUser.set(User);

    return of(null);
  }
}
