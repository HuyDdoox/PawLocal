import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponseData } from '../models/user.model';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'pawlocal_token';
  private readonly USER_KEY = 'pawlocal_user';

  // Signals for state
  readonly currentUser = signal<User | null>(this.getStoredUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }): Observable<ApiResponse<AuthResponseData>> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.API_URL}/register`, userData)
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.setSession(res.data.token, res.data.user);
          }
        })
      );
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<ApiResponse<AuthResponseData>> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.setSession(res.data.token, res.data.user);
          }
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    this.currentUser.set(user);
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
}
