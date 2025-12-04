import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardOverview, RecentTransaction } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  
  overview: DashboardOverview = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    incomeCount: 0,
    expenseCount: 0
  };

  recentTransactions: RecentTransaction[] = [];
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getOverview().subscribe({
      next: (response) => {
        console.log('Dashboard data:', response);
        this.overview = response.data.overview;
        this.recentTransactions = response.data.recentTransactions || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Dashboard error:', error);
        this.errorMessage = error || 'Failed to load dashboard data';
        this.isLoading = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}