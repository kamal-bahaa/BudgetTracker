import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/auth.model';

export interface ProfileResponse {
  status: string;
  data: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = 'http://localhost:5000/api/profile';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.API_URL);
  }

  updateProfile(data: Partial<User> & { password?: string }): Observable<ProfileResponse> {
    return this.http.patch<ProfileResponse>(this.API_URL, data).pipe(
      tap(res => {
        // Update the local user state if name/email changed
        if (res.status === 'success' && res.data.user) {
          const currentUser = this.authService.getCurrentUserValue();
          if (currentUser) {
            // Merge new data with token (token remains valid until expiry)
            const updatedUser = { ...currentUser, ...res.data.user };
            localStorage.setItem('current_user', JSON.stringify(updatedUser));
          }
        }
      })
    );
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(this.API_URL);
  }
}