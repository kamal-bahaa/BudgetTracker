import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Expense } from '../../core/models/expense.model';
import { ExpenseService } from '../../core/services/expenses.service';
import { ExpenseDialogComponent } from './expense-dialog/expense-dialog.component';

@Component({
  selector: 'app-expenses',
  standalone: false,
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['date', 'title', 'category', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Expense>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private expenseService: ExpenseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar 
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadExpenses(): void {
    this.isLoading = true;

    this.expenseService.getExpenses().subscribe({
      next: (res) => {
        this.dataSource.data = res.data.expenses;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Failed to load expenses', 'error');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '450px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createExpense(result);
      }
    });
  }

  openEditDialog(expense: Expense): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '450px',
      data: expense
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateExpense(expense._id!, result);
      }
    });
  }

  createExpense(data: any): void {
    this.isLoading = true;
    this.expenseService.addExpense(data).subscribe({
      next: () => {
        this.loadExpenses();
        this.showNotification('Expense added successfully', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification(err.error?.message || 'Failed to add expense', 'error');
      }
    });
  }

  updateExpense(id: string, data: any): void {
    this.isLoading = true;
    this.expenseService.updateExpense(id, data).subscribe({
      next: () => {
        this.loadExpenses();
        this.showNotification('Expense updated', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification(err.error?.message || 'Failed to update expense', 'error');
      }
    });
  }

  deleteExpense(id: string): void {
    if(confirm('Are you sure you want to delete this expense?')) {
      this.isLoading = true;
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.loadExpenses();
          this.showNotification('Expense deleted', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          this.showNotification('Failed to delete expense', 'error');
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