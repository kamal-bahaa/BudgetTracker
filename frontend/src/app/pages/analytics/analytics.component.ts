import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  isLoading = true;

  public trendChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: []
  };
  public trendChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  public categoryChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: []
  };

  public categoryChartOptions: ChartOptions<'pie' | 'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  public incomeChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    Promise.all([
      this.loadYearlyTrend(),
      this.loadExpenseCategories(),
      this.loadIncomeSources()
    ]).then(() => {
      this.isLoading = false;
    }).catch(err => {
      console.error('Error loading analytics', err);
      this.isLoading = false;
    });
  }

  loadYearlyTrend(): Promise<void> {
    return new Promise((resolve) => {
      this.analyticsService.getYearlyTrend().subscribe(res => {
        const incomeData = new Array(12).fill(0);
        const expenseData = new Array(12).fill(0);

        // Map backend data (month 1-12) to array index (0-11)
        res.data.incomes.forEach(i => incomeData[i._id.month - 1] = i.total);
        res.data.expenses.forEach(e => expenseData[e._id.month - 1] = e.total);

        this.trendChartData = {
          ...this.trendChartData,
          datasets: [
            {
              data: incomeData,
              label: 'Income',
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              fill: true,
              tension: 0.4
            },
            {
              data: expenseData,
              label: 'Expenses',
              borderColor: '#f44336',
              backgroundColor: 'rgba(244, 67, 54, 0.2)',
              fill: true,
              tension: 0.4
            }
          ]
        };
        resolve();
      });
    });
  }

  loadExpenseCategories(): Promise<void> {
    return new Promise((resolve) => {
      this.analyticsService.getExpenseByCategory().subscribe(res => {
        const labels = res.data.map(d => d._id as string);
        const data = res.data.map(d => d.total);

        this.categoryChartData = {
          labels,
          datasets: [{
            data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        };
        resolve();
      });
    });
  }

  loadIncomeSources(): Promise<void> {
    return new Promise((resolve) => {
      this.analyticsService.getIncomeBySource().subscribe(res => {
        const labels = res.data.map(d => d._id as string);
        const data = res.data.map(d => d.total);

        this.incomeChartData = {
          labels,
          datasets: [{
            data,
            backgroundColor: ['#66bb6a', '#42a5f5', '#ffa726', '#ab47bc', '#78909c']
          }]
        };
        resolve();
      });
    });
  }
}