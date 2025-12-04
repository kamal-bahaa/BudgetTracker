import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Goal } from '../../../core/models/goal.model';

@Component({
  selector: 'app-goal-dialog',
  templateUrl: './goal-dialog.component.html',
  styleUrls: ['./goal-dialog.component.css'],
  standalone: false,
  styles: [`
    .full-width { width: 100%; margin-bottom: 12px; }
    .dialog-actions { justify-content: flex-end; padding-top: 10px; }
  `]
})
export class GoalDialogComponent {
  goalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GoalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Goal | null
  ) {
    this.goalForm = this.fb.group({
      title: [data?.title || '', [Validators.required, Validators.minLength(2)]],
      targetAmount: [data?.targetAmount || '', [Validators.required, Validators.min(1)]],
      currentAmount: [data?.currentAmount || 0, [Validators.required, Validators.min(0)]],
      deadline: [data?.deadline ? new Date(data.deadline) : null],
      status: [data?.status || 'in-progress', [Validators.required]]
    });
  }

  onSave(): void {
    if (this.goalForm.valid) {
      this.dialogRef.close(this.goalForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}