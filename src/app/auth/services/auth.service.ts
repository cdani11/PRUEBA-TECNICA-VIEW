import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthStatus, LoginResponse, CheckTokenResponse, Usuario } from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrlAuth: string = environment.baseUrlAuth;
  private http = inject(HttpClient);
  private _currentUser = signal<Usuario | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor(private _router: Router) {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: Usuario, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('estadoAuth', AuthStatus.authenticated);
    return true;
  }

  login(usuario: string, clave: string): Observable<boolean> {

    const url: string = `${this.baseUrlAuth}/Login`;

    const body = {
      usuario: usuario,
      password: clave
    }

    const credentials = btoa(`${usuario}:${clave}`);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`
    });

    return this.http.post<LoginResponse>(url, body, { headers, withCredentials: true })
      .pipe(
        map(({ result }) => {
          if (result.id === 0)
            return false;

          this.setAuthentication(result, result.token);
          return true;
        }),
        catchError(err => {
          return throwError(() => err.error.message);

        })
      )
  }


  public checkAuthStatus(): Observable<boolean> {
    //this.logout();
    const currentUser = localStorage.getItem("user");
    const authStatusUser = localStorage.getItem("estadoAuth");

    if (!currentUser || !authStatusUser) {
      this.logout();
      return of(false);
    }

    const StatusUser = authStatusUser as AuthStatus;

    if (StatusUser !== AuthStatus.authenticated) {
      this.logout();
      return of(false);
    }
    const usuarioEdoc = JSON.parse(currentUser) as Usuario;


    this._currentUser.set(usuarioEdoc);
    this._authStatus.set(StatusUser);

    return of(true);

  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('estadoAuth');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._router.navigateByUrl('/auth');
  }
}
