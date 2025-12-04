import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expense } from '../../../core/models/expense.model';

@Component({
  selector: 'app-expense-dialog',
  templateUrl: './expense-dialog.component.html',
  styleUrls: ['./expense-dialog.component.css'],
  standalone: false,
  styles: [`
    .full-width { width: 100%; margin-bottom: 12px; }
    .dialog-actions { justify-content: flex-end; padding-top: 10px; }
    .checkbox-container { margin-bottom: 15px; display: block; }
  `]
})
export class ExpenseDialogComponent {
  expenseForm: FormGroup;
  categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Expense | null
  ) {
    this.expenseForm = this.fb.group({
      title: [data?.title || '', [Validators.required]],
      amount: [data?.amount || '', [Validators.required, Validators.min(1)]], 
      category: [data?.category || 'Other', [Validators.required]],
      date: [data?.date ? new Date(data.date) : new Date(), [Validators.required]],
      isRecurring: [data?.isRecurring || false] // ✅ Added
    });
  }

  onSave(): void {
    if (this.expenseForm.valid) {
      this.dialogRef.close(this.expenseForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}