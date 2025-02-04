import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authServices = inject(AuthService);

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    // console.log(this.myForm.value);
    const { email, password } = this.myForm.value;

    // this.authServices.login(email, password).subscribe((sucess) => {
    //   console.log(sucess);
    // });

    this.authServices.login(email, password).subscribe({
      next: () => console.log('todo bien'),
      error: (message) => {
        // console.log({ loginerror: message });
        Swal.fire('Error', message, 'error');
      },
    });
  }
}
