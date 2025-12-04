import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

// Components
import { LayoutComponent } from './components/layout/layout.component';

// Directives
import { HighlightDirective } from './directives/highlight.directive';

// Pipes
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [
    LayoutComponent,
    HighlightDirective,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  exports: [
    LayoutComponent,
    HighlightDirective,
    TimeAgoPipe
  ]
})
export class SharedModule { }