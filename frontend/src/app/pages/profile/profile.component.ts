import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = false;
  userInitials = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        const user = res.data.user;
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
        this.userInitials = user.name.slice(0, 2).toUpperCase();
        this.isLoading = false;
      },
      error: (err) => {
        this.showNotification('Failed to load profile', 'error');
        this.isLoading = false;
      }
    });
  }

  updateInfo(): void {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.showNotification('Profile updated successfully', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification(err.error?.message || 'Update failed', 'error');
      }
    });
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) return;

    const { password, confirmPassword } = this.passwordForm.value;
    if (password !== confirmPassword) {
      this.showNotification('Passwords do not match', 'error');
      return;
    }

    this.isLoading = true;
    this.profileService.updateProfile({ password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.passwordForm.reset();
        this.showNotification('Password changed successfully', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification(err.error?.message || 'Update failed', 'error');
      }
    });
  }

  deleteAccount(): void {
    if (confirm('ARE YOU SURE? This action cannot be undone. All your data will be lost forever.')) {
      this.profileService.deleteAccount().subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          this.showNotification('Account deleted', 'success');
        },
        error: (err) => {
          this.showNotification(err.error?.message || 'Failed to delete account', 'error');
        }
      });
    }
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}