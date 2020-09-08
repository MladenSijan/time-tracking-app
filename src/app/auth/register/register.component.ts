import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {passwordRegex} from '../../helpers';
import {AccountService, AlertService} from '../../services';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  register = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(passwordRegex)]),
  });

  constructor(
    private router: Router,
    private toast: MatSnackBar,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private accountService: AccountService
  ) {
  }

  onSubmit(): void {
    if (this.register.invalid) {
      this.showInfo('Enter valid data');
    } else {
      this.accountService.register(this.register.value)
        .pipe(first())
        .subscribe(() => {
          this.alertService.success('Registration successful', {keepAfterRouteChange: true});
          this.router.navigate(['../login'], {relativeTo: this.route});
        }, error => this.alertService.error(error));
    }
  }

  showInfo(message: string): void {
    this.toast.open(message, null, {duration: 1500});
  }
}
