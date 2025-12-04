import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Budget } from '../../core/models/budget.model';
import { BudgetService } from '../../core/services/budget.service';
import { BudgetDialogComponent } from './budget-dialog/budget-dialog.component';

@Component({
  selector: 'app-budget',
  standalone: false,
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  budgets: Budget[] = [];
  isLoading = false;

  constructor(
    private budgetService: BudgetService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.isLoading = true;
    this.budgetService.getBudgets().subscribe({
      next: (res) => {
        // Sort by month descending (newest first)
        this.budgets = res.data.budgets.sort((a, b) => 
          new Date(b.month).getTime() - new Date(a.month).getTime()
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Failed to load budgets', 'error');
        this.isLoading = false;
      }
    });
  }

  calculateTotal(categories: any): number {
    return Object.values(categories).reduce((sum: any, val: any) => sum + (val || 0), 0) as number;
  }

openAddDialog(): void {
    const dialogRef = this.dialog.open(BudgetDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const exists = this.budgets.find(b => b.month === result.month);
        if (exists) {
          this.showNotification('Budget for this month already exists. Please edit the existing one.', 'error');
          return;
        }
        this.createBudget(result);
      }
    });
  }

  openEditDialog(budget: Budget): void {
    const dialogRef = this.dialog.open(BudgetDialogComponent, {
      width: '500px',
      data: budget
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateBudget(budget._id!, result);
      }
    });
  }

  createBudget(data: any): void {
    this.isLoading = true;
    this.budgetService.addBudget(data).subscribe({
      next: () => {
        this.loadBudgets();
        this.showNotification('Budget plan created successfully', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification(err.error?.message || 'Failed to create budget', 'error');
      }
    });
  }

  updateBudget(id: string, data: any): void {
    this.isLoading = true;
    this.budgetService.updateBudget(id, data).subscribe({
      next: () => {
        this.loadBudgets();
        this.showNotification('Budget updated successfully', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification(err.error?.message || 'Failed to update budget', 'error');
      }
    });
  }

  deleteBudget(id: string): void {
    if (confirm('Are you sure you want to delete this budget plan?')) {
      this.isLoading = true;
      this.budgetService.deleteBudget(id).subscribe({
        next: () => {
          this.loadBudgets();
          this.showNotification('Budget deleted', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          this.showNotification('Failed to delete budget', 'error');
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