import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardOverview, RecentTransaction } from '../../core/models/dashboard.model';
import { ChartConfiguration, ChartOptions } from 'chart.js'; 

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

  public chartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [0, 0], 
      backgroundColor: ['#27ae60', '#e74c3c'], 
      hoverBackgroundColor: ['#2ecc71', '#c0392b']
    }]
  };

  public chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }
    }
  };

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
        
        this.updateChart();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Dashboard error:', error);
        this.errorMessage = error || 'Failed to load dashboard data';
        this.isLoading = false;
      }
    });
  }

  updateChart(): void {
    this.chartData = {
      ...this.chartData,
      datasets: [{
        ...this.chartData.datasets[0],
        data: [this.overview.totalIncome, this.overview.totalExpenses]
      }]
    };
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}