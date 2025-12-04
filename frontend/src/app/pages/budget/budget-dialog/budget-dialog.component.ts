import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { Budget } from '../../../core/models/budget.model';

@Component({
  selector: 'app-budget-dialog',
  templateUrl: './budget-dialog.component.html',
  styleUrls: ['./budget-dialog.component.css'],
  standalone: false
})
export class BudgetDialogComponent {
  budgetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BudgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Budget | null
  ) {
    let initialDate = new Date();
    
    if (data?.month) {
      const parts = data.month.split('-'); 
      if (parts.length === 2) {
        initialDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
      }
    }

    this.budgetForm = this.fb.group({
      month: [initialDate, [Validators.required]],
      categories: this.fb.group({
        Food: [data?.categories?.Food || 0, [Validators.required, Validators.min(0)]],
        Transport: [data?.categories?.Transport || 0, [Validators.required, Validators.min(0)]],
        Shopping: [data?.categories?.Shopping || 0, [Validators.required, Validators.min(0)]],
        Bills: [data?.categories?.Bills || 0, [Validators.required, Validators.min(0)]],
        Other: [data?.categories?.Other || 0, [Validators.required, Validators.min(0)]]
      })
    });
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.budgetForm.get('month')!.value ?? new Date();
    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
    
    this.budgetForm.get('month')!.setValue(ctrlValue);
    datepicker.close(); 
  }

  onSave(): void {
    if (this.budgetForm.valid) {
      const rawValue = this.budgetForm.value;
      
      const dateVal = rawValue.month as Date;
      const formattedMonth = `${dateVal.getFullYear()}-${String(dateVal.getMonth() + 1).padStart(2, '0')}`;

      const finalData = {
        ...rawValue,
        month: formattedMonth
      };

      this.dialogRef.close(finalData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}