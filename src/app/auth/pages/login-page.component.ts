import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/page/dialog.component';

@Component({
  selector: 'app-login-page',
  imports: [

    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export default class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private _formBuilder: FormBuilder, private _authService: AuthService, private _router: Router, private _dialog: MatDialog) {
    console.log('llego al contructor del login');
    this.loginForm = this._formBuilder.group({
      usuario: new FormControl<string>('', [Validators.required]),
      clave: new FormControl<string>('', [Validators.required]),
    });
  }


  ngOnInit(): void {

  }




  login(): void {
    const { usuario, clave } = this.loginForm.value;
    this._authService.login(usuario!, clave!)
      .subscribe(
        {
          next: (valor) => {
            if (valor) {
              this._router.navigateByUrl('/inicio');
              return;
            }

            this._dialog.open(DialogComponent, {
              data: { message: 'Credenciales incorrectas o el usuario no tiene acceso.' }
            });

          },
          error: (err) => {
            console.log(err);
            /* Swal.fire('Error', err, 'error')   */
          }
        });
  }
}
