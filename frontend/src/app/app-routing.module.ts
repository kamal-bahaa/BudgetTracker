import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component'; 

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./pages/expenses/expenses.module').then(m => m.ExpensesModule)
      },
      {
        path: 'income',
        loadChildren: () => import('./pages/income/income.module').then(m => m.IncomeModule)
      },
      {
        path: 'goals',
        loadChildren: () => import('./pages/goals/goals.module').then(m => m.GoalsModule)
      },
      {
        path: 'budget',
        loadChildren: () => import('./pages/budget/budget.module').then(m => m.BudgetModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./pages/analytics/analytics.module').then(m => m.AnalyticsModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'summary',
        loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }