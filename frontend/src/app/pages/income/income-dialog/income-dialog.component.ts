import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Income } from '../../../core/models/income.model';

@Component({
  selector: 'app-income-dialog',
  templateUrl: './income-dialog.component.html',
  styleUrls: ['./income-dialog.component.css'],
  standalone: false,
  styles: [`
    .full-width { width: 100%; margin-bottom: 12px; }
    .dialog-actions { justify-content: flex-end; padding-top: 10px; } 
    `]
})
export class IncomeDialogComponent {
  incomeForm: FormGroup;
  sources = ['Salary', 'Freelance', 'Business', 'Investment', 'Other'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IncomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Income | null
  ) {
    this.incomeForm = this.fb.group({
      title: [data?.title || '', [Validators.required]],
      amount: [data?.amount || '', [Validators.required, Validators.min(1)]],
      source: [data?.source || 'Salary', [Validators.required]],
      date: [data?.date ? new Date(data.date) : new Date(), [Validators.required]]
    });
  }

  onSave(): void {
    if (this.incomeForm.valid) {
      this.dialogRef.close(this.incomeForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}