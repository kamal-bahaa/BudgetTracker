import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Income } from '../../core/models/income.model';
import { IncomeService } from '../../core/services/income.service';
import { IncomeDialogComponent } from './income-dialog/income-dialog.component';

@Component({
  selector: 'app-income',
  standalone: false,
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'title', 'source', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Income>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private incomeService: IncomeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadIncome();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadIncome(): void {
    this.isLoading = true;
    this.incomeService.getIncome().subscribe({
      next: (res) => {
        this.dataSource.data = res.data.income;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Failed to load income', 'error');
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
    const dialogRef = this.dialog.open(IncomeDialogComponent, {
      width: '450px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createIncome(result);
      }
    });
  }

  openEditDialog(income: Income): void {
    const dialogRef = this.dialog.open(IncomeDialogComponent, {
      width: '450px',
      data: income
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateIncome(income._id!, result);
      }
    });
  }

  createIncome(data: any): void {
    this.isLoading = true;
    this.incomeService.addIncome(data).subscribe({
      next: () => {
        this.loadIncome();
        this.showNotification('Income added successfully', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification(err.error?.message || 'Failed to add income', 'error');
      }
    });
  }

  updateIncome(id: string, data: any): void {
    this.isLoading = true;
    this.incomeService.updateIncome(id, data).subscribe({
      next: () => {
        this.loadIncome();
        this.showNotification('Income updated', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification(err.error?.message || 'Failed to update income', 'error');
      }
    });
  }

  deleteIncome(id: string): void {
    if (confirm('Are you sure you want to delete this income record?')) {
      this.isLoading = true;
      this.incomeService.deleteIncome(id).subscribe({
        next: () => {
          this.loadIncome();
          this.showNotification('Income deleted', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          this.showNotification('Failed to delete income', 'error');
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