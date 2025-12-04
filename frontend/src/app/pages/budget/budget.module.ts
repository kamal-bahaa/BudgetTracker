import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetComponent } from './budget.component';
import { BudgetDialogComponent } from './budget-dialog/budget-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';


// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    BudgetComponent,
    BudgetDialogComponent
  ],
  imports: [
    CommonModule,
    BudgetRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule, 
    MatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class BudgetModule { }