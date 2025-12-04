import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!storedUser);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }


  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.status === 'success' && response.data.token) {
          this.storeAuthData(response.data.token, response.data.user);
          this.currentUserSubject.next(response.data.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
        if (response.status === 'success' && response.data.token) {
          this.storeAuthData(response.data.token, response.data.user);
          this.currentUserSubject.next(response.data.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  // ============================================
  // TOKEN MANAGEMENT
  // ============================================

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // ============================================
  // PRIVATE HELPER METHODS
  // ============================================

  private storeAuthData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
        return null;
      }
    }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = payload.exp * 1000;
      return Date.now() >= expirationDate;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * ✅ Handle HTTP errors with user-friendly messages
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Server-side error
      if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request. Please check your input.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (error.status === 404) {
        errorMessage = 'Service not found. Please try again later.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      }
    }

    console.error('Auth Service Error:', error);
    return throwError(() => errorMessage);
  }
}