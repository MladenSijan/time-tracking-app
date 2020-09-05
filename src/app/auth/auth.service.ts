import {Injectable} from '@angular/core';
import {RequestsService} from '../shared/requests.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    private requests: RequestsService
  ) {
  }

  requestLogin(): void {
    
  }

  requestRegister(): void {

  }
}
