import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ngxSpinnerService = inject(NgxSpinnerService);

  showPassword(element: HTMLInputElement): void {
    if (element.type === 'password') {
      element.type = 'text';
    } else {
      element.type = 'password';
    }
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    ]),
  });

  msgError: string = '';
  loading: boolean = false;

  loginSubscribe: Subscription = new Subscription();

  submitForm(): void {
    if (this.loginForm.valid) {
      this.loading = true;

      this.loginSubscribe.unsubscribe();
      this.ngxSpinnerService.show()

      this.loginSubscribe = this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            console.log(res);

            // save Token  localstorage
            localStorage.setItem('socialToken', res.data.token);
            localStorage.setItem('socialUser', JSON.stringify(res.data.user));

            this.router.navigate(['/feed']);
            this.ngxSpinnerService.hide();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
