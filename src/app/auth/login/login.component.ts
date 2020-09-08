import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService, AlertService} from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isVisible = false;

  login = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private router: Router,
    private toast: MatSnackBar,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private accountService: AccountService
  ) {
    if (this.accountService.accountValue) {
      this.router.navigate(['/']);
    }
  }

  get controls() {
    return this.login.controls;
  }

  onSubmit(): void {
    if (this.login.invalid) {
      this.showInfo('Enter valid data');
    } else {
      this.accountService.login(this.controls.email.value, this.controls.password.value)
        .pipe(first())
        .subscribe(() => {
          const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
          this.router.navigateByUrl(returnUrl);
        }, error => this.alertService.error(error));
    }
  }

  showInfo(message: string): void {
    this.toast.open(message, null, {duration: 1500});
  }
}
