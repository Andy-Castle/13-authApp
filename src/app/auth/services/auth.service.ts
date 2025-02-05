import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environments } from 'src/environments/environments';
import {
  User,
  AuthStatus,
  LoginResponse,
  CheckTokenResponse,
} from '../interfaces/index';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  private _currentUser = signal<User | null>(null);

  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Algo al mundo exterior
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;

    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      // tap(({ user, token }) => {
      //   this._currentUser.set(user);
      //   this._authStatus.set(AuthStatus.authenticated);
      //   localStorage.setItem('token', token);
      //   // console.log({ user, token });
      // }),
      // map(() => true),
      map(({ user, token }) => this.setAuthentication(user, token)),

      //Todo: errores
      // catchError((err) => {
      //   return of(false);
      // })
      catchError((err) => {
        // console.log(err);

        return throwError(() => err.error.message);
      })
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      // map(({ token, user }) => {
      //   this._currentUser.set(user);
      //   this._authStatus.set(AuthStatus.authenticated);
      //   localStorage.setItem('token', token);
      //   return true;
      // }),
      map(({ user, token }) => this.setAuthentication(user, token)),
      //error
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
