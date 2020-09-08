import { Component, OnInit } from '@angular/core';
import {AccountService} from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private accountService: AccountService) {
  }

  onLogout() {
    this.accountService.logout();
  }
}
