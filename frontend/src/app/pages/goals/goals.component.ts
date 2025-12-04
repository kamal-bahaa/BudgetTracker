import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Goal } from '../../core/models/goal.model';
import { GoalService } from '../../core/services/goal.service';
import { GoalDialogComponent } from './goal-dialog/goal-dialog.component';

@Component({
  selector: 'app-goals',
  standalone: false,
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  isLoading = false;

  constructor(
    private goalService: GoalService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.isLoading = true;
    this.goalService.getGoals().subscribe({
      next: (res) => {
        this.goals = res.data.goals;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Failed to load goals', 'error');
        this.isLoading = false;
      }
    });
  }

  calculateProgress(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(GoalDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createGoal(result);
      }
    });
  }

  openEditDialog(goal: Goal): void {
    const dialogRef = this.dialog.open(GoalDialogComponent, {
      width: '500px',
      data: goal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateGoal(goal._id!, result);
      }
    });
  }

  createGoal(data: any): void {
    this.isLoading = true;
    this.goalService.addGoal(data).subscribe({
      next: () => {
        this.loadGoals();
        this.showNotification('Goal created successfully!', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification(err.error?.message || 'Failed to create goal', 'error');
      }
    });
  }

  updateGoal(id: string, data: any): void {
    this.isLoading = true;
    this.goalService.updateGoal(id, data).subscribe({
      next: () => {
        this.loadGoals();
        this.showNotification('Goal updated!', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification('Failed to update goal', 'error');
      }
    });
  }

  deleteGoal(id: string): void {
    if (confirm('Delete this goal?')) {
      this.isLoading = true;
      this.goalService.deleteGoal(id).subscribe({
        next: () => {
          this.loadGoals();
          this.showNotification('Goal deleted', 'success');
        },
        error: () => {
          this.isLoading = false;
          this.showNotification('Failed to delete goal', 'error');
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